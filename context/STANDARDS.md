# Standards

1. Job-to-skill comparisons use percentages to consistently represent the degree of alignment between a user's skills and a job's requirements.
2. Each JavaScript function has a distinct purpose and remains loosely coupled to other functions to support future expansion.
3. Comments explain the purpose of all JavaScript, HTML, and CSS sections so that other developers can understand and maintain the code.
4. Job matches are presented as suggestions and must not imply or guarantee an interview or employment outcome.
5. Use descriptive camelCase identifiers. Short conventional event/index names are acceptable when their role is obvious; arbitrary minimum name lengths are unnecessary.
6. Separate HTML, CSS, and JavaScript into index.html, styles.css, and app.js. Use lexical scope; do not create accidental global variables.
7. Explain important reasons in comments, not a narration of every statement. Remove temporary debug output before submission.
8. Write commit messages that name the changed behavior and purpose.
9. Use textContent for user text. Never insert user strings through innerHTML.
10. Associate form controls with labels and make success/error feedback perceivable. Preserve unsaved input when a write fails.

This file is normative if an adapter or context/CLAUDE.md conflicts. Repair inconsistent copies; do not silently choose different policies for humans and agents.

## Split Test

### Comments explain the purpose of significant JavaScript, HTML, and CSS sections so that other developers can understand and maintain the code.

This applies to every task in the project because all tasks may require code changes that another developer must maintain. The rule stays consistent from task to task, although the specific sections that need comments will vary. Putting this rule in the wrong place risks **distraction**, because agents may repeatedly explain code that is already self-explanatory.

**Verdict:** This rule belongs in `CLAUDE.md`.

### Job-to-skill comparisons use percentages to consistently represent the degree of alignment between a user's skills and a job's requirements.

This applies whenever the project presents a job-to-skill comparison, but it does not apply to every task. The rule stays the same when it is relevant, while the comparison data changes from task to task. Putting it in the wrong place risks **distraction**, because it would consume attention during tasks that do not involve job-match comparisons.

**Verdict:** This rule belongs in `CLAUDE.md` because job-to-skill comparisons are a recurring project-wide requirement.

### Use different font sizes and visual emphasis to help users distinguish between different types of webpage content, such as instructions, inputs, and results.

This applies only to tasks that create or revise the webpage interface, not to every task in the project. The exact visual hierarchy changes from task to task based on the content and layout being designed. Putting it in the wrong place risks **poisoning**, because a rigid persistent instruction could make an otherwise appropriate interface harder to use.

**Verdict:** This rule belongs in the prompt for the task that needs it.

**Prompt snippet:** Use different font sizes and visual emphasis to help users distinguish between instructions, inputs, and results.
