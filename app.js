(() => {
  'use strict';

  // Keep saved drafts scoped to this feature and avoid accidental global variables.
  const storageKey = 'mgt3745.job-fit.v1';
  const userSkillsInput = document.querySelector('#skills-input');
  const jobInput = document.querySelector('#job-input');
  const evaluateButton = document.querySelector('#evaluate-button');
  const statusMessage = document.querySelector('#status-message');
  const resultCard = document.querySelector('#result-card');
  const matchScore = document.querySelector('#match-score');
  const matchSummary = document.querySelector('#match-summary');
  const matchedList = document.querySelector('#matched-list');
  const missingList = document.querySelector('#missing-list');

  // Map common user-entered terms to stable labels used by the comparison result.
  const skillCatalog = [
    { label: 'Python', aliases: ['python', 'py'] },
    { label: 'JavaScript', aliases: ['javascript', 'js'] },
    { label: 'SQL', aliases: ['sql'] },
    { label: 'Java', aliases: ['java'] },
    { label: 'React', aliases: ['react'] },
    { label: 'Node.js', aliases: ['node.js', 'node', 'nodejs'] },
    { label: 'AWS', aliases: ['aws', 'amazon web services'] },
    { label: 'Docker', aliases: ['docker'] },
    { label: 'Kubernetes', aliases: ['kubernetes', 'k8s'] },
    { label: 'ETL', aliases: ['etl', 'extract transform load'] },
    { label: 'Spark', aliases: ['spark'] },
    { label: 'Git', aliases: ['git'] },
    { label: 'REST APIs', aliases: ['rest api', 'rest apis', 'api design'] },
    { label: 'Tableau', aliases: ['tableau'] },
    { label: 'Power BI', aliases: ['power bi', 'powerbi'] },
    { label: 'Excel', aliases: ['excel'] },
    { label: 'Machine Learning', aliases: ['machine learning', 'ml'] },
    { label: 'Statistics', aliases: ['statistics', 'statistical analysis'] },
    { label: 'Data Modeling', aliases: ['data modeling', 'data model'] },
    { label: 'Leadership', aliases: ['leadership', 'mentoring'] }
  ];

  // Normalize synonyms before comparison so common abbreviations count as the same skill.
  function normalizeSkill(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9+#\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Split comma- and line-separated input into non-empty entries for comparison.
  function parseList(value) {
    return value
      .split(/[\n,]+/)
      .map(part => part.trim())
      .filter(Boolean);
  }

  // Convert each entered item to one canonical skill name without changing the input text.
  function canonicalSkillName(value) {
    const normalized = normalizeSkill(value);
    if (!normalized) {
      return value.trim();
    }

    for (const skill of skillCatalog) {
      if (skill.aliases.some(alias => normalizeSkill(alias) === normalized || normalized.includes(normalizeSkill(alias)))) {
        return skill.label;
      }
    }

    return value.trim();
  }

  // Build a unique list of canonical skills from the user's free-form entries.
  function extractSkills(value) {
    const entries = parseList(value);
    const found = [];

    entries.forEach(entry => {
      const canonical = canonicalSkillName(entry);
      if (canonical && !found.includes(canonical)) {
        found.push(canonical);
      }
    });

    return found;
  }

  // Render a safe text-only list and allow empty lists to stay empty when a perfect match has no missing skills.
  function renderList(listNode, items, emptyText = 'No skill match yet.') {
    listNode.replaceChildren();

    if (items.length === 0) {
      if (emptyText === null) {
        return;
      }

      const item = document.createElement('li');
      item.textContent = emptyText;
      listNode.append(item);
      return;
    }

    items.forEach(itemText => {
      const item = document.createElement('li');
      item.textContent = itemText;
      listNode.append(item);
    });
  }

  // Read and validate the last draft, falling back safely when storage is unavailable or corrupt.
  function loadState() {
    try {
      const storedText = window.localStorage.getItem(storageKey);
      if (storedText === null) {
        return { userSkills: '', jobText: '' };
      }

      const parsed = JSON.parse(storedText);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Unexpected stored data');
      }

      return {
        userSkills: typeof parsed.userSkills === 'string' ? parsed.userSkills : '',
        jobText: typeof parsed.jobText === 'string' ? parsed.jobText : ''
      };
    } catch {
      statusMessage.textContent = 'Saved entries could not be read. Your current form values stay in place until you save again.';
      return { userSkills: '', jobText: '' };
    }
  }

  // Persist the complete draft and report storage failures without discarding form values.
  function saveState(nextState) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextState));
      return true;
    } catch {
      statusMessage.textContent = 'Could not save. Your typed values are still here and can be retried.';
      return false;
    }
  }

  // Validate both inputs, calculate the percentage, and update only the result view.
  function evaluateMatch() {
    const userSkills = extractSkills(userSkillsInput.value);
    const jobText = jobInput.value.trim();

    if (!userSkills.length) {
      statusMessage.className = 'status-text validation-message';
      statusMessage.textContent = 'Enter at least one skill you know before checking a role.';
      resultCard.hidden = true;
      return;
    }

    if (!jobText) {
      statusMessage.className = 'status-text validation-message';
      statusMessage.textContent = 'Add the job requirements to compare against your skills.';
      resultCard.hidden = true;
      return;
    }

    const jobRequirements = extractSkills(jobText);
    const matchedSkills = jobRequirements.filter(skill =>
      userSkills.some(userSkill => normalizeSkill(userSkill) === normalizeSkill(skill))
    );
    const missingSkills = jobRequirements.filter(skill => !matchedSkills.includes(skill));
    const score = jobRequirements.length === 0
      ? 0
      : Math.round((matchedSkills.length / jobRequirements.length) * 100);

    const statusText = score >= 75
      ? 'Strong fit. This role looks like a realistic match.'
      : score >= 50
        ? 'Partial fit. A few tools are missing, but the role may still be worth pursuing.'
        : 'Weak fit. The missing requirements are significant for this role.';

    matchScore.textContent = `${score}%`;
    matchSummary.textContent = statusText;
    renderList(matchedList, matchedSkills);
    renderList(missingList, missingSkills, score === 100 ? null : 'No skill match yet.');
    resultCard.hidden = false;
    statusMessage.className = 'status-text';
    statusMessage.textContent = 'Match check complete.';

    saveState({
      userSkills: userSkillsInput.value,
      jobText: jobInput.value
    });
  }

  // Restore the draft before wiring autosave so a failed storage write never clears typed input.
  const savedState = loadState();
  userSkillsInput.value = savedState.userSkills;
  jobInput.value = savedState.jobText;

  // Persist each field independently so a reload does not discard an in-progress comparison.
  userSkillsInput.addEventListener('input', () => {
    saveState({
      userSkills: userSkillsInput.value,
      jobText: jobInput.value
    });
  });

  jobInput.addEventListener('input', () => {
    saveState({
      userSkills: userSkillsInput.value,
      jobText: jobInput.value
    });
  });

  evaluateButton.addEventListener('click', evaluateMatch);
})();

