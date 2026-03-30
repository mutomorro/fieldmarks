# Fieldmarks - Running Summary

**Last updated:** 30 March 2026, 15:00 GMT

---

## What this is

A standalone knowledge base of systems thinking concepts at fieldmarks.org, built for leaders and practitioners who work in organisations. The Moresapien model adapted for a single domain explored deeply, with a distinctive visual identity (generative dot-grid illustrations).

## Key decisions

| Decision | Detail |
|---|---|
| Name | Fieldmarks |
| Domain | fieldmarks.org |
| Hosting | Netlify |
| Repo | github.com/mutomorro/fieldmarks |
| Stack | Astro 5 + React + Tailwind CSS |
| Relationship | Standalone sibling to Moresapien, linked back to Mutomorro |

## Architecture: dual-view homepage

Toggle between two views: **Browse by theme** (list with 13 themed clusters) and **See connections** (interactive graph map). Serves three user types: curious leaders (list), practitioners (graph), evaluators (both).

## Logo

**The mark:** A 3x3 grid of square marks, perfectly uniform. The centre mark is purple (#9B51E0) and displaced 2px down-right. All other marks are identical in size, spacing, and opacity.

**The idea:** A healthy system is an orderly grid. One thing has shifted. That's systems thinking in a logo.

**Rules:**
- Grid is perfectly regular (no opacity variation on dark marks)
- Only the purple mark breaks the pattern - colour AND position
- Works from 48px down to 16px favicon
- Purple stays #9B51E0 on all backgrounds
- Dark marks are #221C2B at 0.7 opacity (light bg) or #FFFFFF at 0.7 opacity (dark bg)

**Future note:** Sphere-of-dots alternative mark worth exploring later.

## What's built

| Item | Status |
|---|---|
| Astro site scaffolding | Done |
| Content model and schema | Done |
| Homepage with list/graph toggle | Done |
| Concept page template with DotGrid | Done |
| Graph build script | Done |
| DotGrid component (v3, 12 variants) | Done |
| ConnectionGraph D3 component | Built, not wired in |
| Logo mark (3x3 grid) | Done |
| Favicon (SVG + PNG + Apple touch) | Done |
| Header with logo lockup | Done |
| Footer with Mutomorro links | Done |
| 7 entries live | Done |
| 2 of 13 theme files | Done |
| Search | Not started |
| Collections/pathways | Not started |
| Remaining 11 theme files | Not started |

## Content

**7 entries:** Fixes that fail, Feedback loops, Delays, Shifting the burden, Emergence, Unintended consequences, Exponential growth

**2 themes:** Core building blocks, Systems archetypes

**17 graph edges, no broken links.**

## What to build next

1. Push Session 4 changes to GitHub
2. Homepage polish (hero, cards, overall feel)
3. Create remaining 11 theme files
4. Wire ConnectionGraph into graph view
5. Write next entry batch (complete Core Building Blocks theme)
6. Update Craft wiki with logo details

## Links

- **Live site:** fieldmarks.org
- **GitHub:** github.com/mutomorro/fieldmarks
- **Moresapien:** moresapien.org
- **Mutomorro:** mutomorro.com
- **Concept map:** systems-thinking-concept-map.md (project file)
