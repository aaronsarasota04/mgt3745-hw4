# Session B Commands and HW4 Checklist

This repository is the HW4 template. Create your own copy with **Use this
template**, name it `mgt3745-hw4`, and open it in a Codespace. Your HW3
repository stays exactly as you submitted it; link it from your new README.

## Step 0: Bring Your HW3 Work In

Copy these files from your HW3 repository over the template's, by name:

- `index.html`, `styles.css`, `app.js` (the template's wired `app.js` is kept for you in `docs/app.reference.js`)
- the `docs` folder (your HW3 GIF)
- `context/PROJECT.md`, `USERS.md`, `FEATURES.md`, `STANDARDS.md`, `ARCHITECTURE.md`, `CLAUDE.md`
- `context/curiosity/`

Do **not** copy your HW3 `TOOLS.md` or `STYLE.md`. Those were previews; the
template holds the real formats. Everything else in the template stays.

The HW4 skeletons that were in the template's context files are in
`docs/CONTEXT_HW4_ADDITIONS.md`. Paste them into yours when you reach Part One.

## Session B, in Commands

Copy from here. Type nothing from the slides.

```bash
# Preflight (the devcontainer already installed xdg-utils and ran npm install;
# if wrangler is missing, run these two lines first)
sudo apt-get install -y xdg-utils   # needed by wrangler login inside a Codespace
npm install

npx wrangler --version
npx wrangler login --device         # approve in the browser tab; this token is a crossing

# Step 1: create the database
npx wrangler d1 create mgt3745-entries
#   paste the database_id it prints into wrangler.toml, replacing PASTE_ID_HERE
npx wrangler d1 execute mgt3745-entries --remote --file=schema.sql

# Step 3: deploy and hit it
npx wrangler deploy
#   prints https://mgt3745-hw4.<your-subdomain>.workers.dev
#   open <that url>/entries in a tab; expect []

curl -X POST https://mgt3745-hw4.<your-subdomain>.workers.dev/entries \
  -H 'content-type: application/json' \
  -d '{"text":"first crossing"}'
#   expect 201; reload the tab; expect one entry
```

If curl intimidates, paste this into the browser console on any page instead:

```js
fetch("https://mgt3745-hw4.<your-subdomain>.workers.dev/entries", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ text: "first crossing" })
}).then(r => console.log(r.status));
```

## Step 4: Wire It to Your HW3 Page

Replace the two localStorage lines in your `app.js`. Render is unchanged;
`textContent` still applies. `docs/app.reference.js` shows the whole thing
wired; read it rather than pasting it.

```js
const API = "https://mgt3745-hw4.<your-subdomain>.workers.dev";

async function load() {
  const res = await fetch(API + "/entries");
  if (!res.ok) { showError("could not load"); return []; }
  return res.json();
}

async function save(entry) {
  const res = await fetch(API + "/entries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(entry)
  });
  if (!res.ok) showError("could not save");
}
```

`showError` is yours to write: put the message somewhere on the page a user
would see it. Do not throw in the console.

Run the page: right-click `index.html`, **Open with Live Server**. The demo:
add an entry. DevTools, Application, Clear site data. Reload. The entry is
still there. That is your See It Work GIF.

## Common Failures

| Symptom | Cause | Fix |
|---|---|---|
| `wrangler login` hangs or errors about opening a browser | Codespace has no browser; `xdg-utils` missing | `sudo apt-get install -y xdg-utils`, then `npx wrangler login --device`. |
| `wrangler deploy` complains about wrangler.toml | Broken TOML after pasting the id | Keep the quotes around the id. Change nothing else on that line. |
| Deployed Worker returns 500 on GET | Schema ran locally, not on Cloudflare | Rerun `d1 execute` with `--remote`. |
| Browser console: blocked by CORS policy | Worker missing the CORS headers, or the OPTIONS branch | Both are in the template `worker.js`. Compare yours line by line. |
| POST returns 400 "body must be JSON" | Missing `content-type` header or invalid JSON | Copy the fetch above exactly. |
| `PASTE_ID_HERE` still in wrangler.toml | Step 1 not finished | Run `d1 create` and paste the id. |
| Page loads but list is empty and status says "could not reach the server" | `API` in app.js still says YOUR-SUBDOMAIN | Paste your real Worker URL. |

## Running Locally (Optional)

`npm run dev` starts the Worker on port 8787 with a local D1 emulator. We skip
it in Session B so the crossing is real; it is useful later for testing the
failure modes your verification table needs. Run the schema locally first
with `npx wrangler d1 execute mgt3745-entries --local --file=schema.sql`.

## Before HW4 Is Done

- Your HW3 files are in, and the README links your HW3 repository.
- `wrangler.toml` has a real id and no secrets.
- `worker.js` has one validation rule of yours, traced to an EARS statement.
- `CORS` origin narrowed from `*` to your page's origin (Craft credit).
- ADR-002 written; ADR-001 marked Superseded and unedited.
- TOOLS.md has at least four rows with crossing statements.
- STYLE.md has at least four tokens, one sentence each, and two refusals.
- Deployed URL is in the README and returns `[]` or entries, never an error.
- Both URLs (repository and Worker) pasted into Canvas.
