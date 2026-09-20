# HW4 Additions for Your Context Files

You copied your HW3 context files over the template's. Good. The template's
versions carried a few HW4 skeletons; here they are, to paste into yours.

## ARCHITECTURE.md: paste above ADR-001

```markdown
## The Gate: HW4 rerun

Where should entries live now that they must survive a cleared cache?

| Criterion | Weight | Build (Worker + D1) | Buy (hosted BaaS) | Delegate (AI builder hosts it) |
|---|---|---|---|---|
| Cost to start | | | | |
| Cost to maintain | | | | |
| Time to working | | | | |
| Inspectability | | | | |
| Switching cost | | *scored from Session B experience* | | |
| Fit to spec | | | | |
| **Weighted total** | | | | |

## ADR-002: Entries move from localStorage to Cloudflare D1

**Status:** Proposed
**Supersedes:** ADR-001

### Context
What data leaves the browser, to which vendor, under what terms, and who is accountable.

### Decision

### Alternatives considered

### Consequences
At least one thing that got harder.

### Revisit trigger
```

Then change ADR-001's status line to `**Status:** Superseded by ADR-002` and
edit nothing else in it.

## FEATURES.md: add to the Verification table

| Statement | HW3 verdict | HW4 verdict | Reason |
|---|---|---|---|
| Survive cleared cache | CANNOT TEST YET | | now testable |
| Server unreachable | | | how would you simulate an outage? |
| Server returns 500 | | | |
| Server returns 400 | | | |
| Second client writes to the same table | | | DEFERRED if ADR-002 says so |

And one EARS unwanted-behavior statement for the validation rule you add to
`worker.js`: `IF ..., THEN THE SYSTEM SHALL reject it and say why.`

## STANDARDS.md: three new rules

- User values reach SQL through `bind()`, never string concatenation.
- No credential in the repository. Database ids are addresses and may appear in `wrangler.toml`.
- A failed request is shown to the user on the page and is never thrown in the console.

## CLAUDE.md: restate them for the agent

- Never build SQL by concatenating strings. Use `prepare(...).bind(...)`.
- Never write a credential, token, or key into any file in this repository.
- Never add a dependency without adding a row to TOOLS.md.
- Handle failed responses on the page. Never throw to the console.
