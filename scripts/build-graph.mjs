/**
 * build-graph.mjs
 *
 * Runs before every build (and dev start).
 * Reads all entry Markdown files, extracts frontmatter,
 * and outputs public/graph-data.json for the interactive graph.
 *
 * Same pattern as Moresapien's build-graph script.
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const ENTRIES_DIR = join(process.cwd(), 'src', 'content', 'entries');
const OUTPUT_PATH = join(process.cwd(), 'public', 'graph-data.json');

// Theme colour map
const THEME_COLOURS = {
  'core-building-blocks': '#9B51E0',
  'system-behaviours': '#d4735e',
  'systems-archetypes': '#3aaa9e',
  'leverage-and-intervention': '#d4a830',
  'complexity-and-uncertainty': '#4a9ad4',
  'mental-models': '#a06cc0',
  'resilience-and-change': '#5a6cc0',
  'boundaries-and-power': '#d45a7a',
  'organisational-systems': '#7ab84e',
  'measurement-and-signals': '#d4735e',
  'design-and-intervention': '#3aaa9e',
  'natural-metaphors': '#7ab84e',
  'human-dimensions': '#a06cc0',
};

/**
 * Minimal YAML frontmatter parser.
 * Handles the fields we need without pulling in a full YAML library.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const data = {};

  // Simple key-value extraction
  let currentKey = null;
  let inArray = false;
  let arrayItems = [];
  let inRelated = false;
  let relatedItems = [];
  let currentRelated = {};

  for (const line of yaml.split('\n')) {
    // Top-level key
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch && !line.startsWith('  ')) {
      // Save previous array if needed
      if (inArray && currentKey) {
        data[currentKey] = arrayItems;
        arrayItems = [];
        inArray = false;
      }
      if (inRelated) {
        if (Object.keys(currentRelated).length) relatedItems.push(currentRelated);
        data['related'] = relatedItems;
        relatedItems = [];
        currentRelated = {};
        inRelated = false;
      }

      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();

      if (val === '') {
        // Could be start of array or object
      } else if (val === 'true') {
        data[currentKey] = true;
      } else if (val === 'false') {
        data[currentKey] = false;
      } else if (!isNaN(Number(val))) {
        data[currentKey] = Number(val);
      } else {
        data[currentKey] = val.replace(/^['"]|['"]$/g, '');
      }
      continue;
    }

    // Array item
    if (line.match(/^  - slug:\s*(.+)/)) {
      inRelated = true;
      if (Object.keys(currentRelated).length) relatedItems.push(currentRelated);
      currentRelated = { slug: line.match(/^  - slug:\s*(.+)/)[1].trim() };
      continue;
    }

    if (inRelated && line.match(/^\s+note:\s*(.+)/)) {
      currentRelated.note = line.match(/^\s+note:\s*(.+)/)[1].trim();
      continue;
    }

    if (line.match(/^  - (.+)/)) {
      inArray = true;
      if (currentKey === 'related') {
        // Shouldn't happen with our format, but handle gracefully
      } else {
        arrayItems.push(line.match(/^  - (.+)/)[1].trim().replace(/^['"]|['"]$/g, ''));
      }
      continue;
    }
  }

  // Final flush
  if (inArray && currentKey) {
    data[currentKey] = arrayItems;
  }
  if (inRelated) {
    if (Object.keys(currentRelated).length) relatedItems.push(currentRelated);
    data['related'] = relatedItems;
  }

  return data;
}

async function buildGraph() {
  console.log('Building graph data...');

  let files;
  try {
    files = await readdir(ENTRIES_DIR);
  } catch {
    console.log('No entries directory yet - creating empty graph data.');
    await mkdir(join(process.cwd(), 'public'), { recursive: true });
    await writeFile(OUTPUT_PATH, JSON.stringify({ nodes: [], edges: [] }, null, 2));
    return;
  }

  const mdFiles = files.filter(f => f.endsWith('.md'));

  const nodes = [];
  const edges = [];
  const slugSet = new Set();
  const warnings = [];

  // First pass: build nodes
  for (const file of mdFiles) {
    const content = await readFile(join(ENTRIES_DIR, file), 'utf-8');
    const data = parseFrontmatter(content);
    if (!data) {
      warnings.push(`Could not parse frontmatter: ${file}`);
      continue;
    }

    if (data.draft) continue;

    const slug = file.replace('.md', '');
    slugSet.add(slug);

    nodes.push({
      id: slug,
      title: data.title || slug,
      oneLiner: data.oneLiner || '',
      theme: data.theme || 'unknown',
      colour: THEME_COLOURS[data.theme] || '#888',
      tags: data.tags || [],
      connectionCount: 0, // will be updated
    });
  }

  // Second pass: build edges
  for (const file of mdFiles) {
    const content = await readFile(join(ENTRIES_DIR, file), 'utf-8');
    const data = parseFrontmatter(content);
    if (!data || data.draft) continue;

    const sourceSlug = file.replace('.md', '');
    const related = data.related || [];

    for (const rel of related) {
      if (!rel.slug) continue;

      if (!slugSet.has(rel.slug)) {
        warnings.push(`Broken link: ${sourceSlug} -> ${rel.slug}`);
        continue;
      }

      if (rel.slug === sourceSlug) {
        warnings.push(`Self-link: ${sourceSlug}`);
        continue;
      }

      // Avoid duplicate edges (A->B and B->A)
      const edgeId = [sourceSlug, rel.slug].sort().join('--');
      if (!edges.find(e => e.id === edgeId)) {
        edges.push({
          id: edgeId,
          source: sourceSlug,
          target: rel.slug,
          note: rel.note || '',
        });
      }
    }
  }

  // Update connection counts
  for (const edge of edges) {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    if (sourceNode) sourceNode.connectionCount++;
    if (targetNode) targetNode.connectionCount++;
  }

  // Check for orphans
  for (const node of nodes) {
    if (node.connectionCount === 0) {
      warnings.push(`Orphan (no connections): ${node.id}`);
    }
  }

  // Output
  await mkdir(join(process.cwd(), 'public'), { recursive: true });
  const graphData = { nodes, edges, meta: { generatedAt: new Date().toISOString() } };
  await writeFile(OUTPUT_PATH, JSON.stringify(graphData, null, 2));

  // Report
  console.log(`Graph built: ${nodes.length} nodes, ${edges.length} edges`);
  if (warnings.length) {
    console.log('\nWarnings:');
    warnings.forEach(w => console.log(`  - ${w}`));
  }
}

buildGraph().catch(console.error);
