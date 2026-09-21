# Features and specification

## Kano-Classified Feature List

**Classification date:** 09/10/2026

| # | Feature | Kano class | Reason from research |
|---|---------|-----------|----------------------|
| 1 | Job is tech oriented | Must-be | The main need is a software/data engineering role, not a non-technical job. |
| 2 | Job requirements | Performance | Closer alignment between requirements and skills increases value; job descriptions are often preferred profiles, not strict checklists. |
| 3 | Recruiter/Hiring Manager information | Attractive | Helpful for outreach and visibility, but not required to evaluate a role. |
| 4 | Learning all technologies for a single job requirement | Indifferent | Candidates do not need to match every listed technology; partial fit can still be relevant. |
| 5 | Job offer | Must-be | Getting interviews and offers is the core purpose of the feature. |
| 6 | Salary | Performance | Better compensation makes a role more attractive, but the opportunity may still be worth pursuing if the fit is strong. |

---

## 1. Context

The primary user is a senior Computer Science student at Georgia Tech pursuing software engineering or data engineering roles across the United States. They are open to relocation and expect to graduate in December 2026, so they need to decide quickly which opportunities are worth applying to and which ones are likely to be a poor fit. The core challenge is evaluating whether a role is still worth pursuing when the posted requirements are only a partial match, while also finding openings that may not appear on major job boards.

---

## 2. Users

This feature is designed for early-career technical job seekers navigating competitive hiring pipelines. It reflects the experiences of a candidate who relied on projects and networking instead of internship experience, and a recruiter who evaluates candidates based on potential and fit rather than strict checklist compliance.

---

## 3. Scope

**This does:**
- Help the user decide whether a role is worth pursuing when the requirements are only a partial match.
- Find opportunities beyond major job boards, including company pages, alumni, and recruiter channels.
- Support decisions using projects, relevant experience, and network signals instead of rigid checklist thinking.

**This deliberately does not do:**
- Guarantee interviews or offers.
- Replace networking, portfolio work, or direct outreach.
- Treat every job description as equally relevant or every role as a good fit.

---

## 4. Behavior

- The user compares a role’s requirements against their background, including coursework, projects, relevant experience, and job-specific skills.
- If a role is not an exact match, the user can still assess whether it is worth pursuing when the core responsibilities, toolset, and growth potential are aligned.
- The user searches across multiple channels, not just major job boards, including company career pages, alumni networks, recruiter outreach, and other less visible sources.

---

## 5. Constraints

- The feature is for a student in the final semester before graduation, when application timing and volume matter.
- It should rely only on user-provided or public information, such as resume details, projects, and job descriptions.
- It should not require private employer data or internal hiring records.
- It must support multiple job-search channels rather than depending on one platform.

---

## 6. Acceptance

- WHEN the user enters two comma- or line-separated lists, THE SYSTEM SHALL compare the list values by normalized skill names and compute a percentage match as the integer value of round((matchedSkillCount / totalJobSkillCount) * 100), where totalJobSkillCount is the number of unique normalized skills in the job list.
- IF either list is empty after trimming and removing blanks, THEN THE SYSTEM SHALL display a validation message and SHALL NOT compute a match score.
- IF the computed match score is 100%, THEN THE SYSTEM SHALL display 100% and SHALL show no missing-skill entries.
- IF the computed match score is between 50% and 99%, THEN THE SYSTEM SHALL display a potential-fit summary and list the qualifications that are missing from the user’s list.
- IF the computed match score is below 50%, THEN THE SYSTEM SHALL display a weak-fit summary and list all missing qualifications in descending order of the job list.
- IF the computed match score is between 0% and 100% inclusive, THEN THE SYSTEM SHALL show the matched skills and missing skills as separate lists to support objective review of the comparison.
- THE SYSTEM SHALL ignore blank entries and duplicate values after normalization so that match calculations are repeatable and objectively testable.
- IF the user reloads the page after comparing two lists, THEN THE SYSTEM SHALL restore both entered lists from saved browser state.

---

## Handoff Test

*A competent stranger would still need to know which evidence sources are considered strong enough to justify applying to a role, and how the system should weigh factors such as project quality, recruiter connections, and experience gaps. This specification is based on two interviews and should be treated as a practical starting point rather than a fully validated model of hiring behavior.*

## Verification

| Criterion | Steps and input | Expected result | Observed result | Status | Evidence / commit |
|---|---|---|---|---|---|
| EARS 1: normalized comparison | Enter user list `Python, SQL, AWS` and job list `Python, SQL, ETL, AWS`, then click Compare fit. | Score is 75% and the summary reflects a strong fit. | Score displayed as 75% and the strong-fit summary was shown. | PASS | Verified by `node --test app.test.js` with EARS 1 test. |
| EARS 2: empty input validation | Enter an empty user list with `Python` in the job list, then click Compare fit. Also test the reverse. | Validation message appears and no score is computed. | The status message was `Enter at least one skill you know before checking a role.` and then `Add the job requirements to compare against your skills.` | PASS | Verified by `node --test app.test.js` with EARS 2 test. |
| EARS 3: exact match | Enter user list `Python, SQL, AWS` and job list `Python, SQL, AWS`, then click Compare fit. | Score is 100% and missing list is empty. | Score displayed as 100% and missing list had zero entries. | PASS | Verified by `node --test app.test.js` with EARS 3 test. |
| EARS 4: partial fit threshold | Enter user list `Python, SQL` and job list `Python, SQL, ETL, AWS`, then click Compare fit. | Score is 50% and missing skills are listed. | Score displayed as 50% and the missing list included `ETL` and `AWS`. | PASS | Verified by `node --test app.test.js` with EARS 4 test. |
| EARS 5: weak fit threshold | Enter user list `Python` and job list `Python, SQL, ETL, AWS`, then click Compare fit. | Score is below 50% and the weak-fit summary appears. | Score displayed as 25% and the weak-fit summary was shown. | PASS | Verified by `node --test app.test.js` with EARS 5 test. |
| EARS 6: separate matched/missing lists | Enter user list `Python, SQL` and job list `Python, SQL, ETL`, then click Compare fit. | Matched and missing lists are both shown. | Matched list retained `Python` and `SQL`; missing list retained `ETL`. | PASS | Verified by `node --test app.test.js` with EARS 6 test. |
| EARS 7: normalization and deduplication | Enter `Python, , SQL, Python` and `Python, SQL, SQL`, then click Compare fit. | Blank items and duplicates are ignored, and score is 100%. | Score displayed as 100% and missing list stayed empty. | PASS | Verified by `node --test app.test.js` with EARS 7 test. |
| EARS 8: saved lists survive reload | Enter user list `Python, Java, Go, Rust` and job list `Python, Go, Databricks`, compare, then reload the page. | The percentage is generated and both entered lists remain available after reload. | Score displayed as 67%, and both lists were restored after reload; behavior was also manually checked. | PASS | Verified by `node --test app.test.js` with EARS 8 test and manual check. |

Cover a normal action, relevant invalid input, and persistence or failure. Classify unselected requirements separately. Record actual outcomes; all-PASS is acceptable with evidence.
