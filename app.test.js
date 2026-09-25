const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function makeElement() {
  return {
    value: '',
    textContent: '',
    hidden: false,
    children: [],
    replaceChildren() {
      this.children = [];
    },
    append(child) {
      this.children.push(child);
    },
    addEventListener(event, handler) {
      this[event] = handler;
    }
  };
}

async function loadApp(storage = {}) {
  const elements = {};
  const ids = [
    'skills-input',
    'job-input',
    'evaluate-button',
    'status-message',
    'result-card',
    'target-role',
    'match-score',
    'match-summary',
    'matched-list',
    'missing-list'
  ];

  for (const id of ids) {
    elements[id] = makeElement();
  }

  elements['result-card'].hidden = true;

  const document = {
    querySelector(selector) {
      if (selector.startsWith('#')) {
        return elements[selector.slice(1)];
      }
      return null;
    },
    createElement() {
      return makeElement();
    }
  };

  const context = {
    window: {
      localStorage: {
        getItem(key) {
          return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
        },
        setItem(key, value) {
          storage[key] = String(value);
        }
      }
    },
    fetch: async () => ({
      ok: true,
      json: async () => []
    }),
    document,
    console
  };

  vm.createContext(context);
  vm.runInContext(fs.readFileSync('app.js', 'utf8'), context);
  await new Promise(resolve => setImmediate(resolve));

  return {
    elements,
    storage,
    async clickEvaluate() {
      await elements['evaluate-button'].click();
    }
  };
}

test('EARS 1: compares two normalized lists and computes a percentage match', async () => {
  const { elements, clickEvaluate } = await loadApp();

  elements['skills-input'].value = 'Python, SQL, AWS';
  elements['job-input'].value = 'Python, SQL, ETL, AWS';

  await clickEvaluate();

  assert.equal(elements['match-score'].textContent, '75%');
  assert.equal(elements['match-summary'].textContent, 'Strong fit. This role looks like a realistic match.');
  console.log('EARS 1 passed');
});

test('EARS 2: empty user or job list blocks the comparison', async () => {
  const { elements, clickEvaluate } = await loadApp();

  elements['skills-input'].value = '';
  elements['job-input'].value = 'Python';
  await clickEvaluate();
  assert.equal(elements['status-message'].textContent, 'Enter at least one skill you know before checking a role.');

  elements['skills-input'].value = 'Python';
  elements['job-input'].value = '';
  await clickEvaluate();
  assert.equal(elements['status-message'].textContent, 'Add the job requirements to compare against your skills.');
  console.log('EARS 2 passed');
});

test('EARS 3: 100% match shows a full score and no missing skills', async () => {
  const { elements, clickEvaluate } = await loadApp();

  elements['skills-input'].value = 'Python, SQL, AWS';
  elements['job-input'].value = 'Python, SQL, AWS';

  await clickEvaluate();

  assert.equal(elements['match-score'].textContent, '100%');
  assert.equal(elements['missing-list'].children.length, 0);
  assert.equal(elements['match-summary'].textContent, 'Strong fit. This role looks like a realistic match.');
  console.log('EARS 3 passed');
});

test('EARS 4: 50% to 99% yields a potential-fit summary and a missing list', async () => {
  const { elements, clickEvaluate } = await loadApp();

  elements['skills-input'].value = 'Python, SQL';
  elements['job-input'].value = 'Python, SQL, ETL, AWS';

  await clickEvaluate();

  assert.equal(elements['match-score'].textContent, '50%');
  assert.equal(elements['match-summary'].textContent, 'Partial fit. A few tools are missing, but the role may still be worth pursuing.');
  assert.ok(elements['missing-list'].children.some(item => item.textContent === 'ETL'));
  assert.ok(elements['missing-list'].children.some(item => item.textContent === 'AWS'));
  console.log('EARS 4 passed');
});

test('EARS 5: below 50% shows a weak-fit summary and missing skills', async () => {
  const { elements, clickEvaluate } = await loadApp();

  elements['skills-input'].value = 'Python';
  elements['job-input'].value = 'Python, SQL, ETL, AWS';

  await clickEvaluate();

  assert.equal(elements['match-score'].textContent, '25%');
  assert.equal(elements['match-summary'].textContent, 'Weak fit. The missing requirements are significant for this role.');
  assert.ok(elements['missing-list'].children.some(item => item.textContent === 'SQL'));
  assert.ok(elements['missing-list'].children.some(item => item.textContent === 'ETL'));
  assert.ok(elements['missing-list'].children.some(item => item.textContent === 'AWS'));
  console.log('EARS 5 passed');
});

test('EARS 6: matched and missing skills are rendered in separate lists for review', async () => {
  const { elements, clickEvaluate } = await loadApp();

  elements['skills-input'].value = 'Python, SQL';
  elements['job-input'].value = 'Python, SQL, ETL';

  await clickEvaluate();

  assert.ok(elements['matched-list'].children.some(item => item.textContent === 'Python'));
  assert.ok(elements['matched-list'].children.some(item => item.textContent === 'SQL'));
  assert.ok(elements['missing-list'].children.some(item => item.textContent === 'ETL'));
  assert.notEqual(elements['matched-list'].children.length, 0);
  assert.notEqual(elements['missing-list'].children.length, 0);
  console.log('EARS 6 passed');
});

test('EARS 7: blank items and duplicate values are ignored after normalization', async () => {
  const { elements, clickEvaluate } = await loadApp();

  elements['skills-input'].value = 'Python, , SQL, Python';
  elements['job-input'].value = 'Python, SQL, SQL';

  await clickEvaluate();

  assert.equal(elements['match-score'].textContent, '100%');
  assert.equal(elements['missing-list'].children.length, 0);
  console.log('EARS 7 passed');
});

test('EARS 8: saved skill lists survive a page reload after comparison', async () => {
  const firstLoad = await loadApp();

  firstLoad.elements['skills-input'].value = 'Python, Java, Go, Rust';
  firstLoad.elements['job-input'].value = 'Python, Go, Databricks';
  await firstLoad.clickEvaluate();

  assert.equal(firstLoad.elements['match-score'].textContent, '67%');

  const reloadedPage = await loadApp(firstLoad.storage);

  assert.equal(reloadedPage.elements['skills-input'].value, 'Python, Java, Go, Rust');
  assert.equal(reloadedPage.elements['job-input'].value, 'Python, Go, Databricks');
  console.log('EARS 8 passed');
});
