# Usability test protocol — AI Solution Engineering Playbook

## Goal

Validate that consultants and executives can complete the primary architecture journey without facilitation, and identify the top friction points before cloud sync ships.

## Participants

Recruit **5–8 people**:

| Persona | Count | Focus |
| --- | --- | --- |
| AI / cloud consultant | 2–3 | Full journey + engagement workspace |
| Engagement manager | 1–2 | Hub clarity, brief export, gates |
| Solution engineer | 1–2 | Compare / Decide / Canvas |
| Executive sponsor (or proxy) | 1 | Hub first viewport + brief readability |

Exclude anyone who built the product.

## Session setup (45 minutes)

1. **Intro (3 min):** Think aloud; no right answers; recording optional.
2. **Task A (12 min):** From Home, start the architecture journey, frame an outcome, reach Map.
3. **Task B (12 min):** Continue to Compare, add a stack item, open Summary, tick two validation checks, export the brief.
4. **Task C (8 min):** Export a workspace pack; import it in a private window (or second browser profile).
5. **Debrief (10 min):** What felt premium? What felt risky? Would you trust this with a client tomorrow?

Capture notes in-app at `#/research` after each session.

## Success metrics

| Metric | Target |
| --- | --- |
| Task A completion without help | ≥ 80% |
| Task B export success | ≥ 80% |
| Ease score (1–5) average | ≥ 4.0 |
| Severity-1 issues (blocked task) | 0 open before release |

## Severity rubric

- **S1:** Cannot complete primary task
- **S2:** Completes with major confusion or workaround
- **S3:** Cosmetic / preference

## Synthesis

After 5+ sessions, cluster blockers. Ship fixes for all S1/S2 before claiming 10/10 ease-of-use.
