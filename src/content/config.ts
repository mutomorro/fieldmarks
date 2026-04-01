import { defineCollection, z } from 'astro:content';

// The 13 theme groups from the concept map
const themeEnum = z.enum([
  'core-building-blocks',
  'system-behaviours',
  'systems-archetypes',
  'leverage-and-intervention',
  'complexity-and-uncertainty',
  'mental-models',
  'resilience-and-change',
  'boundaries-and-power',
  'organisational-systems',
  'measurement-and-signals',
  'design-and-intervention',
  'natural-metaphors',
  'human-dimensions',
]);

// Concept entries - the core content
const entries = defineCollection({
  type: 'content',
  schema: z.object({
    // Identity
    title: z.string(),
    oneLiner: z.string().describe('A single plain-English sentence explaining it'),
    alsoKnownAs: z.array(z.string()).optional(),

    // Taxonomy
    theme: themeEnum,
    tags: z.array(z.string()).default([]),

    // The dot-grid illustration
    dotGrid: z.object({
      seed: z.number().describe('Unique seed for the generative art'),
      variant: z.string().describe('Which perturbation algorithm to use'),
    }).optional(),

    // Connections - the most important field
    related: z.array(z.object({
      slug: z.string(),
      note: z.string().optional().describe('Why these two concepts are related'),
    })).default([]),

    // Attribution
    originatedBy: z.string().optional().describe('e.g. Donella Meadows, Peter Senge'),

    // Status
    draft: z.boolean().default(false),
  }),
});

// Curated collections - guided pathways through concept entries
const collectionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    order: z.number().describe('Display order on homepage (1-8)'),
    entries: z.array(z.object({
      slug: z.string(),
      narrative: z.string(),
    })),
  }),
});

// Theme introductions - editorial essays for each cluster
const themes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    order: z.number().describe('Display order on homepage'),
    colour: z.string().describe('Hex colour for this theme'),
  }),
});

export const collections = { entries, themes, collections: collectionsCollection };