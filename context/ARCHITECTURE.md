# Architecture

Status: ACTIVE in Module 3.

## Gate

| Criterion | Weight | Hand-built option | Existing-service option | AI-assisted build |
|---|---:|---:|---:|---:|
| Cost to start |2 |1 |2 |4 |
| Cost to maintain |4 |3 |3 |4 |
| Time to working |4 |3 |1 |4 |
| Inspectability |5 |3 |3 |4 |
| Switching cost |2 |3 |3 |4 |
| Fit to spec |4 |3 |1 |5 |

## ADR-001

Title and date: Browser-based job-fit calculator built with AI assistance, 2026-09-13
Status: Accepted

Door: Delegate. We choose a browser-based build using AI assistance during implementation rather than purchasing an existing service or delegating the app to a third-party provider.

Context: Feature 2 is a performance-class need: the product should help a student decide whether a role is worth pursuing when the posted requirements are only a partial match. The workflow should be transparent and user-controlled: the user supplies their résumé or qualifications, the job description lists required technologies and skills, and the app calculates how many requirements are covered. This keeps the decision grounded in evidence the user can inspect while still using AI assistance to accelerate implementation and improve clarity of the fit analysis.

Decision: We choose the Build option, with AI assistance during implementation. The weighted scores are strongest overall for the build path: hand-built option scores 59, existing-service option scores 45, and AI-assisted build scores 88, with the largest advantages in inspectability, time to working, and fit to spec. The 1/3/5 anchors were used consistently: 1 = least favorable, 3 = moderate, 5 = most favorable. We will build a browser-based app that compares user-entered skills or résumé evidence against job requirements and shows a percentage match, missing requirements, and a simple fit summary. The build process may use AI support, but the app itself remains a deterministic browser-based calculator.

Consequences: The chosen architecture keeps the feature fast, easy to inspect, and easy to test in a browser environment while avoiding backend cost, external dependencies, and unnecessary complexity. It supports a transparent comparison workflow in which the user can see the role requirements, their own skill list, and the resulting percentage without needing a database or a paid service. The tradeoff is that it does not yet weight individual job skills by business importance, so a role with a few critical requirements may still look more favorable than it truly is. This also means it does not support multi-user persistence, richer recruiter data, or advanced analytics beyond a local prototype. It does not guarantee interviews or offers; it only helps the user decide whether a role is worth pursuing. Revisit this ADR when the product needs weighted skill importance, shared storage, or a backend-driven matching model.
