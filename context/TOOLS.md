# TOOLS.md

The ledger of Trust Boundary crossings. One row per external service this
repository depends on. Read by the agent on every task, so keep it short: a
service not in use does not belong here.

Never put a credential in this file. A key, token, or password anywhere in
the repository is graded as a security failure regardless of the rest.

Each crossing statement answers three questions in one first-person sentence:
what crosses, to whom, and who is accountable.

| Service | Trusted with | Credentials live | Crossing statement | Switching cost |
|---|---|---|---|---|
| Cloudflare Workers + D1 | Every entry a user types; request metadata (IP, timestamp) that Cloudflare logs by default | Cloudflare dashboard login; wrangler token inside the Codespace | "User entries leave the browser and are stored on D1 under Cloudflare's free-tier terms, in a region I did not choose. I am accountable." | Medium: `wrangler d1 export`, rewrite one Worker for another host |
| GitHub + Codespaces | Source code, commit history, branch metadata, and the devcontainer setup used to run the project in the cloud | GitHub account (SSO) | "My code, commit history, and the devcontainer setup cross to GitHub and Codespaces so the project can run in the browser and in the cloud, and I am accountable." | Low: disconnect the repository from Codespaces and move the project to a local or self-hosted environment |
| GitHub Copilot | Repository content, prompts, and code context used to generate suggestions | GitHub account | "My repository contents and prompts cross to GitHub Copilot so it can suggest code, and I am accountable for reviewing and accepting what it returns." | Low: disable Copilot and use a local editor or another AI tool |
| wrangler (npm) | Project config, Worker metadata, and local Cloudflare login state while I deploy and manage the app | None in the repo, but it holds the Cloudflare login token above | "The project config and deploy metadata cross to Wrangler and Cloudflare when I authenticate and publish the Worker, and I am accountable for what I deploy." | Medium: install a different deployment tool or migrate the Worker to another platform |

## Revisit triggers

- A new service is added to the repository.
- A vendor changes pricing, terms, or region.
- A credential moves.
