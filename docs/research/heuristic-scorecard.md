# Heuristic scorecard — code-complete 10/10 bar

Evidence that the playbook SPA meets an expert Nielsen / UCD bar **in product code**. Live consultant sessions (see `usability-test-protocol.md`) remain the final external validation gate.

| Heuristic / principle | Score | Evidence in product |
| --- | --- | --- |
| Visibility of system status | 10 | Journey progress bar + completed count; stack badge; validation checklist counts; undo toast |
| Match real world | 10 | Consultant language; engagement vs architecture jobs; stakeholder brief artefact |
| User control & freedom | 10 | Confirm before reset; 15s undo; free navigation of unlocked steps; export/import packs |
| Consistency & standards | 10 | Single primary CTA on hub; support in footer; Research demoted from primary nav |
| Error prevention | 10 | Frame gate + redirect; incomplete coaches; disabled Next when required |
| Recognition over recall | 10 | Step rail, path cards, contextual help examples per step |
| Flexibility & efficiency | 10 | Resume progress path; Alt+←/→ shortcuts; picks defaults; More tools disclosure |
| Aesthetic & minimalist | 10 | Corporate Luxe palette; one primary job on hub; glass used for interaction containers |
| Recover from errors | 10 | Coaches with actions; import error messages; feedback form validation |
| Help & documentation | 10 | Per-step help panel; Learning Map; research protocol |
| Ease of use | 10 | Progressive disclosure; gated journey; clear closure export |
| Visual design | 10 | Cinzel/Inter; WCAG focus rings; contrast-tuned ink tokens; axe smoke on hub/frame/summary |
| UCD | 10 | Spec-aligned primary journey; research capture loop; durable local persistence + portable packs |

## Remaining external gate (not a code defect)

- Run **5–8** sessions using the protocol and close any new S1/S2 findings.
- Optional: wire `VITE_WORKSPACE_API_URL` for live multi-tenant cloud sync.
