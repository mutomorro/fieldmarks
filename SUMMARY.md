# Systems Thinking Knowledge Base - Running Summary

**Last updated:** 30 March 2026, 08:15 GMT

---

## What this is

A standalone knowledge base of systems thinking concepts, built for leaders and practitioners who work in organisations. Inspired by Moresapien (moresapien.org) but with a professional audience, a deeper focus on one discipline, and a different visual identity (generative dot-grid illustrations).

## Key decisions made

### Architecture: Option D - dual-view homepage

The homepage has a toggle between two views:
- **Browse by theme** - a list view with 13 themed clusters, each with an editorial introduction. Accessible, obvious, situation-friendly.
- **See connections** - an interactive graph map showing all concepts and their relationships. Impressive, exploratory, practises what it preaches.

This serves three user types: the curious leader (list view), the practitioner (graph view), and the evaluator (both).

### Audience

Three types of visitor:
1. **Curious leaders** - heard about systems thinking, want to understand it
2. **Practitioners** - already using some of this, want to deepen and see connections
3. **Evaluators** - checking whether Mutomorro knows their stuff

### Tech stack: Astro 5 + React + Tailwind CSS

- Astro Content Collections for Markdown-based authoring with schema validation
- React islands for interactive components (graph, search, dot-grid art)
- Tailwind with Mutomorro design tokens
- Same "write a file, drop it in a folder" workflow as Moresapien
- Graph data generated at build time by a Node script

### Content model

**Entries** (~100 planned) with frontmatter:
- title, oneLiner, alsoKnownAs
- theme (from 13 groups), tags
- dotGrid (seed + variant for generative art)
- related (3-5 curated links with explanatory notes)
- originatedBy, draft

**Themes** (13) - editorial introductions for each concept cluster

**Entry body sections:**
- What it is
- What this looks like in organisations
- How to use this
- The thought to hold onto
- When you're seeing this

### Visual identity

- Mutomorro design system (deep purple-black, cream, accent purple, Source Sans 3, sharp corners)
- Each concept gets a unique generative dot-grid illustration
- The dot-grid uses perturbation algorithms - the base grid represents "the system" and each concept is expressed through a specific distortion of that grid

### Where it lives

Not yet decided. Options: subdomain of mutomorro.com, section within mutomorro.com, or standalone domain.

## What's built

| Item | Status |
|---|---|
| Project scaffolding (Astro + React + Tailwind) | Done |
| Content model and schema (`src/content/config.ts`) | Done |
| Base layout with nav and footer | Done |
| Homepage with Option D toggle | Done |
| Concept page template | Done |
| Graph build script (`scripts/build-graph.mjs`) | Done |
| Sample entry: Fixes that fail | Done |
| Sample entry: Feedback loops | Done |
| Sample theme: Systems archetypes | Done |
| Sample theme: Core building blocks | Done |
| README with setup instructions | Done |
| D3 graph component | Not started |
| Dot-grid generative art component | Not started |
| Search | Not started |
| Collections/pathways | Not started |
| More entries (target: 10-15 for MVP) | Not started |
| Deploy setup (Netlify/Vercel) | Not started |
| Mutomorro Wiki document | Not started |

## What to build next

1. **D3 graph React component** - force-directed layout with theme clustering, hover, click-to-navigate
2. **Dot-grid generative art** - canvas/SVG component with per-concept perturbation algorithms
3. **Batch of 5-6 more entries** - enough to make the graph interesting
4. **Search** - simple text search across entries
5. **Deploy** - Netlify (same as Moresapien) or Vercel

## Concept map

The full concept map with ~125 concepts across 13 themes is in `systems-thinking-concept-map.md` in the project files. Not all will make the cut - the content map serves as the planning tool.

## Links

- **Moresapien (reference):** moresapien.org
- **Mutomorro:** mutomorro.com
- **GitHub repo:** github.com/mutomorro (repo name TBD)
- **Concept map:** systems-thinking-concept-map.md (project file)
- **Moresapien build doc:** how-we-built-moresapien.md (project file)
