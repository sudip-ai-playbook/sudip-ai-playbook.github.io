# Product specification

Canonical product documentation for the **AI Playbook**.

| Document | Purpose |
| --- | --- |
| [Sitemap and page specification](./sitemap-and-page-specification.md) | Information architecture, routes, page families, 8D ↔ 20-stage mapping, VALUE gates |
| [Conceptual data model](./conceptual-data-model.md) | Multi-tenant entities, integrity rules, negative cases, migration from localStorage |

## Product naming

| Field | Value |
| --- | --- |
| Primary name | AI Playbook |
| Positioning name | AI Consulting & Communication OS |
| Tagline | Turn ambiguous business problems into valuable, feasible and trusted AI solutions—and lead stakeholders from discovery to decision. |
| Legacy name in code | ConsultAI OS (`app/src/data/consultingOs.ts`) |

## Release horizons

| Version | Focus | Status in this repo today |
| --- | --- | --- |
| V1 | Content-led public playbook | Prototype SPA exists; content not yet restructured around 8D |
| V2 | Interactive authenticated toolkit | Client-side localStorage workspace prototype only |
| V3 | AI coaching layer | Rule-based Copilot stub only |
| V4 | Team consulting platform | Not implemented |

## Methodology decision

**8D is the primary user journey.** The existing 20-stage ConsultAI lifecycle remains as detailed stage content and tools mapped under the eight dimensions. Users navigate Define → Deliver; advanced users can still open legacy stage detail when needed.

## Non-goals for this documentation package

- No application code changes
- No database or API implementation
- No claim that the current password gate is a security boundary

## Documentation quality checklist

| Check | Result |
| --- | --- |
| Local markdown links resolve | Pass |
| Referenced application paths exist | Pass |
| Heading hierarchy (no level skips) | Pass |
| Duplicate heading anchors | Pass (none) |
| Mermaid: no `style` / `classDef`; subgraph IDs without spaces | Pass |
| 8D ↔ stages 0–19 mapping present | Pass |
| `/consult` tabs → target IA mapping present | Pass |
| Requirements traceability (vision → sitemap → model) | Pass — see data model §12 |
| Integrity, concurrency, retention, negative cases | Pass — see data model §9–§10 |
| Prototype auth/localStorage labelled non-boundary | Pass |
| Application lint/test/build | Skipped — documentation-only change; no app code or CI config modified |

## Implementation handoff (next engineering slice)

Do **not** treat this package as implemented UI. Recommended order when build starts:

1. **V1 content shell:** public Home, Playbook overview, eight stage pages, Framework Library by job-to-be-done, Glossary, one practice exercise.
2. **Content schemas:** git-versioned `StageDefinition` (8D) + `LegacyStageDefinition` (stages 0–19) aligned with [`app/src/data/consultingOs.ts`](../../app/src/data/consultingOs.ts).
3. **Legacy bridge:** keep `/consult` available as “Legacy ConsultAI” until workspace migration.
4. **V2 persistence prep:** Zod (or equivalent) schemas for Opportunity, StageProgress, Decision, Risk, Artefact; import path from `sudip-consult-workspace`.
5. **Quality bar:** lint, unit tests for scoring/migration pure functions, ≥80% coverage on those modules; no secrets; no public database ports.

### Deferred decisions (need product owner input before build)

- BrowserRouter vs HashRouter for the public SEO site
- Auth / OIDC provider
- File storage and malware scanning
- Workflow mapper technology (Excalidraw vs custom graph vs both)
- Relational vs document store (spec recommends relational + JSONB for canvases)
