import { useMemo } from 'react';

/**
 * DotGrid v3 - Generative art component for Fieldmarks
 * 
 * DESIGN PRINCIPLES (discovered through iteration):
 * 
 * 1. One idea per illustration. Each grid communicates one visual
 *    sentence, not a paragraph. If you need a caption to explain it,
 *    the variant is too complex.
 * 
 * 2. Left-to-right = time. Cause on the left, effect on the right.
 *    Before on the left, after on the right. The eye reads this
 *    naturally without instruction.
 * 
 * 3. Purple marks the actor. The accent colour is the concept's
 *    central force - the fix, the intervention, the wavefront.
 *    Not decoration or scattered highlights.
 * 
 * 4. The regular grid IS health. A functioning system is an orderly
 *    grid. The perturbation shows what the concept does to that system.
 *    Disruption is departure from the grid.
 * 
 * 5. Simplicity over cleverness. A strong, simple effect at the right
 *    scale beats a subtle, technically sophisticated one.
 */

// --- Seeded PRNG (mulberry32) ---
function createRng(seed) {
  let a = seed | 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Grid parameters ---
const COLS = 26;
const ROWS = 14;
const PAD = 14;
const MARK_BASE = 3;

// --- Colours ---
const DEEP = '#221C2B';
const ACCENT = '#9B51E0';

// --- Helpers ---
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// --- Variant functions ---

function generateMarks(seed, variant, width, height) {
  const rng = createRng(seed);
  const hSpace = (width - PAD * 2) / (COLS - 1);
  const vSpace = (height - PAD * 2) / (ROWS - 1);

  const noise = [];
  for (let r = 0; r < ROWS; r++) {
    noise[r] = [];
    for (let c = 0; c < COLS; c++) {
      noise[r][c] = {
        dx: (rng() - 0.5) * 2,
        dy: (rng() - 0.5) * 2,
        s: rng(),
        o: rng(),
        extra: rng(),
      };
    }
  }

  const marks = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const baseX = PAD + c * hSpace;
      const baseY = PAD + r * vSpace;
      const n = noise[r][c];
      const nx = c / (COLS - 1);
      const ny = r / (ROWS - 1);

      const mark = applyVariant(variant, {
        baseX, baseY, nx, ny, c, r, n, hSpace, vSpace, width, height, rng, noise,
      });

      marks.push(mark);
    }
  }

  return marks;
}

function applyVariant(variant, ctx) {
  switch (variant) {
    case 'fixesThatFail': return variantFixesThatFail(ctx);
    case 'shiftingBurden': return variantShiftingBurden(ctx);
    case 'delays': return variantDelays(ctx);
    case 'emergence': return variantEmergence(ctx);
    case 'unintendedConsequences': return variantUnintendedConsequences(ctx);
    case 'exponentialGrowth': return variantExponentialGrowth(ctx);
    case 'feedbackLoop': return variantFeedbackLoop(ctx);
    case 'oscillation': return variantOscillation(ctx);
    case 'subOptimisation': return variantSubOptimisation(ctx);
    case 'tippingPoint': return variantTippingPoint(ctx);
    case 'erosion': return variantErosion(ctx);
    case 'reinforcing': return variantReinforcing(ctx);
    case 'stocksAndFlows': return variantStocksAndFlows(ctx);
    case 'boundaries': return variantBoundaries(ctx);
    case 'interconnections': return variantInterconnections(ctx);
    case 'nonlinearity': return variantNonlinearity(ctx);
    case 'buffers': return variantBuffers(ctx);
    case 'sCurves': return variantSCurves(ctx);
    case 'overshootCollapse': return variantOvershootCollapse(ctx);
    case 'pathDependence': return variantPathDependence(ctx);
    case 'lockIn': return variantLockIn(ctx);
    case 'attractors': return variantAttractors(ctx);
    case 'equilibrium': return variantEquilibrium(ctx);
    case 'limitsToGrowth': return variantLimitsToGrowth(ctx);
    case 'tragedyCommons': return variantTragedyCommons(ctx);
    case 'escalation': return variantEscalation(ctx);
    case 'growthUnderinvestment': return variantGrowthUnderinvestment(ctx);
    case 'ruleBeating': return variantRuleBeating(ctx);
    case 'leveragePoints': return variantLeveragePoints(ctx);
    case 'policyResistance': return variantPolicyResistance(ctx);
    case 'systemTraps': return variantSystemTraps(ctx);
    case 'secondOrderEffects': return variantSecondOrderEffects(ctx);
    case 'catalyticMechanisms': return variantCatalyticMechanisms(ctx);
    case 'nudges': return variantNudges(ctx);
    case 'constraints': return variantConstraints(ctx);
    case 'requisiteVariety': return variantRequisiteVariety(ctx);
    case 'complexityComplication': return variantComplexityComplication(ctx);
    case 'wickedProblems': return variantWickedProblems(ctx);
    case 'coEvolution': return variantCoEvolution(ctx);
    case 'uncertaintyRisk': return variantUncertaintyRisk(ctx);
    case 'sensitivityInitialConditions': return variantSensitivityInitialConditions(ctx);
    case 'irreducibility': return variantIrreducibility(ctx);
    case 'mentalModels': return variantMentalModels(ctx);
    case 'systemsMapping': return variantSystemsMapping(ctx);
    case 'icebergModel': return variantIcebergModel(ctx);
    case 'eventPatternStructure': return variantEventPatternStructure(ctx);
    case 'linearThinking': return variantLinearThinking(ctx);
    case 'systemBlindness': return variantSystemBlindness(ctx);
    case 'mapTerritory': return variantMapTerritory(ctx);
    case 'dynamicThinking': return variantDynamicThinking(ctx);
    case 'resilience': return variantResilience(ctx);
    case 'robustnessResilience': return variantRobustnessResilience(ctx);
    case 'antifragility': return variantAntifragility(ctx);
    case 'adaptiveCapacity': return variantAdaptiveCapacity(ctx);
    case 'redundancy': return variantRedundancy(ctx);
    case 'panarchy': return variantPanarchy(ctx);
    case 'transformability': return variantTransformability(ctx);
    case 'punctuatedEquilibrium': return variantPunctuatedEquilibrium(ctx);
    case 'safeToFail': return variantSafeToFail(ctx);
    case 'boundaryCritique': return variantBoundaryCritique(ctx);
    case 'multiplePerspectives': return variantMultiplePerspectives(ctx);
    case 'stakeholderMapping': return variantStakeholderMapping(ctx);
    case 'powerInSystems': return variantPowerInSystems(ctx);
    case 'localGlobalOptimisation': return variantLocalGlobalOptimisation(ctx);
    case 'nestedSystems': return variantNestedSystems(ctx);
    case 'scaleEffects': return variantScaleEffects(ctx);
    case 'learningOrganisation': return variantLearningOrganisation(ctx);
    case 'sensemaking': return variantSensemaking(ctx);
    case 'institutionalInertia': return variantInstitutionalInertia(ctx);
    case 'distributedLeadership': return variantDistributedLeadership(ctx);
    case 'groupthink': return variantGroupthink(ctx);
    case 'theoryOfChange': return variantTheoryOfChange(ctx);
    case 'outcomeMapping': return variantOutcomeMapping(ctx);
    case 'proxyMeasures': return variantProxyMeasures(ctx);
    case 'signalNoise': return variantSignalNoise(ctx);
    case 'weakSignals': return variantWeakSignals(ctx);
    case 'feedbackStarvation': return variantFeedbackStarvation(ctx);
    case 'observerEffect': return variantObserverEffect(ctx);
    case 'systemicDesign': return variantSystemicDesign(ctx);
    case 'participatoryMapping': return variantParticipatoryMapping(ctx);
    case 'probeSenseRespond': return variantProbeSenseRespond(ctx);
    case 'senseAnalyseRespond': return variantSenseAnalyseRespond(ctx);
    case 'minimumViableIntervention': return variantMinimumViableIntervention(ctx);
    case 'holdingSpace': return variantHoldingSpace(ctx);
    case 'transitionManagement': return variantTransitionManagement(ctx);
    case 'portfolioExperiments': return variantPortfolioExperiments(ctx);
    case 'carryingCapacity': return variantCarryingCapacity(ctx);
    case 'symbiosis': return variantSymbiosis(ctx);
    case 'keystoneSpecies': return variantKeystoneSpecies(ctx);
    case 'succession': return variantSuccession(ctx);
    case 'nicheConstruction': return variantNicheConstruction(ctx);
    case 'diversityStability': return variantDiversityStability(ctx);
    case 'mutualism': return variantMutualism(ctx);
    case 'parasitism': return variantParasitism(ctx);
    case 'boundedRationality': return variantBoundedRationality(ctx);
    case 'satisficing': return variantSatisficing(ctx);
    case 'cognitiveLoad': return variantCognitiveLoad(ctx);
    case 'sensemakingPressure': return variantSensemakingPressure(ctx);
    case 'motivatedReasoning': return variantMotivatedReasoning(ctx);
    case 'actionBias': return variantActionBias(ctx);
    case 'narrativeFallacy': return variantNarrativeFallacy(ctx);
    case 'hindsightBias': return variantHindsightBias(ctx);
    default: return variantDefault(ctx);
  }
}

// --- Default: gentle organic perturbation ---
function variantDefault(ctx) {
  const { baseX, baseY, n } = ctx;
  return {
    x: baseX + n.dx * 2,
    y: baseY + n.dy * 2,
    size: MARK_BASE + (n.s - 0.5) * 1,
    opacity: 0.35 + n.o * 0.35,
    colour: DEEP,
  };
}

// --- Fixes That Fail --- (CONFIRMED WORKING)
// A sharp rectangle of forced perfection (purple). The fix worked
// locally, but marks around it are pushed out of position. The closer
// to the zone, the more displaced.
function variantFixesThatFail(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const fixCx = 0.32;
  const fixCy = 0.42;
  const fixW = 0.20;
  const fixH = 0.28;

  const inFixX = Math.abs(nx - fixCx) < fixW / 2;
  const inFixY = Math.abs(ny - fixCy) < fixH / 2;
  const inFix = inFixX && inFixY;

  if (inFix) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 0.5,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  const dxToFix = Math.max(0, Math.abs(nx - fixCx) - fixW / 2);
  const dyToFix = Math.max(0, Math.abs(ny - fixCy) - fixH / 2);
  const distToFix = Math.sqrt(dxToFix ** 2 + dyToFix ** 2);

  const pushStrength = smoothstep(0.35, 0, distToFix) * 12;
  const pushAngle = Math.atan2(ny - fixCy, nx - fixCx);
  const turbulence = smoothstep(0.3, 0, distToFix);

  return {
    x: baseX + Math.cos(pushAngle) * pushStrength + n.dx * (1.5 + turbulence * 4),
    y: baseY + Math.sin(pushAngle) * pushStrength + n.dy * (1.5 + turbulence * 4),
    size: MARK_BASE + pushStrength * 0.1 + (n.s - 0.5) * 1,
    opacity: clamp(0.35 + n.o * 0.35 + turbulence * 0.15, 0.15, 0.85),
    colour: DEEP,
  };
}

// --- Shifting the Burden --- (v3: REWORKED)
// The quick fix sits as a solid purple block along the bottom-left.
// It looks stable, structured, reliable. But everything to the right
// and above is falling apart - the real solution is atrophying.
// Left-to-right = the passage from "looks fine" to "everything's broken."
function variantShiftingBurden(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // The "quick fix" block - bottom-left quadrant
  const inFix = nx < 0.35 && ny > 0.55;
  // Transition zone near the fix
  const nearFix = nx < 0.45 && ny > 0.45 && !inFix;

  if (inFix) {
    // Solid, locked, purple - looks reliable
    return {
      x: baseX + n.dx * 0.2,
      y: baseY + n.dy * 0.2,
      size: MARK_BASE + 0.6,
      opacity: 0.85,
      colour: ACCENT,
    };
  }

  // Atrophy increases with distance from the fix block
  // Both rightward and upward
  const rightDist = smoothstep(0.3, 1.0, nx);
  const upDist = smoothstep(0.6, 0.0, ny);
  const atrophy = Math.max(rightDist, upDist * 0.7);

  if (nearFix) {
    // Transition: starting to fray
    return {
      x: baseX + n.dx * 2,
      y: baseY + n.dy * 2,
      size: MARK_BASE + (n.s - 0.5) * 0.8,
      opacity: 0.4 + n.o * 0.25,
      colour: DEEP,
    };
  }

  // Everything else: progressive collapse
  return {
    x: baseX + n.dx * (1.5 + atrophy * 7),
    y: baseY + n.dy * (1.5 + atrophy * 7),
    size: Math.max(1, MARK_BASE * (1 - atrophy * 0.65)),
    opacity: Math.max(0.04, (0.45 + n.o * 0.25) * (1 - atrophy * 0.8)),
    colour: DEEP,
  };
}

// --- Delays --- (v3: REWORKED)
// Left side is uniform, orderly - the system before the effect arrives.
// A horizontal band of purple marks sits in the middle - the wavefront,
// the moment of impact arriving. Right side becomes increasingly messy
// as the delayed consequences finally land.
// Reads left-to-right: order → wavefront → degradation.
function variantDelays(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // The wavefront - a vertical band around 55% across
  const waveFront = 0.55;
  const waveWidth = 0.08;

  const dFromFront = Math.abs(nx - waveFront);
  const atFront = dFromFront < waveWidth / 2;
  const frontIntensity = smoothstep(waveWidth / 2, 0, dFromFront);

  // Left of wavefront: calm, orderly - the effect hasn't arrived yet
  const beforeWave = nx < waveFront - waveWidth / 2;

  // Right of wavefront: the consequences land, increasingly messy
  const afterWave = nx > waveFront + waveWidth / 2;
  const degradation = afterWave ? smoothstep(waveFront + waveWidth / 2, 1.0, nx) : 0;

  if (atFront) {
    // The wavefront: a clear horizontal band of purple
    return {
      x: baseX + n.dx * 0.5,
      y: baseY + n.dy * 0.5,
      size: MARK_BASE + frontIntensity * 1,
      opacity: 0.7 + frontIntensity * 0.2,
      colour: ACCENT,
    };
  }

  if (beforeWave) {
    // Before: uniform, orderly, undisturbed
    return {
      x: baseX + n.dx * 0.8,
      y: baseY + n.dy * 0.8,
      size: MARK_BASE + (n.s - 0.5) * 0.3,
      opacity: 0.4 + n.o * 0.2,
      colour: DEEP,
    };
  }

  // After: degradation increases toward the right edge
  const yShift = Math.sin(ny * Math.PI * 3 + nx * 8) * degradation * 5;
  return {
    x: baseX + n.dx * (1.5 + degradation * 5) + degradation * 2,
    y: baseY + n.dy * (1.5 + degradation * 4) + yShift,
    size: MARK_BASE + (n.s - 0.5) * 1 + degradation * 0.8,
    opacity: clamp(0.4 + n.o * 0.25 - degradation * 0.1, 0.12, 0.75),
    colour: DEEP,
  };
}

// --- Emergence --- (KEPT FROM v2)
// Simple local rules produce a visible spiral/flow pattern.
// Purple accent at the centre where the pattern is strongest.
function variantEmergence(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const cx = 0.48;
  const cy = 0.48;
  const angle = Math.atan2(ny - cy, nx - cx);
  const radius = dist(nx, ny, cx, cy);

  const flowAngle = angle + Math.PI / 2 + radius * 3;
  const flowStrength = smoothstep(0, 0.45, radius) * 7;

  const centreProximity = smoothstep(0.35, 0, radius);
  const isCore = radius < 0.08;

  return {
    x: baseX + Math.cos(flowAngle) * flowStrength + n.dx * 1.2,
    y: baseY + Math.sin(flowAngle) * flowStrength + n.dy * 1.2,
    size: MARK_BASE + centreProximity * 2 + (n.s - 0.5) * 0.8,
    opacity: 0.35 + n.o * 0.3 + centreProximity * 0.3,
    colour: isCore ? ACCENT : DEEP,
  };
}

// --- Unintended Consequences --- (KEPT FROM v2)
// Intervention point (purple). Asymmetric ripples - some bigger
// than the original change.
function variantUnintendedConsequences(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const ix = 0.28;
  const iy = 0.35;
  const d = dist(nx, ny, ix, iy);
  const angle = Math.atan2(ny - iy, nx - ix);

  const isIntervention = d < 0.06;

  if (isIntervention) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 1.5,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  const directionBias = Math.sin(angle * 2.5 + 1.2) * 0.6 + 0.6;
  const ripple = Math.sin(d * 30) * Math.exp(-d * 2.5) * directionBias;
  const displacement = ripple * 10;

  const surprise = Math.sin(d * 15 + angle * 3) * smoothstep(0.2, 0.55, d) * 6;
  const surpriseStrength = smoothstep(0.3, 0.65, d);

  return {
    x: baseX + Math.cos(angle) * displacement + n.dx * 1.5 + Math.cos(angle + 1.5) * surprise,
    y: baseY + Math.sin(angle) * displacement + n.dy * 1.5 + Math.sin(angle + 1.5) * surprise,
    size: MARK_BASE + Math.abs(ripple) * 2 + (n.s - 0.5) * 0.8 + surpriseStrength * 0.8,
    opacity: clamp(0.35 + n.o * 0.3 + Math.abs(ripple) * 0.25, 0.12, 0.9),
    colour: DEEP,
  };
}

// --- Exponential Growth --- (KEPT FROM v2)
// Marks grow from bottom-left. Slow then overwhelming.
function variantExponentialGrowth(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const progress = (nx * 0.5 + (1 - ny) * 0.5);
  const growth = Math.pow(progress, 4);

  const sizeBoost = growth * 7;
  const opacityBoost = growth * 0.45;
  const crowding = growth * 3;

  return {
    x: baseX + n.dx * (2 - crowding * 0.4) - growth * 2,
    y: baseY + n.dy * (2 - crowding * 0.4) + growth * 1,
    size: MARK_BASE + sizeBoost + (n.s - 0.5) * (1 + growth * 1.5),
    opacity: clamp(0.3 + n.o * 0.2 + opacityBoost, 0.15, 0.9),
    colour: growth > 0.5 ? ACCENT : DEEP,
  };
}

// --- Feedback Loop --- (v3: REWORKED)
// One single loop in the centre. Marks clearly curving in a circular
// flow. Purple at the core. Simple, strong, unmistakable.
function variantFeedbackLoop(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Single loop, centred
  const cx = 0.50;
  const cy = 0.50;
  const d = dist(nx, ny, cx, cy);
  const angle = Math.atan2(ny - cy, nx - cx);

  // Flow: perpendicular to radius = circular motion
  const pull = smoothstep(0.42, 0, d);
  const flowAngle = angle + Math.PI / 2;
  const flowStrength = pull * 9;

  const flowX = Math.cos(flowAngle) * flowStrength;
  const flowY = Math.sin(flowAngle) * flowStrength;

  const inLoop = pull > 0.2;
  const isCore = d < 0.08;

  // Outside the loop: marks are calm, regular
  // Inside: marks curve, grow bolder
  return {
    x: baseX + flowX + n.dx * (inLoop ? 1 : 1.5),
    y: baseY + flowY + n.dy * (inLoop ? 1 : 1.5),
    size: MARK_BASE + (inLoop ? pull * 1.5 : 0) + (n.s - 0.5) * 0.6,
    opacity: 0.35 + n.o * 0.25 + (inLoop ? pull * 0.3 : 0),
    colour: isCore ? ACCENT : DEEP,
  };
}

// --- Oscillation --- (KEPT FROM v2)
function variantOscillation(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const amplitude = (1 - Math.abs(nx - 0.5) * 2) * 9;
  const wave = Math.sin(ny * Math.PI * 5) * amplitude;
  const overshoot = Math.sin(nx * Math.PI * 3) * 2.5;

  return {
    x: baseX + wave + n.dx * 1.2,
    y: baseY + overshoot + n.dy * 1.2,
    size: MARK_BASE + Math.abs(wave) * 0.1 + (n.s - 0.5) * 0.8,
    opacity: 0.35 + n.o * 0.3 + Math.abs(wave) * 0.02,
    colour: Math.abs(wave) > 6 ? ACCENT : DEEP,
  };
}

// --- Sub-optimisation --- (KEPT FROM v2)
function variantSubOptimisation(ctx) {
  const { baseX, baseY, nx, ny, n, hSpace, vSpace } = ctx;

  const zoneCol = Math.floor(nx * 3.2);
  const zoneRow = Math.floor(ny * 2.2);
  const zoneId = zoneCol + zoneRow * 4;

  const zoneOffsetX = Math.sin(zoneId * 2.3) * 6;
  const zoneOffsetY = Math.cos(zoneId * 3.7) * 5;
  const zoneAngle = Math.sin(zoneId * 1.9) * 0.18;

  const localNx = (nx * 3.2) % 1;
  const localNy = (ny * 2.2) % 1;

  const edgeX = Math.min(localNx, 1 - localNx);
  const edgeY = Math.min(localNy, 1 - localNy);
  const isGap = edgeX < 0.14 || edgeY < 0.14;

  if (isGap) {
    return {
      x: baseX + n.dx * 8,
      y: baseY + n.dy * 8,
      size: MARK_BASE * 0.5,
      opacity: 0.06 + n.o * 0.06,
      colour: DEEP,
    };
  }

  const relX = (localNx - 0.5) * hSpace * 2;
  const relY = (localNy - 0.5) * vSpace * 2;
  const sin = Math.sin(zoneAngle);

  return {
    x: baseX + zoneOffsetX + relX * sin * 0.4,
    y: baseY + zoneOffsetY + relY * sin * 0.4,
    size: MARK_BASE + 0.4,
    opacity: 0.45 + n.o * 0.3,
    colour: DEEP,
  };
}

// --- Tipping Point --- (KEPT FROM v2)
function variantTippingPoint(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const boundary = 0.52 + Math.sin(ny * Math.PI) * 0.10;
  const tipped = nx > boundary;

  if (tipped) {
    const flipStrength = smoothstep(boundary, boundary + 0.25, nx);
    return {
      x: baseX + n.dx * 2 + flipStrength * 4,
      y: baseY + n.dy * 2 + Math.sin(nx * 12 + ny * 8) * flipStrength * 4,
      size: MARK_BASE + flipStrength * 2.5,
      opacity: 0.35 + flipStrength * 0.5,
      colour: flipStrength > 0.3 ? ACCENT : DEEP,
    };
  }

  return {
    x: baseX + n.dx * 1,
    y: baseY + n.dy * 1,
    size: MARK_BASE + (n.s - 0.5) * 0.5,
    opacity: 0.4 + n.o * 0.25,
    colour: DEEP,
  };
}

// --- Erosion --- (KEPT FROM v2)
function variantErosion(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const drift = ny * ny;
  const sag = drift * 7;

  return {
    x: baseX + n.dx * (1 + drift * 4),
    y: baseY + sag + n.dy * (1 + drift * 3),
    size: Math.max(1.2, MARK_BASE * (1 - drift * 0.5)),
    opacity: Math.max(0.05, (0.5 + n.o * 0.3) * (1 - drift * 0.65)),
    colour: DEEP,
  };
}

// --- Reinforcing --- (KEPT FROM v2)
function variantReinforcing(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const cx = 0.38;
  const cy = 0.42;
  const d = dist(nx, ny, cx, cy);
  const angle = Math.atan2(ny - cy, nx - cx);

  const pull = smoothstep(0.55, 0, d) * 8;

  return {
    x: baseX - Math.cos(angle) * pull + n.dx * (1 + d * 2.5),
    y: baseY - Math.sin(angle) * pull + n.dy * (1 + d * 2.5),
    size: MARK_BASE + smoothstep(0.45, 0, d) * 4 + (n.s - 0.5) * 0.8,
    opacity: 0.2 + smoothstep(0.5, 0, d) * 0.6 + n.o * 0.15,
    colour: d < 0.08 ? ACCENT : DEEP,
  };
}


// --- Stocks and Flows ---
// Marks flow in from the left (sparse, small) and accumulate on the right
// (dense, full-size). Purple marks the tap where flow meets stock.
function variantStocksAndFlows(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Left third: sparse flow. Middle: transition. Right third: dense stock.
  const isFlow = nx < 0.33;
  const isStock = nx > 0.66;
  const isTap = nx >= 0.42 && nx <= 0.58 && ny >= 0.35 && ny <= 0.65;

  if (isTap) {
    return {
      x: baseX + n.dx * 0.5,
      y: baseY + n.dy * 0.5,
      size: MARK_BASE + 1,
      opacity: 0.85,
      colour: ACCENT,
    };
  }

  if (isFlow) {
    // Sparse, small, drifting downward-right
    const drift = (1 - nx / 0.33) * 4;
    return {
      x: baseX + n.dx * 3 + drift * 0.5,
      y: baseY + n.dy * 2 + drift * 1.5,
      size: MARK_BASE * (0.5 + nx * 1.2),
      opacity: 0.15 + nx * 0.5,
      colour: DEEP,
    };
  }

  if (isStock) {
    // Dense, full-size, tightly packed
    return {
      x: baseX + n.dx * 0.3,
      y: baseY + n.dy * 0.3,
      size: MARK_BASE + 0.8,
      opacity: 0.6 + n.o * 0.25,
      colour: DEEP,
    };
  }

  // Middle transition
  const t = (nx - 0.33) / 0.33;
  return {
    x: baseX + n.dx * lerp(3, 0.5, t),
    y: baseY + n.dy * lerp(2, 0.5, t),
    size: MARK_BASE * lerp(0.7, 1.2, t),
    opacity: lerp(0.25, 0.6, t),
    colour: DEEP,
  };
}

// --- Boundaries ---
// A crisp rectangle in the centre-left. Inside: orderly. Outside: displaced.
// Purple marks trace the boundary line.
function variantBoundaries(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // Boundary rectangle: centre-left, ~40% of area
  const bLeft = 0.2, bRight = 0.6, bTop = 0.2, bBottom = 0.8;

  const inside = nx >= bLeft && nx <= bRight && ny >= bTop && ny <= bBottom;

  // Check if mark is on the boundary edge
  const onBoundaryX = (Math.abs(nx - bLeft) < 0.04 || Math.abs(nx - bRight) < 0.04) && ny >= bTop && ny <= bBottom;
  const onBoundaryY = (Math.abs(ny - bTop) < 0.04 || Math.abs(ny - bBottom) < 0.04) && nx >= bLeft && nx <= bRight;
  const onBoundary = onBoundaryX || onBoundaryY;

  if (onBoundary) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 0.8,
      opacity: 0.8,
      colour: ACCENT,
    };
  }

  if (inside) {
    return {
      x: baseX + n.dx * 0.3,
      y: baseY + n.dy * 0.3,
      size: MARK_BASE + 0.2,
      opacity: 0.55 + n.o * 0.2,
      colour: DEEP,
    };
  }

  // Outside: displaced, smaller, lower opacity
  const dToBoundaryX = nx < bLeft ? bLeft - nx : nx > bRight ? nx - bRight : 0;
  const dToBoundaryY = ny < bTop ? bTop - ny : ny > bBottom ? ny - bBottom : 0;
  const dToBoundary = Math.sqrt(dToBoundaryX ** 2 + dToBoundaryY ** 2);
  const disorder = Math.min(dToBoundary * 3, 1);

  return {
    x: baseX + n.dx * (2 + disorder * 4),
    y: baseY + n.dy * (2 + disorder * 4),
    size: MARK_BASE * (0.85 - disorder * 0.25),
    opacity: 0.3 + n.o * 0.15 - disorder * 0.1,
    colour: DEEP,
  };
}

// --- Interconnections ---
// 4-5 attractor points warp the grid. Marks pulled toward nearest attractor.
// Purple at attractor centres.
function variantInterconnections(ctx) {
  const { baseX, baseY, nx, ny, n, rng } = ctx;

  const attractors = [
    { x: 0.2, y: 0.3 },
    { x: 0.75, y: 0.25 },
    { x: 0.5, y: 0.6 },
    { x: 0.15, y: 0.8 },
    { x: 0.85, y: 0.75 },
  ];

  // Find nearest attractor and compute pull
  let minDist = Infinity;
  let pullX = 0, pullY = 0;
  let nearestIdx = 0;

  for (let i = 0; i < attractors.length; i++) {
    const a = attractors[i];
    const d = dist(nx, ny, a.x, a.y);
    if (d < minDist) {
      minDist = d;
      nearestIdx = i;
    }
  }

  // Pull toward nearest attractor, proportional to proximity
  const nearest = attractors[nearestIdx];
  const pullStrength = smoothstep(0.4, 0, minDist) * 8;
  const angle = Math.atan2(nearest.y - ny, nearest.x - nx);
  pullX = Math.cos(angle) * pullStrength;
  pullY = Math.sin(angle) * pullStrength;

  // Check if near second-nearest for tension
  let secondDist = Infinity;
  for (let i = 0; i < attractors.length; i++) {
    if (i === nearestIdx) continue;
    const d = dist(nx, ny, attractors[i].x, attractors[i].y);
    if (d < secondDist) secondDist = d;
  }
  const tension = smoothstep(0.3, 0.05, Math.abs(minDist - secondDist));

  const isCore = minDist < 0.06;

  return {
    x: baseX + pullX + n.dx * (1 + tension * 3),
    y: baseY + pullY + n.dy * (1 + tension * 3),
    size: MARK_BASE + (isCore ? 1.5 : 0) + tension * 0.8 + (n.s - 0.5) * 0.5,
    opacity: 0.35 + n.o * 0.25 + (isCore ? 0.35 : 0) + tension * 0.1,
    colour: isCore ? ACCENT : DEEP,
  };
}

// --- Nonlinearity ---
// Tiny disturbance on the left, massive disproportionate effect on the right.
// One purple mark slightly displaced on the left. Right side is wildly warped.
function variantNonlinearity(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // The small input: one purple mark near left
  const isInput = Math.abs(nx - 0.12) < 0.02 && Math.abs(ny - 0.45) < 0.04;

  if (isInput) {
    return {
      x: baseX + 2,
      y: baseY + 1.5,
      size: MARK_BASE + 1,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  // Amplification grows exponentially rightward
  const amplification = Math.pow(nx, 3) * 18;
  const sizeVariation = Math.pow(nx, 3) * 5;

  return {
    x: baseX + n.dx * (1 + amplification) + Math.sin(ny * 8 + nx * 5) * amplification * 0.3,
    y: baseY + n.dy * (1 + amplification) + Math.cos(nx * 12 + ny * 3) * amplification * 0.3,
    size: MARK_BASE + (n.s - 0.5) * sizeVariation,
    opacity: clamp(0.4 + n.o * 0.25 + nx * 0.15, 0.15, 0.85),
    colour: DEEP,
  };
}

// --- Buffers ---
// Left side: disturbed. Middle: dense buffer band. Right: perfectly regular.
// Purple scattered through the buffer.
function variantBuffers(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const bufferLeft = 0.33;
  const bufferRight = 0.66;
  const inBuffer = nx >= bufferLeft && nx <= bufferRight;
  const isLeft = nx < bufferLeft;

  if (inBuffer) {
    // Dense buffer band - absorbs chaos
    const bufferMid = (nx - bufferLeft) / (bufferRight - bufferLeft);
    const isPurple = n.extra > 0.82;
    return {
      x: baseX + n.dx * 0.4,
      y: baseY + n.dy * 0.4,
      size: MARK_BASE + 0.8,
      opacity: 0.6 + n.o * 0.2,
      colour: isPurple ? ACCENT : DEEP,
    };
  }

  if (isLeft) {
    // Disturbed left side
    const chaos = (1 - nx / bufferLeft) * 1;
    return {
      x: baseX + n.dx * (3 + chaos * 5),
      y: baseY + n.dy * (3 + chaos * 5),
      size: MARK_BASE + (n.s - 0.5) * 2,
      opacity: 0.25 + n.o * 0.25,
      colour: DEEP,
    };
  }

  // Right side: perfectly regular, undisturbed
  return {
    x: baseX + n.dx * 0.3,
    y: baseY + n.dy * 0.3,
    size: MARK_BASE + 0.1,
    opacity: 0.5 + n.o * 0.2,
    colour: DEEP,
  };
}

// --- S-Curves ---
// Slow start left, steep acceleration middle, plateau right.
// Purple marks the inflection point.
function variantSCurves(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Sigmoid function: maps nx to 0–1 with S-shape
  const steepness = 10;
  const midpoint = 0.45;
  const sigmoid = 1 / (1 + Math.exp(-steepness * (nx - midpoint)));

  // Marks rise from bottom to top following the S-curve
  // "height" determines vertical position shift
  const rise = sigmoid * 8;
  const sizeGrowth = sigmoid * 2;
  const opacityGrowth = sigmoid * 0.35;

  // Inflection zone: where the curve is steepest
  const inflectionDist = Math.abs(nx - midpoint);
  const atInflection = inflectionDist < 0.08;

  return {
    x: baseX + n.dx * 1.2,
    y: baseY - rise + n.dy * 1.2,
    size: MARK_BASE + sizeGrowth + (n.s - 0.5) * 0.6,
    opacity: clamp(0.2 + opacityGrowth + n.o * 0.2, 0.1, 0.85),
    colour: atInflection ? ACCENT : DEEP,
  };
}

// --- Overshoot and Collapse ---
// Marks grow and rise past sustainable limits, then crash dramatically.
// Purple at the peak of overshoot.
function variantOvershootCollapse(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Peak at about 40% across
  const peak = 0.4;

  if (nx <= peak) {
    // Growth phase: marks rise and grow
    const growth = Math.pow(nx / peak, 2);
    const rise = growth * 12;
    const sizeBoost = growth * 3;
    const atPeak = nx > peak - 0.08;

    return {
      x: baseX + n.dx * (1.5 - growth * 0.8),
      y: baseY - rise + n.dy * 1.2,
      size: MARK_BASE + sizeBoost + (n.s - 0.5) * 0.5,
      opacity: 0.35 + growth * 0.4 + n.o * 0.15,
      colour: atPeak ? ACCENT : DEEP,
    };
  }

  // Collapse phase: marks drop, shrink, fade
  const collapseProgress = (nx - peak) / (1 - peak);
  const crash = Math.pow(collapseProgress, 1.5);
  const peakRise = 12; // where we were at peak
  const drop = peakRise + crash * 8; // fall past original position

  return {
    x: baseX + n.dx * (1.5 + crash * 6),
    y: baseY - peakRise + drop + n.dy * (1 + crash * 4),
    size: Math.max(1, MARK_BASE * (1 - crash * 0.7)),
    opacity: Math.max(0.06, (0.7 - crash * 0.6) + n.o * 0.1),
    colour: DEEP,
  };
}

// --- Path Dependence ---
// A wandering purple path from left to right. Nearby marks pulled into its wake.
// Further right = more pull, showing how history constrains.
function variantPathDependence(ctx) {
  const { baseX, baseY, nx, ny, n, c, r, rng, noise } = ctx;

  // Generate a wandering path using seeded noise
  // Path y-position at each column, built from accumulated random walks
  const pathY = 0.5 + Math.sin(nx * 5 + 1.3) * 0.2 + Math.cos(nx * 8 + 2.7) * 0.1 + n.extra * 0.05;

  const distToPath = Math.abs(ny - pathY);
  const onPath = distToPath < 0.05;

  // Pull strength increases from left to right (history accumulates)
  const historyWeight = smoothstep(0, 1, nx);
  const pullStrength = smoothstep(0.3, 0, distToPath) * 6 * historyWeight;
  const pullDir = ny > pathY ? -1 : 1;

  if (onPath) {
    return {
      x: baseX + n.dx * 0.4,
      y: baseY + n.dy * 0.4,
      size: MARK_BASE + 0.8,
      opacity: 0.85,
      colour: ACCENT,
    };
  }

  return {
    x: baseX + n.dx * (1.5 - pullStrength * 0.15),
    y: baseY + pullDir * pullStrength + n.dy * 1.2,
    size: MARK_BASE + (n.s - 0.5) * 0.6,
    opacity: 0.35 + n.o * 0.25 + pullStrength * 0.03,
    colour: DEEP,
  };
}

// --- Lock-in ---
// Rigid frozen centre, purple ring around it, edges straining outward.
function variantLockIn(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const cx = 0.48, cy = 0.5;
  const d = dist(nx, ny, cx, cy);
  const angle = Math.atan2(ny - cy, nx - cx);

  const frozenRadius = 0.2;
  const ringRadius = 0.25;

  if (d < frozenRadius) {
    // Frozen zone: rigid, compressed, precise
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE - 0.4,
      opacity: 0.65,
      colour: DEEP,
    };
  }

  if (d < ringRadius) {
    // Purple ring: the boundary of lock-in
    return {
      x: baseX + n.dx * 0.3,
      y: baseY + n.dy * 0.3,
      size: MARK_BASE + 0.6,
      opacity: 0.8,
      colour: ACCENT,
    };
  }

  // Outside: straining outward, displacement increases toward edges
  const escape = smoothstep(ringRadius, 0.55, d) * 8;
  return {
    x: baseX + Math.cos(angle) * escape + n.dx * (1.5 + escape * 0.3),
    y: baseY + Math.sin(angle) * escape + n.dy * (1.5 + escape * 0.3),
    size: MARK_BASE + (n.s - 0.5) * 0.8,
    opacity: clamp(0.4 + n.o * 0.2 - escape * 0.03, 0.15, 0.7),
    colour: DEEP,
  };
}

// --- Attractors ---
// A single gravitational well in the lower-centre pulls everything toward it.
// Purple at the attractor point.
function variantAttractors(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const ax = 0.5, ay = 0.65;
  const d = dist(nx, ny, ax, ay);
  const angle = Math.atan2(ay - ny, ax - nx);

  const pull = smoothstep(0.6, 0, d) * 10;
  const isCore = d < 0.06;

  // Marks near the attractor pack tightly
  const compression = smoothstep(0.2, 0, d) * 0.5;

  return {
    x: baseX + Math.cos(angle) * pull + n.dx * (0.5 + d * 2),
    y: baseY + Math.sin(angle) * pull + n.dy * (0.5 + d * 2),
    size: MARK_BASE + compression * 2 + (n.s - 0.5) * 0.4 * (1 - compression),
    opacity: clamp(0.3 + n.o * 0.2 + smoothstep(0.5, 0, d) * 0.35, 0.1, 0.9),
    colour: isCore ? ACCENT : DEEP,
  };
}

// --- Equilibrium ---
// Two forces push from opposite sides. Middle band is perfectly balanced.
// Purple on both left and right edges (the two forces).
function variantEquilibrium(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Force from left pushes right, force from right pushes left
  const leftForce = smoothstep(0.35, 0, nx) * 5;
  const rightForce = smoothstep(0.65, 1, nx) * 5;
  const netForce = leftForce - rightForce; // positive = push right

  const isLeftForce = nx < 0.1;
  const isRightForce = nx > 0.9;

  // Middle zone: forces cancel, perfectly regular
  const inMiddle = nx > 0.4 && nx < 0.6;

  return {
    x: baseX + netForce + n.dx * (inMiddle ? 0.3 : 1.2),
    y: baseY + n.dy * (inMiddle ? 0.3 : 1.2),
    size: MARK_BASE + (inMiddle ? 0.3 : 0) + (n.s - 0.5) * 0.5,
    opacity: inMiddle ? 0.55 + n.o * 0.2 : 0.35 + n.o * 0.2,
    colour: (isLeftForce || isRightForce) ? ACCENT : DEEP,
  };
}

// --- Limits to Growth ---
// Growth from left hits an invisible ceiling on the right. Marks compress.
function variantLimitsToGrowth(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Growth phase: marks get bigger left to right
  const growth = smoothstep(0, 0.5, nx);
  const sizeBoost = growth * 2.5;

  // The ceiling: a horizontal line around row 0.35
  const ceiling = 0.35;
  const hitCeiling = nx > 0.5 && ny < ceiling;
  const ceilingProximity = nx > 0.5 ? smoothstep(0.5, 1, nx) : 0;

  // Purple marks along the ceiling line on the right side
  const onCeiling = nx > 0.45 && Math.abs(ny - ceiling) < 0.05;

  if (onCeiling) {
    return {
      x: baseX + n.dx * 0.3,
      y: baseY + n.dy * 0.3,
      size: MARK_BASE + 0.8,
      opacity: 0.85,
      colour: ACCENT,
    };
  }

  // Marks above ceiling on right side get pushed down and compressed
  const compression = hitCeiling ? ceilingProximity * 6 : 0;
  const squeeze = hitCeiling ? ceilingProximity * 0.6 : 0;

  return {
    x: baseX + n.dx * 1.2,
    y: baseY + compression + n.dy * (1 - squeeze * 0.5),
    size: MARK_BASE + sizeBoost * (1 - squeeze) + (n.s - 0.5) * 0.5,
    opacity: clamp(0.25 + growth * 0.35 + n.o * 0.2 - squeeze * 0.15, 0.1, 0.85),
    colour: DEEP,
  };
}

// --- Tragedy of the Commons ---
// Centre is depleted (faded, shrunken). Edges are healthy. Purple actors surround the void.
function variantTragedyCommons(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const cx = 0.5, cy = 0.5;
  const d = dist(nx, ny, cx, cy);

  // Depletion: centre is hollowed out
  const depletion = smoothstep(0.35, 0, d);

  // Actors: ring around the depleted zone
  const isActor = d > 0.2 && d < 0.3 && n.extra > 0.7;

  if (isActor) {
    return {
      x: baseX + n.dx * 0.8,
      y: baseY + n.dy * 0.8,
      size: MARK_BASE + 1.2,
      opacity: 0.8,
      colour: ACCENT,
    };
  }

  return {
    x: baseX + n.dx * (1 + depletion * 3),
    y: baseY + n.dy * (1 + depletion * 3),
    size: Math.max(0.8, MARK_BASE * (1 - depletion * 0.7) + (d > 0.3 ? 0.5 : 0)),
    opacity: clamp(0.15 + (1 - depletion) * 0.5 + n.o * 0.2, 0.04, 0.8),
    colour: DEEP,
  };
}

// --- Escalation ---
// Left and right halves mirror. Each row downward, marks grow and push apart.
// Purple grows on both sides. Centre gap widens.
function variantEscalation(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Escalation increases top to bottom
  const intensity = Math.pow(ny, 1.5);
  const sizeBoost = intensity * 3;
  const spread = intensity * 8;

  // Push away from centre
  const isLeft = nx < 0.5;
  const pushDir = isLeft ? -1 : 1;

  // Purple on both sides, growing with intensity
  const isPurple = intensity > 0.4 && Math.abs(nx - 0.5) < 0.2;

  return {
    x: baseX + pushDir * spread + n.dx * 1,
    y: baseY + n.dy * 1,
    size: MARK_BASE + sizeBoost + (n.s - 0.5) * 0.5,
    opacity: clamp(0.3 + intensity * 0.4 + n.o * 0.15, 0.15, 0.85),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Growth and Underinvestment ---
// Top grows while bottom thins. Contrast increases left to right.
// Purple in booming top-right.
function variantGrowthUnderinvestment(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Time progression left to right
  const time = nx;
  // Top half grows, bottom half erodes
  const isTop = ny < 0.5;
  const topness = 1 - ny; // 1 at top, 0 at bottom

  if (isTop) {
    // Growth: bigger, bolder, displaced upward over time
    const boom = time * topness;
    const isPurple = time > 0.7 && ny < 0.3;
    return {
      x: baseX + n.dx * 1,
      y: baseY - boom * 4 + n.dy * 0.8,
      size: MARK_BASE + boom * 2.5 + (n.s - 0.5) * 0.5,
      opacity: clamp(0.35 + boom * 0.4 + n.o * 0.2, 0.2, 0.85),
      colour: isPurple ? ACCENT : DEEP,
    };
  }

  // Bottom: foundation erodes over time
  const erosion = time * ny;
  return {
    x: baseX + n.dx * (1 + erosion * 4),
    y: baseY + erosion * 3 + n.dy * (1 + erosion * 2),
    size: Math.max(1, MARK_BASE * (1 - erosion * 0.6)),
    opacity: Math.max(0.06, 0.45 - erosion * 0.4 + n.o * 0.15),
    colour: DEEP,
  };
}

// --- Rule Beating ---
// One horizontal rule line through the middle. Marks above and below dodge around it.
// Purple on the rule line.
function variantRuleBeating(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const ruleLine = 0.5;
  const distToRule = Math.abs(ny - ruleLine);

  // On the rule: perfect, rigid, purple
  if (distToRule < 0.04) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 0.4,
      opacity: 0.8,
      colour: ACCENT,
    };
  }

  // Adjacent rows: marks dodge sideways, squeeze into gaps
  const dodgeZone = distToRule < 0.2;
  const dodgeIntensity = dodgeZone ? smoothstep(0.2, 0.04, distToRule) : 0;

  // Sideways displacement - alternating direction based on position
  const dodgeDir = Math.sin(nx * 18 + n.extra * 6) * dodgeIntensity * 7;
  // Slight vertical squeeze toward or away from rule
  const vertSqueeze = (ny < ruleLine ? 1 : -1) * dodgeIntensity * 2;

  return {
    x: baseX + dodgeDir + n.dx * (1 + dodgeIntensity * 0.5),
    y: baseY + vertSqueeze + n.dy * 1,
    size: MARK_BASE + (n.s - 0.5) * 0.5 + dodgeIntensity * 0.3,
    opacity: 0.35 + n.o * 0.25 + dodgeIntensity * 0.1,
    colour: DEEP,
  };
}

// --- Leverage Points ---
// One small purple mark displaces a huge region of the grid.
function variantLeveragePoints(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const pivotX = 0.22, pivotY = 0.45;
  const d = dist(nx, ny, pivotX, pivotY);

  // The single leverage point
  if (d < 0.04) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 0.5,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  // Displacement radiates outward - strong near, fading far
  const influence = Math.max(0, 1 - d / 0.7);
  const angle = Math.atan2(ny - pivotY, nx - pivotX);
  const push = influence * influence * 10;

  return {
    x: baseX + Math.cos(angle) * push + n.dx * 0.8,
    y: baseY + Math.sin(angle) * push + n.dy * 0.8,
    size: MARK_BASE + influence * 1.2 + (n.s - 0.5) * 0.5,
    opacity: clamp(0.3 + n.o * 0.3 + influence * 0.15, 0.15, 0.8),
    colour: DEEP,
  };
}

// --- Policy Resistance ---
// Force pushes hard from left, but system snaps back. Lots of effort, almost no result.
function variantPolicyResistance(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Purple policy force on the left — big, bold, unmissable
  const isPurple = nx < 0.12;

  // Policy push: strong on the left, rapidly absorbed
  const policyPush = nx < 0.4 ? Math.pow(1 - nx / 0.4, 2) * 14 : 0;
  // System counter-push: the grid fights back from the right
  const counterPush = nx > 0.4 ? -(nx - 0.4) * 3 : 0;
  const netDx = policyPush + counterPush;

  // Vertical turbulence near the collision zone (0.3-0.5)
  const turbZone = smoothstep(0.15, 0.35, nx) * smoothstep(0.55, 0.35, nx);
  const turbDy = turbZone * Math.sin(ny * 20 + n.extra * 8) * 4;

  return {
    x: baseX + netDx + n.dx * 0.5,
    y: baseY + turbDy + n.dy * 0.5,
    size: MARK_BASE + (isPurple ? 1.5 : 0) + (n.s - 0.5) * 0.4,
    opacity: clamp(isPurple ? 0.85 : 0.3 + n.o * 0.3, 0.15, 0.85),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- System Traps ---
// A deep funnel pulling marks down and inward. Dramatic sinkhole effect.
function variantSystemTraps(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const pitX = 0.58, pitY = 0.45;
  const d = dist(nx, ny, pitX, pitY);
  const radius = 0.38;

  // Inside the pit — dramatic funnel
  if (d < radius) {
    const depth = Math.pow(1 - d / radius, 1.5);
    const angle = Math.atan2(ny - pitY, nx - pitX);
    const pullInward = depth * 12;
    const pullDown = depth * depth * 14;

    // Purple at the deepest point
    const isPurple = d < 0.09;

    return {
      x: baseX - Math.cos(angle) * pullInward * 0.6 + n.dx * 0.2,
      y: baseY + pullDown + n.dy * 0.2,
      size: Math.max(0.5, MARK_BASE * (1 - depth * 0.7)),
      opacity: clamp(0.1 + (1 - depth) * 0.4, 0.04, isPurple ? 0.9 : 0.6),
      colour: isPurple ? ACCENT : DEEP,
    };
  }

  // Rim: marks lean strongly inward toward the pit
  const rimWidth = 0.15;
  if (d < radius + rimWidth) {
    const rimStrength = 1 - (d - radius) / rimWidth;
    const angle = Math.atan2(ny - pitY, nx - pitX);
    return {
      x: baseX - Math.cos(angle) * rimStrength * 5 + n.dx * 0.5,
      y: baseY - Math.sin(angle) * rimStrength * 3 + rimStrength * 3 + n.dy * 0.5,
      size: MARK_BASE + (n.s - 0.5) * 0.4,
      opacity: 0.35 + n.o * 0.2,
      colour: DEEP,
    };
  }

  return {
    x: baseX + n.dx * 1.2,
    y: baseY + n.dy * 1.2,
    size: MARK_BASE + (n.s - 0.5) * 0.5,
    opacity: 0.35 + n.o * 0.25,
    colour: DEEP,
  };
}

// --- Second-Order Effects ---
// Ripple from a point. First ring mild, second ring much more disruptive.
function variantSecondOrderEffects(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const originX = 0.25, originY = 0.45;
  const d = dist(nx, ny, originX, originY);
  const angle = Math.atan2(ny - originY, nx - originX);

  // Origin point
  if (d < 0.04) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 0.5,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  // First ring: mild displacement
  const firstRing = smoothstep(0.06, 0.15, d) * smoothstep(0.25, 0.15, d);
  // Second ring: much larger displacement
  const secondRing = smoothstep(0.2, 0.32, d) * smoothstep(0.45, 0.32, d);

  const push1 = firstRing * 3;
  const push2 = secondRing * 9;
  const push = push1 + push2;

  return {
    x: baseX + Math.cos(angle) * push + n.dx * (1 + secondRing * 2),
    y: baseY + Math.sin(angle) * push + n.dy * (1 + secondRing * 2),
    size: MARK_BASE + firstRing * 0.8 + secondRing * 2 + (n.s - 0.5) * 0.5,
    opacity: clamp(0.3 + n.o * 0.25 + firstRing * 0.1 + secondRing * 0.2, 0.15, 0.8),
    colour: DEEP,
  };
}

// --- Catalytic Mechanisms ---
// Small purple cluster; surrounding marks dramatically realign into orderly diagonal rows.
function variantCatalyticMechanisms(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // Catalyst cluster: tight diagonal of 4 marks in left-centre
  const catX = 0.25, catY = 0.40;
  const diagSlope = 1.0;
  const onDiag = (Math.abs(nx - catX) < 0.07 && Math.abs(ny - catY - (nx - catX) * diagSlope) < 0.05);

  if (onDiag) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 1.5,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  // Distance from catalyst
  const d = dist(nx, ny, catX, catY);
  const influence = smoothstep(0.6, 0.05, d);

  // Strong reorganisation: snap marks toward diagonal alignment
  const diagAngle = Math.atan2(diagSlope, 1);
  // Project position onto the diagonal direction and snap toward grid lines along it
  const projectedPhase = Math.sin((nx * Math.cos(diagAngle) + ny * Math.sin(diagAngle)) * 25);
  const snapDx = Math.cos(diagAngle) * projectedPhase * influence * 6;
  const snapDy = Math.sin(diagAngle) * projectedPhase * influence * 6;

  // Far marks retain their noise; near marks are snapped into new order
  const noiseScale = 1 - influence * 0.9;

  return {
    x: baseX + snapDx + n.dx * noiseScale,
    y: baseY + snapDy + n.dy * noiseScale,
    size: MARK_BASE + influence * 1 + (n.s - 0.5) * 0.4,
    opacity: clamp(0.25 + n.o * 0.25 + influence * 0.3, 0.15, 0.8),
    colour: DEEP,
  };
}

// --- Nudges ---
// One purple mark slightly displaced; its column and neighbours cascade with gentle shifts.
// Subtle but visible — the contrast against the pristine grid is the message.
function variantNudges(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  const nudgeCol = 5;
  const nudgeRow = 2;
  const nudgeAmount = 3.5;

  // The nudge mark itself — purple, slightly displaced
  if (c === nudgeCol && r === nudgeRow) {
    return {
      x: baseX + nudgeAmount,
      y: baseY + 1.5,
      size: MARK_BASE + 1,
      opacity: 0.85,
      colour: ACCENT,
    };
  }

  // Column below the nudge: cascade of gentle shifts
  if (c === nudgeCol && r > nudgeRow) {
    const fade = Math.pow(Math.max(0, 1 - (r - nudgeRow) / (ROWS - nudgeRow - 1)), 0.7);
    return {
      x: baseX + nudgeAmount * fade,
      y: baseY + 1.5 * fade,
      size: MARK_BASE + (n.s - 0.5) * 0.3,
      opacity: 0.4 + n.o * 0.2,
      colour: DEEP,
    };
  }

  // Adjacent columns feel a smaller ripple
  const colDist = Math.abs(c - nudgeCol);
  if (colDist <= 2 && colDist > 0 && r >= nudgeRow) {
    const lateralFade = 1 - (colDist - 1) / 2;
    const vertFade = Math.pow(Math.max(0, 1 - (r - nudgeRow) / (ROWS - nudgeRow)), 0.8);
    const shift = nudgeAmount * 0.4 * lateralFade * vertFade;
    return {
      x: baseX + shift,
      y: baseY + 0.5 * lateralFade * vertFade,
      size: MARK_BASE + (n.s - 0.5) * 0.4,
      opacity: 0.35 + n.o * 0.25,
      colour: DEEP,
    };
  }

  // Everything else: perfectly still grid (minimal noise to contrast the nudge)
  return {
    x: baseX + n.dx * 0.4,
    y: baseY + n.dy * 0.4,
    size: MARK_BASE + (n.s - 0.5) * 0.3,
    opacity: 0.35 + n.o * 0.2,
    colour: DEEP,
  };
}

// --- Constraints ---
// Bold vertical wall. Left side visibly compressed into tight, precise rows. Right side loose.
function variantConstraints(ctx) {
  const { baseX, baseY, nx, ny, n, hSpace } = ctx;

  const wallX = 0.65;
  const wallWidth = 0.05;

  // The constraint wall: empty column
  if (Math.abs(nx - wallX) < wallWidth / 2) {
    return { x: baseX, y: baseY, size: 0, opacity: 0, colour: DEEP };
  }

  // Purple marks along the constraint wall (both edges)
  const nearWall = Math.abs(nx - wallX);
  if (nearWall < wallWidth * 1.8 && nearWall >= wallWidth / 2) {
    return {
      x: baseX + (nx < wallX ? 2 : -2),
      y: baseY,
      size: MARK_BASE + 1,
      opacity: 0.85,
      colour: ACCENT,
    };
  }

  // Left of wall: compressed horizontally, very orderly, tighter spacing
  if (nx < wallX) {
    // Squeeze marks toward the wall — the closer to the wall, the more compressed
    const squeeze = smoothstep(0, wallX, nx);
    return {
      x: baseX + squeeze * 4 + n.dx * 0.15,
      y: baseY + n.dy * 0.15,
      size: MARK_BASE + 0.3,
      opacity: clamp(0.45 + n.o * 0.2, 0.35, 0.7),
      colour: DEEP,
    };
  }

  // Right of wall: loose, scattered, less organised
  return {
    x: baseX + n.dx * 4,
    y: baseY + n.dy * 4,
    size: MARK_BASE + (n.s - 0.5) * 2,
    opacity: 0.2 + n.o * 0.3,
    colour: DEEP,
  };
}

// --- Requisite Variety ---
// Top half: varied marks. Bottom half mirrors the top's variety. Purple in bottom (the controller).
function variantRequisiteVariety(ctx) {
  const { baseX, baseY, nx, ny, n, c, r, noise } = ctx;

  const gap = 0.48; // thin gap between halves

  // Gap row
  if (Math.abs(ny - 0.5) < 0.04) {
    return {
      x: baseX,
      y: baseY,
      size: 0,
      opacity: 0,
      colour: DEEP,
    };
  }

  const isTop = ny < gap;

  if (isTop) {
    // System variety: marks vary considerably
    const sizeVar = n.s * 3;
    const dispX = n.dx * 4;
    const dispY = n.dy * 3;
    return {
      x: baseX + dispX,
      y: baseY + dispY,
      size: MARK_BASE + sizeVar - 1,
      opacity: clamp(0.15 + n.o * 0.6, 0.1, 0.8),
      colour: DEEP,
    };
  }

  // Bottom half: mirror the top's variety
  const mirrorRow = ROWS - 1 - r;
  const mn = (mirrorRow >= 0 && mirrorRow < ROWS) ? noise[mirrorRow][c] : n;

  const sizeVar = mn.s * 3;
  const dispX = mn.dx * 4;
  const dispY = mn.dy * 3;
  const isPurple = n.extra > 0.75;

  return {
    x: baseX + dispX,
    y: baseY - dispY,
    size: MARK_BASE + sizeVar - 1,
    opacity: clamp(0.15 + mn.o * 0.6, 0.1, isPurple ? 0.85 : 0.8),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Complexity vs Complication ---
// Left: precise, mechanical, structured variety. Right: organic, alive, unpredictable.
function variantComplexityComplication(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  if (nx < 0.48) {
    // Complicated side: perfectly aligned, structured size pattern (gear-like)
    const pattern = ((c % 3) + (r % 3)) / 5;
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + pattern * 2.5,
      opacity: clamp(0.4 + pattern * 0.3, 0.3, 0.75),
      colour: DEEP,
    };
  }

  // Complex side: organic displacement, clustering, unpredictable
  const cluster = Math.sin(nx * 15 + n.extra * 12) * Math.cos(ny * 12 + n.s * 10);
  const isPurple = nx > 0.55 && n.extra > 0.78;

  return {
    x: baseX + n.dx * 6 + cluster * 4,
    y: baseY + n.dy * 5 + Math.sin(n.extra * 20) * 3,
    size: MARK_BASE + n.s * 2.5 - 0.5,
    opacity: clamp(0.2 + n.o * 0.5, 0.1, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Wicked Problems ---
// Multiple overlapping disturbances. Entangled, no clean solution.
function variantWickedProblems(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // 4 disturbance origins
  const origins = [
    { x: 0.2, y: 0.3, fx: -1, fy: 0, scale: 1 },
    { x: 0.7, y: 0.25, fx: 0, fy: -1, scale: 0.8 },
    { x: 0.5, y: 0.7, fx: 1, fy: 0.5, scale: 1.1 },
    { x: 0.85, y: 0.6, fx: -0.5, fy: 1, scale: 0.7 },
  ];

  let totalDx = 0, totalDy = 0, totalSize = 0;
  let isPurple = false;

  for (const o of origins) {
    const d = dist(nx, ny, o.x, o.y);
    if (d < 0.05) isPurple = true;
    const influence = Math.max(0, 1 - d / 0.45);
    const strength = influence * influence * 8 * o.scale;
    totalDx += o.fx * strength;
    totalDy += o.fy * strength;
    totalSize += influence * 0.8;
  }

  return {
    x: baseX + totalDx + n.dx * 1.5,
    y: baseY + totalDy + n.dy * 1.5,
    size: MARK_BASE + totalSize + (n.s - 0.5) * 0.5,
    opacity: clamp(0.25 + n.o * 0.3 + Math.min(totalSize, 1) * 0.2, 0.12, isPurple ? 0.9 : 0.8),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Co-evolution ---
// Two regions (top/bottom) with mirroring patterns that respond to each other.
function variantCoEvolution(ctx) {
  const { baseX, baseY, nx, ny, n, c, r, noise } = ctx;

  // Gap rows in the middle
  if (Math.abs(ny - 0.5) < 0.04) {
    return { x: baseX, y: baseY, size: 0, opacity: 0, colour: DEEP };
  }

  const isTop = ny < 0.5;
  const mirrorRow = ROWS - 1 - r;
  const mn = (mirrorRow >= 0 && mirrorRow < ROWS) ? noise[mirrorRow][c] : n;

  // Each half has its own displacement, shaped by the other
  const ownWave = Math.sin(nx * 8 + n.extra * 5) * 5;
  const otherWave = Math.sin(nx * 8 + mn.extra * 5) * 3;

  // Where top pushes down, bottom pushes up to meet it
  const pushToward = isTop ? 3 : -3;
  const ownSize = MARK_BASE + n.s * 2;
  const mirrorSize = MARK_BASE + mn.s * 1.5;

  // Purple along the boundary
  const nearBoundary = Math.abs(ny - 0.5) < 0.12 && Math.abs(ny - 0.5) > 0.04;

  return {
    x: baseX + ownWave + otherWave * 0.4 + n.dx * 1,
    y: baseY + (isTop ? 1 : -1) * otherWave * 0.5 + pushToward * smoothstep(0.3, 0.04, Math.abs(ny - 0.5)),
    size: lerp(ownSize, mirrorSize, 0.3),
    opacity: clamp(0.3 + n.o * 0.35, 0.15, nearBoundary ? 0.85 : 0.75),
    colour: nearBoundary ? ACCENT : DEEP,
  };
}

// --- Uncertainty vs Risk ---
// Left: regular wave (quantifiable risk). Right: chaotic randomness (true uncertainty).
function variantUncertaintyRisk(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Regular wave on the left (risk: predictable variation)
  const waveAmplitude = 5;
  const wave = Math.sin(ny * 10 + nx * 3) * waveAmplitude * (1 - nx);

  // Random chaos on the right (uncertainty: no pattern)
  const chaos = nx * nx * 12;
  const randomDx = (n.dx - 0) * chaos;
  const randomDy = (n.dy - 0) * chaos;

  // Blend from wave to chaos
  const blend = smoothstep(0.3, 0.7, nx);
  const dx = lerp(wave, randomDx, blend);
  const dy = lerp(wave * 0.3, randomDy, blend);

  // Size: regular left, wild right
  const sizeLeft = MARK_BASE + Math.sin(ny * 8) * 0.5;
  const sizeRight = MARK_BASE + (n.s - 0.5) * blend * 4;

  // Purple at the boundary where pattern dissolves
  const isPurple = nx > 0.38 && nx < 0.55 && n.extra > 0.7;

  return {
    x: baseX + dx + n.dx * 0.3,
    y: baseY + dy + n.dy * 0.3,
    size: lerp(sizeLeft, sizeRight, blend),
    opacity: clamp(0.3 + n.o * 0.3, 0.15, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Sensitivity to Initial Conditions ---
// Top and bottom halves start identical on left, diverge wildly by the right.
function variantSensitivityInitialConditions(ctx) {
  const { baseX, baseY, nx, ny, n, c, r, noise } = ctx;

  const isTop = ny < 0.5;
  const mirrorRow = ROWS - 1 - r;
  const mn = (mirrorRow >= 0 && mirrorRow < ROWS) ? noise[mirrorRow][c] : n;

  // The tiny initial difference: one purple mark in top half shifted by 1px
  const isButterfly = isTop && c === 3 && r === 3;
  if (isButterfly) {
    return {
      x: baseX + 2,
      y: baseY + 1,
      size: MARK_BASE + 1,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  // Divergence increases left to right (exponentially)
  const divergence = Math.pow(nx, 2.5);

  // Both halves use same base pattern, but top accumulates the perturbation
  const baseWave = Math.sin(nx * 12 + mn.extra * 4) * 4;

  if (isTop) {
    // Top: increasingly perturbed
    const perturbDx = baseWave + n.dx * divergence * 14;
    const perturbDy = n.dy * divergence * 10;
    const sizeVar = divergence * n.s * 3;
    return {
      x: baseX + perturbDx,
      y: baseY + perturbDy,
      size: MARK_BASE + sizeVar,
      opacity: clamp(0.35 + n.o * 0.3, 0.15, 0.8),
      colour: DEEP,
    };
  }

  // Bottom: stays closer to the base pattern
  return {
    x: baseX + baseWave + n.dx * divergence * 2,
    y: baseY + n.dy * divergence * 1.5,
    size: MARK_BASE + divergence * mn.s * 0.8,
    opacity: clamp(0.35 + mn.o * 0.3, 0.15, 0.8),
    colour: DEEP,
  };
}

// --- Irreducibility ---
// Large-scale wave pattern only visible at full grid scale. Locally looks random.
function variantIrreducibility(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Large-scale diagonal wave across the full grid
  const bigWave = Math.sin(nx * 3.5 + ny * 2.5) * 0.5 + 0.5; // 0 to 1
  // Secondary wave for depth
  const wave2 = Math.cos(nx * 2.2 - ny * 3.8) * 0.5 + 0.5;
  const combined = (bigWave + wave2) / 2;

  // Size encodes the large-scale pattern
  const patternSize = MARK_BASE + combined * 3.5;

  // Add local noise that disguises the pattern at small scale
  const localNoise = (n.s - 0.5) * 1.5;

  // Displacement: gentle drift following the wave
  const dx = Math.cos(nx * 3.5 + ny * 2.5) * combined * 3 + n.dx * 2;
  const dy = Math.sin(nx * 2.2 - ny * 3.8) * combined * 2 + n.dy * 2;

  // Purple marks at the wave peaks - look arbitrary in isolation
  const isPurple = combined > 0.78 && n.extra > 0.5;

  return {
    x: baseX + dx,
    y: baseY + dy,
    size: patternSize + localNoise,
    opacity: clamp(0.2 + combined * 0.45 + n.o * 0.15, 0.1, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Mental Models ---
// Circular lens distorts a region. Inside: clockwise rotation. Outside: regular. Sharp boundary.
function variantMentalModels(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const lensX = 0.48, lensY = 0.45;
  const lensR = 0.28;
  const d = dist(nx, ny, lensX, lensY);

  // Purple boundary ring
  if (Math.abs(d - lensR) < 0.03) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 0.8,
      opacity: 0.85,
      colour: ACCENT,
    };
  }

  // Inside the lens: clockwise rotation distortion
  if (d < lensR) {
    const strength = (1 - d / lensR) * 8;
    const angle = Math.atan2(ny - lensY, nx - lensX);
    const rotAngle = angle + strength * 0.15;
    return {
      x: baseX + Math.cos(rotAngle) * strength - Math.cos(angle) * strength * 0.3,
      y: baseY + Math.sin(rotAngle) * strength - Math.sin(angle) * strength * 0.3,
      size: MARK_BASE + (1 - d / lensR) * 1.5,
      opacity: clamp(0.35 + (1 - d / lensR) * 0.3 + n.o * 0.15, 0.2, 0.8),
      colour: DEEP,
    };
  }

  // Outside: regular grid
  return {
    x: baseX + n.dx * 1,
    y: baseY + n.dy * 1,
    size: MARK_BASE + (n.s - 0.5) * 0.5,
    opacity: 0.35 + n.o * 0.2,
    colour: DEEP,
  };
}

// --- Systems Mapping ---
// Invisible paths through the grid pull marks into alignment. Purple at intersections.
function variantSystemsMapping(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Define 5 paths as lines
  const paths = [
    { y: 0.25, angle: 0.05 },
    { y: 0.50, angle: -0.08 },
    { y: 0.75, angle: 0.03 },
  ];
  const diagPaths = [
    { x0: 0.1, y0: 0.1, x1: 0.9, y1: 0.8 },
    { x0: 0.8, y0: 0.1, x1: 0.2, y1: 0.9 },
  ];

  let minDist = 1;
  let pullY = 0;
  let atIntersection = false;

  // Horizontal paths
  for (const p of paths) {
    const pathY = p.y + nx * p.angle;
    const d = Math.abs(ny - pathY);
    if (d < minDist) {
      minDist = d;
      pullY = pathY;
    }
  }

  // Diagonal paths
  let diagCount = 0;
  for (const p of diagPaths) {
    const pathY = lerp(p.y0, p.y1, nx);
    const d = Math.abs(ny - pathY);
    if (d < 0.08) diagCount++;
    if (d < minDist) {
      minDist = d;
      pullY = pathY;
    }
  }

  const nearPath = minDist < 0.08;
  const pullStrength = nearPath ? smoothstep(0.08, 0, minDist) : 0;
  atIntersection = diagCount >= 1 && minDist < 0.06;

  // Purple at intersections
  if (atIntersection && n.extra > 0.4) {
    return {
      x: baseX + n.dx * 0.3,
      y: baseY + (pullY - ny) * 30 * pullStrength,
      size: MARK_BASE + 1.2,
      opacity: 0.85,
      colour: ACCENT,
    };
  }

  return {
    x: baseX + n.dx * (1 - pullStrength * 0.7),
    y: baseY + (pullY - ny) * 20 * pullStrength + n.dy * (1 - pullStrength * 0.7),
    size: MARK_BASE + pullStrength * 0.8 + (n.s - 0.5) * 0.4,
    opacity: clamp(0.3 + n.o * 0.25 + pullStrength * 0.2, 0.15, 0.75),
    colour: DEEP,
  };
}

// --- Iceberg Model ---
// Top rows clear. Deeper rows fade, shift, grow. Purple at the deep forces.
function variantIcebergModel(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Depth increases top to bottom
  const depth = ny;

  // Fade line around row 0.25
  const surfaceLine = 0.22;
  const belowSurface = ny > surfaceLine;

  // Purple in the deep bottom
  const isPurple = ny > 0.75 && n.extra > 0.6;

  if (!belowSurface) {
    // Surface: clear, regular, visible
    return {
      x: baseX + n.dx * 0.5,
      y: baseY + n.dy * 0.5,
      size: MARK_BASE + 0.3,
      opacity: 0.6 + n.o * 0.2,
      colour: DEEP,
    };
  }

  // Below surface: progressive fade, displacement, and growth
  const depthBelow = (ny - surfaceLine) / (1 - surfaceLine);
  const depthFade = Math.pow(depthBelow, 0.8);

  return {
    x: baseX + n.dx * (1 + depthFade * 5),
    y: baseY + n.dy * (1 + depthFade * 3),
    size: MARK_BASE + depthFade * 3.5 + (n.s - 0.5) * depthFade * 2,
    opacity: clamp(0.55 - depthFade * 0.4 + n.o * 0.1, 0.06, isPurple ? 0.8 : 0.5),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Event-Pattern-Structure ---
// Three horizontal bands: dramatic events, repeating wave, uniform structure.
function variantEventPatternStructure(ctx) {
  const { baseX, baseY, nx, ny, n, c } = ctx;

  // Top band: events (sudden dramatic displacements)
  if (ny < 0.3) {
    const isEvent = n.extra > 0.75;
    const spike = isEvent ? 12 : 0;
    return {
      x: baseX + (isEvent ? (n.dx * spike) : n.dx * 0.8),
      y: baseY + (isEvent ? (n.dy * spike) : n.dy * 0.8),
      size: MARK_BASE + (isEvent ? 2.5 : 0),
      opacity: isEvent ? 0.8 : 0.35 + n.o * 0.2,
      colour: DEEP,
    };
  }

  // Middle band: repeating wave pattern
  if (ny < 0.65) {
    const wave = Math.sin(c * 0.9) * 5;
    return {
      x: baseX + n.dx * 0.5,
      y: baseY + wave,
      size: MARK_BASE + Math.abs(Math.sin(c * 0.9)) * 1.5,
      opacity: 0.35 + n.o * 0.25,
      colour: DEEP,
    };
  }

  // Bottom band: uniform structural displacement
  const isPurple = n.extra > 0.7;
  return {
    x: baseX + 4 + n.dx * 0.3,
    y: baseY + 2 + n.dy * 0.3,
    size: MARK_BASE + 0.5,
    opacity: clamp(0.4 + n.o * 0.2, 0.3, isPurple ? 0.85 : 0.65),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Linear Thinking ---
// Straight centre line. Rows above and below curve away increasingly. Gap widens to the right.
function variantLinearThinking(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const centreLine = 0.5;
  const distFromCentre = ny - centreLine;
  const absD = Math.abs(distFromCentre);

  // Purple marks on the straight centre line
  if (absD < 0.04) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 0.6,
      opacity: 0.8,
      colour: ACCENT,
    };
  }

  // Curvature increases with distance from centre AND left to right
  const curve = distFromCentre * nx * nx * 18;
  const spread = absD * nx * 6;

  return {
    x: baseX + n.dx * 0.8,
    y: baseY + curve + (distFromCentre > 0 ? spread : -spread) + n.dy * 0.5,
    size: MARK_BASE + absD * nx * 2 + (n.s - 0.5) * 0.4,
    opacity: clamp(0.35 + n.o * 0.25 - absD * nx * 0.2, 0.1, 0.7),
    colour: DEEP,
  };
}

// --- System Blindness ---
// One bright purple centre mark. Surrounding 60% nearly invisible. Edges normal.
function variantSystemBlindness(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const focusX = 0.45, focusY = 0.42;
  const d = dist(nx, ny, focusX, focusY);

  // The one bright mark everyone focuses on
  if (d < 0.04) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 2,
      opacity: 0.95,
      colour: ACCENT,
    };
  }

  // The blind zone: surrounding structure nearly invisible
  const blindZone = d > 0.04 && d < 0.5;
  const edgeDist = Math.max(
    Math.min(nx, 1 - nx),
    Math.min(ny, 1 - ny)
  );
  const atEdge = edgeDist > 0.35;

  if (blindZone && !atEdge) {
    return {
      x: baseX + n.dx * 2,
      y: baseY + n.dy * 2,
      size: MARK_BASE + (n.s - 0.5) * 0.5,
      opacity: clamp(0.06 + n.o * 0.08, 0.04, 0.15),
      colour: DEEP,
    };
  }

  // Edges: normal visibility
  return {
    x: baseX + n.dx * 1.5,
    y: baseY + n.dy * 1.5,
    size: MARK_BASE + (n.s - 0.5) * 0.5,
    opacity: 0.35 + n.o * 0.25,
    colour: DEEP,
  };
}

// --- Map is Not the Territory ---
// Alternating rows/cols: "map" marks (regular, purple) vs "territory" marks (messy, faint).
function variantMapTerritory(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  const isMap = (c % 2 === 0) && (r % 2 === 0);

  if (isMap) {
    // Map positions: perfectly regular, purple
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 0.5,
      opacity: 0.7,
      colour: ACCENT,
    };
  }

  // Territory: displaced, varied, lower opacity - the messy reality
  return {
    x: baseX + n.dx * 5,
    y: baseY + n.dy * 5,
    size: MARK_BASE + (n.s - 0.5) * 3,
    opacity: clamp(0.12 + n.o * 0.2, 0.06, 0.35),
    colour: DEEP,
  };
}

// --- Dynamic Thinking ---
// Each mark has 2-3 echo trails to the left (past). Purple marks have longest trails.
function variantDynamicThinking(ctx) {
  const { baseX, baseY, nx, ny, n, hSpace } = ctx;

  // Current position: displaced from grid (the system has moved)
  const moveDx = n.dx * 4 + Math.sin(ny * 8) * 3;
  const moveDy = n.dy * 3 + Math.cos(nx * 6) * 2;

  // Key marks with longest trails
  const isKey = n.extra > 0.82;

  // This function returns only the current mark position
  // Echoes are handled by generating extra marks in generateMarks
  // Instead, we offset the mark and use opacity to suggest motion
  const trailLength = isKey ? 3 : 2;

  return {
    x: baseX + moveDx,
    y: baseY + moveDy,
    size: MARK_BASE + (isKey ? 1 : 0.3),
    opacity: clamp(0.4 + n.o * 0.3, 0.25, isKey ? 0.9 : 0.75),
    colour: isKey ? ACCENT : DEEP,
    // Echo data for the component to render
    echoes: trailLength,
    echoDx: -moveDx / trailLength,
    echoDy: -moveDy / trailLength,
  };
}

// --- Resilience ---
// Shock wave from left, grid recovers by right. Purple in recovery zone.
function variantResilience(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Shock intensity: strong on left, fading right
  const shock = Math.pow(Math.max(0, 1 - nx / 0.7), 2);
  const waveDx = shock * 12 * Math.sin(ny * 8 + n.extra * 4);
  const waveDy = shock * 8 * Math.cos(ny * 6 + n.s * 5);

  // Purple in recovery zone (middle)
  const isPurple = nx > 0.25 && nx < 0.55 && n.extra > 0.75;

  return {
    x: baseX + waveDx + n.dx * shock * 2,
    y: baseY + waveDy + n.dy * shock * 1.5,
    size: MARK_BASE + shock * 1.5 + (n.s - 0.5) * 0.4,
    opacity: clamp(0.35 + n.o * 0.25 + shock * 0.1, 0.2, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Robustness vs Resilience ---
// Top: rigid, unmoved. Bottom: bends and recovers. Purple in bottom-left displacement.
function variantRobustnessResilience(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const isTop = ny < 0.47;
  const shock = Math.pow(Math.max(0, 1 - nx / 0.6), 2);

  if (isTop) {
    // Robustness: completely rigid, no displacement at all
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 0.2,
      opacity: 0.45 + n.o * 0.15,
      colour: DEEP,
    };
  }

  // Resilience: bends significantly then recovers
  const bendDx = shock * 14 * Math.sin(ny * 6 + n.extra * 3);
  const bendDy = shock * 8 * Math.cos(nx * 4 + n.s * 5);
  const isPurple = nx < 0.35 && ny > 0.53 && n.extra > 0.6;

  return {
    x: baseX + bendDx + n.dx * 0.5,
    y: baseY + bendDy + n.dy * 0.5,
    size: MARK_BASE + shock * 1 + (n.s - 0.5) * 0.4,
    opacity: clamp(0.3 + n.o * 0.3, 0.15, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Antifragility ---
// Shock from left, but marks in/after impact zone grow larger and stronger.
function variantAntifragility(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Disturbance zone on the left
  const inShock = nx < 0.35;
  const shock = inShock ? (1 - nx / 0.35) : 0;
  const shockDx = shock * 8 * (n.dx);
  const shockDy = shock * 6 * (n.dy);

  // Growth zone: marks after the shock are bigger, bolder
  const growth = nx > 0.2 ? smoothstep(0.2, 0.7, nx) * 3 : 0;
  const isPurple = nx > 0.3 && nx < 0.65 && n.extra > 0.75;

  return {
    x: baseX + shockDx + n.dx * 0.5,
    y: baseY + shockDy + n.dy * 0.5,
    size: MARK_BASE + growth + shock * 0.5 + (n.s - 0.5) * 0.3,
    opacity: clamp(0.3 + growth * 0.12 + n.o * 0.2, 0.15, isPurple ? 0.9 : 0.8),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Adaptive Capacity ---
// Diamond of empty space in centre. Marks flow around it orderly. Purple nearest the intrusion.
function variantAdaptiveCapacity(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Diamond intrusion in the centre
  const cx = 0.5, cy = 0.45;
  const diamondDist = Math.abs(nx - cx) * 1.2 + Math.abs(ny - cy);
  const diamondR = 0.18;

  // Inside the diamond: empty
  if (diamondDist < diamondR) {
    return { x: baseX, y: baseY, size: 0, opacity: 0, colour: DEEP };
  }

  // Displacement: flow around the diamond
  const proximity = Math.max(0, 1 - (diamondDist - diamondR) / 0.25);
  const angle = Math.atan2(ny - cy, nx - cx);
  const flowDx = Math.cos(angle + Math.PI / 2) * proximity * 5;
  const flowDy = Math.sin(angle + Math.PI / 2) * proximity * 5;
  const pushOut = proximity * 4;

  const isPurple = proximity > 0.6 && diamondDist >= diamondR;

  return {
    x: baseX + Math.cos(angle) * pushOut + flowDx + n.dx * (1 - proximity * 0.7),
    y: baseY + Math.sin(angle) * pushOut + flowDy + n.dy * (1 - proximity * 0.7),
    size: MARK_BASE + (n.s - 0.5) * 0.4,
    opacity: clamp(0.35 + n.o * 0.25 + proximity * 0.1, 0.2, isPurple ? 0.9 : 0.7),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Redundancy ---
// 30% marks missing, remaining marks larger. One cluster gap with strong compensation. Purple at compensation.
function variantRedundancy(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // Big cluster failure near centre-right
  const clusterX = 0.6, clusterY = 0.45;
  const clusterD = dist(nx, ny, clusterX, clusterY);
  const inCluster = clusterD < 0.1;

  // Scattered missing marks (seeded by noise)
  const isMissing = inCluster || (n.extra < 0.3 && !inCluster);

  if (isMissing) {
    return { x: baseX, y: baseY, size: 0, opacity: 0, colour: DEEP };
  }

  // Compensation: marks near missing areas grow
  const nearCluster = clusterD < 0.22 && clusterD >= 0.1;
  const compensation = nearCluster ? (1 - (clusterD - 0.1) / 0.12) * 3 : 0;
  const scatterComp = n.extra < 0.45 ? 1.5 : 0; // near scattered gaps

  const isPurple = nearCluster && compensation > 1.5;

  return {
    x: baseX + n.dx * 0.8,
    y: baseY + n.dy * 0.8,
    size: MARK_BASE + 1 + compensation + scatterComp * 0.5 + (n.s - 0.5) * 0.3,
    opacity: clamp(0.4 + n.o * 0.25 + compensation * 0.08, 0.25, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Panarchy ---
// Three nested scales of wave pattern. Purple where all three align.
function variantPanarchy(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Large scale wave
  const large = Math.sin(nx * 2.5 + ny * 1.5) * 6;
  // Medium scale wave
  const medium = Math.sin(nx * 7 + ny * 5) * 3.5;
  // Small scale ripple
  const small = Math.sin(nx * 18 + ny * 14 + n.extra * 3) * 1.8;

  const totalDy = large + medium + small;
  const totalDx = Math.cos(nx * 2.5 + ny * 1.5) * 3 + Math.cos(nx * 7 + ny * 5) * 2;

  // All three scales aligning = dramatic
  const largeAbs = Math.abs(Math.sin(nx * 2.5 + ny * 1.5));
  const medAbs = Math.abs(Math.sin(nx * 7 + ny * 5));
  const smallAbs = Math.abs(Math.sin(nx * 18 + ny * 14 + n.extra * 3));
  const alignment = largeAbs * medAbs * smallAbs;
  const isPurple = alignment > 0.5 && n.extra > 0.5;

  return {
    x: baseX + totalDx + n.dx * 0.5,
    y: baseY + totalDy + n.dy * 0.5,
    size: MARK_BASE + Math.abs(totalDy) * 0.15 + (n.s - 0.5) * 0.4,
    opacity: clamp(0.3 + n.o * 0.25 + alignment * 0.2, 0.15, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Transformability ---
// Left: old system. Middle: transformation chaos. Right: new different system.
function variantTransformability(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Left third: regular old system
  if (nx < 0.3) {
    return {
      x: baseX + n.dx * 0.5,
      y: baseY + n.dy * 0.5,
      size: MARK_BASE + 0.2,
      opacity: 0.4 + n.o * 0.2,
      colour: DEEP,
    };
  }

  // Middle third: transformation flux
  if (nx < 0.65) {
    const chaos = smoothstep(0.3, 0.48, nx) * smoothstep(0.65, 0.48, nx);
    const isPurple = chaos > 0.5 && n.extra > 0.6;
    return {
      x: baseX + n.dx * chaos * 10,
      y: baseY + n.dy * chaos * 8,
      size: MARK_BASE + (n.s - 0.3) * chaos * 4,
      opacity: clamp(0.15 + n.o * 0.3 + (1 - chaos) * 0.2, 0.06, isPurple ? 0.9 : 0.7),
      colour: isPurple ? ACCENT : DEEP,
    };
  }

  // Right third: new system - different pattern (diagonal offset)
  const newPattern = Math.sin(ny * 12 + nx * 4) * 3;
  return {
    x: baseX + newPattern + n.dx * 0.3,
    y: baseY + Math.cos(nx * 8 + ny * 3) * 2 + n.dy * 0.3,
    size: MARK_BASE + 0.8 + Math.abs(Math.sin(ny * 6)) * 1,
    opacity: 0.45 + n.o * 0.2,
    colour: DEEP,
  };
}

// --- Punctuated Equilibrium ---
// Long stable stretches, narrow bursts of dramatic change. Purple in bursts.
function variantPunctuatedEquilibrium(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Two burst zones
  const burst1 = Math.abs(nx - 0.38) < 0.06;
  const burst2 = Math.abs(nx - 0.75) < 0.06;
  const inBurst = burst1 || burst2;

  if (inBurst) {
    const isPurple = n.extra > 0.55;
    return {
      x: baseX + n.dx * 12,
      y: baseY + n.dy * 10,
      size: MARK_BASE + n.s * 3,
      opacity: clamp(0.35 + n.o * 0.35, 0.2, isPurple ? 0.9 : 0.8),
      colour: isPurple ? ACCENT : DEEP,
    };
  }

  // Stable equilibrium sections
  return {
    x: baseX + n.dx * 0.4,
    y: baseY + n.dy * 0.4,
    size: MARK_BASE + 0.2,
    opacity: 0.4 + n.o * 0.15,
    colour: DEEP,
  };
}

// --- Safe-to-Fail Experiments ---
// 4-5 small purple probes. Some have local effects, others don't. No probe affects the whole grid.
function variantSafeToFail(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // 5 experiment locations
  const experiments = [
    { x: 0.2, y: 0.3, success: true },
    { x: 0.5, y: 0.2, success: true },
    { x: 0.75, y: 0.6, success: true },
    { x: 0.35, y: 0.7, success: false },
    { x: 0.8, y: 0.3, success: false },
  ];

  let nearestD = 1;
  let nearestExp = null;

  for (const exp of experiments) {
    const d = dist(nx, ny, exp.x, exp.y);
    if (d < nearestD) {
      nearestD = d;
      nearestExp = exp;
    }
  }

  // On an experiment: purple probe mark
  if (nearestD < 0.04) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 1.2,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  // Local effect zone (only for successful experiments)
  if (nearestExp && nearestExp.success && nearestD < 0.14) {
    const effect = (1 - nearestD / 0.14);
    const angle = Math.atan2(ny - nearestExp.y, nx - nearestExp.x);
    return {
      x: baseX + Math.cos(angle) * effect * 5 + n.dx * 0.5,
      y: baseY + Math.sin(angle) * effect * 5 + n.dy * 0.5,
      size: MARK_BASE + effect * 1.5 + (n.s - 0.5) * 0.3,
      opacity: clamp(0.3 + n.o * 0.25 + effect * 0.15, 0.2, 0.75),
      colour: DEEP,
    };
  }

  // Rest of grid: undisturbed
  return {
    x: baseX + n.dx * 1,
    y: baseY + n.dy * 1,
    size: MARK_BASE + (n.s - 0.5) * 0.4,
    opacity: 0.35 + n.o * 0.2,
    colour: DEEP,
  };
}

// --- Boundary Critique ---
// Two overlapping boundary rectangles. Marks inside both bright, one medium, neither faint.
function variantBoundaryCritique(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Boundary A
  const inA = nx > 0.15 && nx < 0.7 && ny > 0.15 && ny < 0.75;
  // Boundary B (offset)
  const inB = nx > 0.3 && nx < 0.85 && ny > 0.25 && ny < 0.85;

  // Purple along boundary lines
  const onBorderA = inA && (Math.abs(nx - 0.15) < 0.03 || Math.abs(nx - 0.7) < 0.03 || Math.abs(ny - 0.15) < 0.04 || Math.abs(ny - 0.75) < 0.04);
  const onBorderB = inB && (Math.abs(nx - 0.3) < 0.03 || Math.abs(nx - 0.85) < 0.03 || Math.abs(ny - 0.25) < 0.04 || Math.abs(ny - 0.85) < 0.04);
  const isPurple = onBorderA || onBorderB;

  const both = inA && inB;
  const one = (inA || inB) && !both;

  let opacity;
  if (both) opacity = 0.7 + n.o * 0.15;
  else if (one) opacity = 0.35 + n.o * 0.15;
  else opacity = 0.1 + n.o * 0.08;

  return {
    x: baseX + n.dx * 0.8,
    y: baseY + n.dy * 0.8,
    size: MARK_BASE + (both ? 0.5 : 0) + (n.s - 0.5) * 0.3,
    opacity: isPurple ? 0.85 : opacity,
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Multiple Perspectives ---
// Three viewpoints pull marks in different directions. Purple at each viewpoint.
function variantMultiplePerspectives(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const views = [
    { x: 0.15, y: 0.2 },
    { x: 0.8, y: 0.25 },
    { x: 0.45, y: 0.85 },
  ];

  let totalDx = 0, totalDy = 0;
  let isPurple = false;

  for (const v of views) {
    const d = dist(nx, ny, v.x, v.y);
    if (d < 0.05) isPurple = true;
    const pull = Math.max(0, 1 - d / 0.5);
    const angle = Math.atan2(v.y - ny, v.x - nx);
    totalDx += Math.cos(angle) * pull * pull * 8;
    totalDy += Math.sin(angle) * pull * pull * 8;
  }

  return {
    x: baseX + totalDx + n.dx * 0.5,
    y: baseY + totalDy + n.dy * 0.5,
    size: MARK_BASE + (isPurple ? 1.5 : 0) + (n.s - 0.5) * 0.4,
    opacity: clamp(0.3 + n.o * 0.25 + Math.min(Math.abs(totalDx) + Math.abs(totalDy), 8) * 0.03, 0.15, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Stakeholder Mapping ---
// 6-7 purple gravity wells attracting nearby marks. Varying cluster sizes.
function variantStakeholderMapping(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const stakeholders = [
    { x: 0.2, y: 0.3, strength: 1.2 },
    { x: 0.55, y: 0.2, strength: 0.8 },
    { x: 0.8, y: 0.4, strength: 1.5 },
    { x: 0.35, y: 0.65, strength: 0.6 },
    { x: 0.7, y: 0.75, strength: 1.0 },
    { x: 0.15, y: 0.8, strength: 0.5 },
  ];

  let totalDx = 0, totalDy = 0;
  let isPurple = false;
  let nearestD = 1;

  for (const s of stakeholders) {
    const d = dist(nx, ny, s.x, s.y);
    if (d < nearestD) nearestD = d;
    if (d < 0.04) isPurple = true;
    const pull = Math.max(0, 1 - d / 0.25) * s.strength;
    const angle = Math.atan2(s.y - ny, s.x - nx);
    totalDx += Math.cos(angle) * pull * pull * 10;
    totalDy += Math.sin(angle) * pull * pull * 10;
  }

  return {
    x: baseX + totalDx + n.dx * 0.4,
    y: baseY + totalDy + n.dy * 0.4,
    size: MARK_BASE + (isPurple ? 1.8 : 0) + (n.s - 0.5) * 0.3,
    opacity: clamp(0.25 + n.o * 0.3 + (nearestD < 0.15 ? 0.2 : 0), 0.12, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Power in Systems ---
// One large purple mark. Everything bends toward it. Gravitational dominance.
function variantPowerInSystems(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const powerX = 0.42, powerY = 0.4;
  const d = dist(nx, ny, powerX, powerY);

  // The power node
  if (d < 0.05) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 3,
      opacity: 0.95,
      colour: ACCENT,
    };
  }

  // Everything bends toward the power node
  const angle = Math.atan2(powerY - ny, powerX - nx);
  const pull = Math.pow(Math.max(0, 1 - d / 0.8), 1.5) * 14;

  return {
    x: baseX + Math.cos(angle) * pull + n.dx * 0.3,
    y: baseY + Math.sin(angle) * pull + n.dy * 0.3,
    size: MARK_BASE + (d < 0.15 ? 1 : 0) + (n.s - 0.5) * 0.3,
    opacity: clamp(0.3 + n.o * 0.25 + (1 - d) * 0.1, 0.15, 0.75),
    colour: DEEP,
  };
}

// --- Local vs Global Optimisation ---
// 3-4 small perfect regions that don't align with each other. Messy gaps between.
function variantLocalGlobalOptimisation(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // Define locally optimised regions
  const regions = [
    { x: 0.15, y: 0.2, w: 0.18, h: 0.22, offX: 2, offY: 1 },
    { x: 0.55, y: 0.15, w: 0.18, h: 0.22, offX: -1.5, offY: 2 },
    { x: 0.3, y: 0.6, w: 0.18, h: 0.22, offX: 1, offY: -1.5 },
    { x: 0.72, y: 0.55, w: 0.18, h: 0.22, offX: -2, offY: -1 },
  ];

  for (const reg of regions) {
    const inRegion = Math.abs(nx - reg.x) < reg.w / 2 && Math.abs(ny - reg.y) < reg.h / 2;
    if (inRegion) {
      const atCentre = Math.abs(nx - reg.x) < 0.03 && Math.abs(ny - reg.y) < 0.04;
      return {
        x: baseX + reg.offX,
        y: baseY + reg.offY,
        size: MARK_BASE + 0.3,
        opacity: atCentre ? 0.85 : 0.55 + n.o * 0.15,
        colour: atCentre ? ACCENT : DEEP,
      };
    }
  }

  // Between regions: messy
  return {
    x: baseX + n.dx * 5,
    y: baseY + n.dy * 5,
    size: MARK_BASE + (n.s - 0.5) * 1.5,
    opacity: 0.2 + n.o * 0.2,
    colour: DEEP,
  };
}

// --- Nested Systems (Holons) ---
// Sub-grids with tighter spacing nested in the larger grid. Purple at sub-grid centres.
function variantNestedSystems(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const subGrids = [
    { x: 0.22, y: 0.3, r: 0.13 },
    { x: 0.6, y: 0.25, r: 0.11 },
    { x: 0.4, y: 0.7, r: 0.14 },
    { x: 0.78, y: 0.65, r: 0.10 },
  ];

  for (const sg of subGrids) {
    const d = dist(nx, ny, sg.x, sg.y);
    if (d < sg.r) {
      const atCentre = d < 0.03;
      // Tighter internal pattern: snap toward sub-grid lines
      const localPhase = Math.sin((nx - sg.x) * 60) * 2 + Math.cos((ny - sg.y) * 60) * 2;
      return {
        x: baseX + localPhase * 0.3 + n.dx * 0.2,
        y: baseY + Math.cos((nx - sg.x) * 60) * 0.3 + n.dy * 0.2,
        size: MARK_BASE - 0.5 + (n.s - 0.5) * 0.3,
        opacity: clamp(0.5 + n.o * 0.2, 0.35, atCentre ? 0.9 : 0.7),
        colour: atCentre ? ACCENT : DEEP,
      };
    }
  }

  // Larger grid: normal spacing
  return {
    x: baseX + n.dx * 1.5,
    y: baseY + n.dy * 1.5,
    size: MARK_BASE + (n.s - 0.5) * 0.5,
    opacity: 0.3 + n.o * 0.2,
    colour: DEEP,
  };
}

// --- Scale Effects ---
// Small working pattern on left. Same pattern fails at larger scale toward right.
function variantScaleEffects(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // The pattern: a diamond/checkerboard that works at small scale
  const patternPhase = ((c + r) % 2 === 0);

  // Scale factor increases left to right
  const scale = 1 + nx * nx * 8;

  // Small cluster on the left (5x5 area): tight, perfect
  const inSmall = nx < 0.22 && ny > 0.25 && ny < 0.7;
  if (inSmall) {
    const isPurple = patternPhase && n.extra > 0.5;
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + (patternPhase ? 1 : 0),
      opacity: 0.55 + (patternPhase ? 0.2 : 0) + n.o * 0.1,
      colour: isPurple ? ACCENT : DEEP,
    };
  }

  // Rightward: pattern replicates but strains and breaks
  const strain = smoothstep(0.2, 0.8, nx);
  const breakDown = strain * strain;
  const patternDx = patternPhase ? Math.sin(ny * scale) * breakDown * 10 : 0;
  const patternDy = patternPhase ? Math.cos(nx * scale) * breakDown * 8 : 0;

  return {
    x: baseX + patternDx + n.dx * breakDown * 3,
    y: baseY + patternDy + n.dy * breakDown * 3,
    size: MARK_BASE + (patternPhase ? 1 * (1 - breakDown * 0.5) : 0) + breakDown * n.s * 1.5,
    opacity: clamp(0.4 + n.o * 0.2 - breakDown * 0.15, 0.1, 0.7),
    colour: DEEP,
  };
}

// --- Learning Organisation ---
// Grid self-corrects left to right. Errors on left, precision on right. Purple at correction points.
function variantLearningOrganisation(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Error decreases left to right
  const error = Math.pow(1 - nx, 2.5);
  const dx = n.dx * error * 10;
  const dy = n.dy * error * 8;

  // Purple where correction is most visible (mid-grid)
  const isPurple = nx > 0.3 && nx < 0.55 && n.extra > 0.78;

  return {
    x: baseX + dx,
    y: baseY + dy,
    size: MARK_BASE + error * 1.5 + (n.s - 0.5) * error * 1,
    opacity: clamp(0.35 + n.o * 0.25 + (1 - error) * 0.1, 0.2, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Sensemaking ---
// Scattered chaos on left, emerging structure in middle, clear pattern on right.
function variantSensemaking(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Chaos-to-order transition
  const chaos = Math.pow(Math.max(0, 1 - nx / 0.6), 2);
  const order = Math.pow(Math.max(0, (nx - 0.4) / 0.6), 2);

  // Chaotic displacement
  const chaosDx = n.dx * chaos * 10;
  const chaosDy = n.dy * chaos * 8;

  // Ordered pattern: marks snap into wave alignment
  const wave = Math.sin(ny * 10 + nx * 2) * order * 3;

  // Purple at transition (where structure first appears)
  const isPurple = nx > 0.3 && nx < 0.5 && n.extra > 0.75;

  return {
    x: baseX + chaosDx + n.dx * 0.3,
    y: baseY + chaosDy + wave + n.dy * 0.3,
    size: MARK_BASE + chaos * n.s * 2.5 + order * 0.5,
    opacity: clamp(0.2 + n.o * 0.2 + order * 0.25 + chaos * 0.1, 0.1, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Institutional Inertia ---
// Dense, heavy grid. Force from left barely moves it. Purple on left edge.
function variantInstitutionalInertia(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Dense, heavy system: oversized, high opacity
  const isPurple = nx < 0.1;

  // Tiny displacement from left — the system barely budges
  const push = Math.max(0, 1 - nx / 0.5) * 2;

  return {
    x: baseX + push + n.dx * 0.2,
    y: baseY + n.dy * 0.2,
    size: MARK_BASE + 0.8,
    opacity: clamp(0.5 + n.o * 0.15, 0.4, isPurple ? 0.9 : 0.7),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Distributed Leadership ---
// 8 purple marks scattered, each organising its local area strongly. No central control.
function variantDistributedLeadership(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const leaders = [
    { x: 0.12, y: 0.25 }, { x: 0.42, y: 0.18 }, { x: 0.72, y: 0.22 },
    { x: 0.88, y: 0.5 }, { x: 0.25, y: 0.55 }, { x: 0.55, y: 0.52 },
    { x: 0.15, y: 0.8 }, { x: 0.7, y: 0.78 },
  ];

  let nearestD = 1;
  let nearestLeader = null;
  let isPurple = false;

  for (const l of leaders) {
    const d = dist(nx, ny, l.x, l.y);
    if (d < nearestD) { nearestD = d; nearestLeader = l; }
    if (d < 0.04) isPurple = true;
  }

  // On a leader: bold purple
  if (isPurple) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 2,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  // Strong local organisation: marks pulled toward nearest leader and aligned
  const influence = smoothstep(0.2, 0, nearestD);
  const angle = Math.atan2(nearestLeader.y - ny, nearestLeader.x - nx);
  const pullDx = Math.cos(angle) * influence * 8;
  const pullDy = Math.sin(angle) * influence * 8;

  return {
    x: baseX + pullDx + n.dx * (1 - influence * 0.8),
    y: baseY + pullDy + n.dy * (1 - influence * 0.8),
    size: MARK_BASE + influence * 1 + (n.s - 0.5) * 0.3,
    opacity: clamp(0.25 + n.o * 0.2 + influence * 0.3, 0.15, 0.75),
    colour: DEEP,
  };
}

// --- Groupthink ---
// Dramatic convergence toward centre. Edges nearly empty. Dense purple conformist mass.
function variantGroupthink(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const cx = 0.5, cy = 0.48;
  const d = dist(nx, ny, cx, cy);
  const angle = Math.atan2(cy - ny, cx - nx);

  // Aggressive pull toward centre — stronger for distant marks
  const pull = Math.pow(d, 0.6) * 18;

  // Purple core: tight conformist mass
  const isPurple = d < 0.12;

  // Edges become very faint as marks migrate inward
  const edgeFade = smoothstep(0.2, 0.6, d);

  return {
    x: baseX + Math.cos(angle) * pull + n.dx * 0.1,
    y: baseY + Math.sin(angle) * pull + n.dy * 0.1,
    size: MARK_BASE + 0.5 * (1 - edgeFade),
    opacity: clamp(0.7 - edgeFade * 0.6 + n.o * 0.08, 0.04, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Theory of Change ---
// Bold stepping stones left to right with strong ripple effects. Messy reality between.
function variantTheoryOfChange(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const steps = [
    { x: 0.08, y: 0.48 },
    { x: 0.26, y: 0.38 },
    { x: 0.44, y: 0.5 },
    { x: 0.62, y: 0.35 },
    { x: 0.80, y: 0.45 },
    { x: 0.94, y: 0.4 },
  ];

  let nearestD = 1;
  let nearestStep = null;

  for (const s of steps) {
    const d = dist(nx, ny, s.x, s.y);
    if (d < nearestD) {
      nearestD = d;
      nearestStep = s;
    }
  }

  // On a stepping stone: bold purple
  if (nearestD < 0.045) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 2.5,
      opacity: 0.92,
      colour: ACCENT,
    };
  }

  // Strong effect zone around each step — ripples outward
  if (nearestD < 0.2) {
    const effect = Math.pow(1 - nearestD / 0.2, 1.5);
    const angle = Math.atan2(ny - nearestStep.y, nx - nearestStep.x);
    return {
      x: baseX + Math.cos(angle) * effect * 7 + n.dx * 0.3,
      y: baseY + Math.sin(angle) * effect * 7 + n.dy * 0.3,
      size: MARK_BASE + effect * 1.5 + (n.s - 0.5) * 0.3,
      opacity: clamp(0.3 + n.o * 0.2 + effect * 0.3, 0.2, 0.75),
      colour: DEEP,
    };
  }

  // Background: messy (reality between the theory's neat steps)
  return {
    x: baseX + n.dx * 4,
    y: baseY + n.dy * 4,
    size: MARK_BASE + (n.s - 0.5) * 1.2,
    opacity: 0.15 + n.o * 0.15,
    colour: DEEP,
  };
}

// --- Outcome Mapping ---
// Interior stable, edges show most change. Purple along edges.
function variantOutcomeMapping(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Distance from edge (0 = at edge, higher = interior)
  const edgeDist = Math.min(nx, 1 - nx, ny, 1 - ny);
  const atEdge = edgeDist < 0.15;
  const edgeIntensity = atEdge ? (1 - edgeDist / 0.15) : 0;

  const isPurple = edgeDist < 0.06 && n.extra > 0.5;

  // Edge marks: displaced, varying, active
  const edgeDx = edgeIntensity * n.dx * 8;
  const edgeDy = edgeIntensity * n.dy * 6;
  const edgeSize = edgeIntensity * (n.s * 3 - 1);

  return {
    x: baseX + edgeDx + n.dx * 0.5,
    y: baseY + edgeDy + n.dy * 0.5,
    size: MARK_BASE + edgeSize + (n.s - 0.5) * 0.3,
    opacity: clamp(0.3 + n.o * 0.2 + edgeIntensity * 0.25, 0.2, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Proxy Measures ---
// One large purple proxy mark. Actual marks diverge from what the proxy suggests.
function variantProxyMeasures(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const proxyX = 0.45, proxyY = 0.45;
  const d = dist(nx, ny, proxyX, proxyY);

  // The proxy mark itself
  if (d < 0.04) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 3,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  // Region the proxy represents: marks diverge from proxy's suggestion
  const inRegion = d < 0.35;
  if (inRegion) {
    // Marks pushed away from proxy — they don't match it
    const angle = Math.atan2(ny - proxyY, nx - proxyX);
    const divergence = smoothstep(0.04, 0.35, d);
    const pushAway = divergence * 5;
    const sizeVar = divergence * n.s * 2.5;

    return {
      x: baseX + Math.cos(angle) * pushAway + n.dx * divergence * 3,
      y: baseY + Math.sin(angle) * pushAway + n.dy * divergence * 3,
      size: MARK_BASE + sizeVar,
      opacity: clamp(0.3 + n.o * 0.25 + (1 - divergence) * 0.1, 0.15, 0.7),
      colour: DEEP,
    };
  }

  // Outside region: normal
  return {
    x: baseX + n.dx * 1.2,
    y: baseY + n.dy * 1.2,
    size: MARK_BASE + (n.s - 0.5) * 0.5,
    opacity: 0.35 + n.o * 0.2,
    colour: DEEP,
  };
}

// --- Signal vs Noise ---
// All marks jitter randomly. One diagonal line of marks displaced consistently — the signal.
function variantSignalNoise(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // The signal: a diagonal line from top-left to bottom-right
  const onSignal = Math.abs((r - 2) - (c - 4) * 0.5) < 0.6 && c >= 4 && c <= 18;

  if (onSignal) {
    // Consistent displacement — the pattern
    return {
      x: baseX + 3,
      y: baseY + 2,
      size: MARK_BASE + 0.8,
      opacity: 0.7,
      colour: ACCENT,
    };
  }

  // Noise: random jitter on everything else
  return {
    x: baseX + n.dx * 4,
    y: baseY + n.dy * 4,
    size: MARK_BASE + (n.s - 0.5) * 1.5,
    opacity: 0.25 + n.o * 0.25,
    colour: DEEP,
  };
}

// --- Weak Signals ---
// Grid perfectly regular except 2-3 marks at the far right edge slightly displaced.
function variantWeakSignals(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // The weak signals: marks at far right, specific rows
  const isWeakSignal = c >= COLS - 2 && (r === 4 || r === 6 || r === 8);
  const isPurple = c === COLS - 1 && r === 6;

  if (isWeakSignal) {
    const shift = (c === COLS - 1) ? 3 : 1.5;
    return {
      x: baseX + shift,
      y: baseY + shift * 0.5,
      size: MARK_BASE + (c === COLS - 1 ? 1.2 : 0.6),
      opacity: isPurple ? 0.8 : 0.55,
      colour: isPurple ? ACCENT : DEEP,
    };
  }

  // Everything else: perfectly calm, minimal noise
  return {
    x: baseX + n.dx * 0.3,
    y: baseY + n.dy * 0.3,
    size: MARK_BASE + (n.s - 0.5) * 0.2,
    opacity: 0.38 + n.o * 0.15,
    colour: DEEP,
  };
}

// --- Feedback Starvation ---
// Left drifts off course. Right faded to nothing (starved feedback). Gap between.
function variantFeedbackStarvation(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Gap in the middle where feedback is cut off
  if (nx > 0.45 && nx < 0.55) {
    return { x: baseX, y: baseY, size: 0, opacity: 0, colour: DEEP };
  }

  // Left side: drifting progressively off course
  if (nx <= 0.45) {
    const drift = nx * nx * 15;
    const driftDy = Math.sin(ny * 6 + nx * 4) * drift;
    return {
      x: baseX + drift * 0.5 + n.dx * 0.5,
      y: baseY + driftDy + n.dy * 0.5,
      size: MARK_BASE + nx * 1.5 + (n.s - 0.5) * 0.4,
      opacity: clamp(0.4 + n.o * 0.2, 0.25, 0.7),
      colour: DEEP,
    };
  }

  // Right side: starved feedback — nearly invisible
  const isPurple = nx > 0.6 && n.extra > 0.7;
  const fade = smoothstep(0.55, 0.9, nx);

  return {
    x: baseX + n.dx * 1,
    y: baseY + n.dy * 1,
    size: MARK_BASE + (n.s - 0.5) * 0.3,
    opacity: clamp(0.12 - fade * 0.06 + n.o * 0.06, 0.04, isPurple ? 0.7 : 0.18),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Observer Effect ---
// Spotlight circle: suspiciously perfect. Outside: natural irregularity. Purple observer at top.
function variantObserverEffect(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const spotX = 0.48, spotY = 0.5;
  const spotR = 0.22;
  const d = dist(nx, ny, spotX, spotY);

  // The observer mark at top of spotlight
  const isObserver = Math.abs(nx - spotX) < 0.03 && Math.abs(ny - (spotY - spotR - 0.05)) < 0.04;
  if (isObserver) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 1.5,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  // Inside spotlight: suspiciously perfect
  if (d < spotR) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 0.3,
      opacity: 0.55,
      colour: DEEP,
    };
  }

  // Just outside spotlight: the natural irregularity being suppressed
  if (d < spotR + 0.12) {
    const edginess = 1 - (d - spotR) / 0.12;
    return {
      x: baseX + n.dx * (2 + edginess * 3),
      y: baseY + n.dy * (2 + edginess * 3),
      size: MARK_BASE + n.s * edginess * 2 + (n.s - 0.5) * 0.5,
      opacity: 0.3 + n.o * 0.25,
      colour: DEEP,
    };
  }

  // Far from spotlight: normal grid
  return {
    x: baseX + n.dx * 2,
    y: baseY + n.dy * 2,
    size: MARK_BASE + (n.s - 0.5) * 0.8,
    opacity: 0.3 + n.o * 0.25,
    colour: DEEP,
  };
}

// --- Systemic Design ---
// Grid warped into elegant intentional curve. Purple at inflection points.
function variantSystemicDesign(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Smooth sinusoidal curve across the grid
  const curveY = 0.5 + Math.sin(nx * Math.PI * 1.2 - 0.3) * 0.25;
  const distToCurve = ny - curveY;
  const absDist = Math.abs(distToCurve);

  // Marks follow the curve — displaced toward it
  const pull = smoothstep(0.35, 0, absDist) * 8;
  const curveDy = -distToCurve * pull * 0.3;

  // Inflection points (where curve changes direction)
  const inflection1 = Math.abs(nx - 0.25) < 0.04;
  const inflection2 = Math.abs(nx - 0.65) < 0.04;
  const inflection3 = Math.abs(nx - 0.9) < 0.04;
  const isPurple = (inflection1 || inflection2 || inflection3) && absDist < 0.08;

  // Marks on the curve are slightly larger
  const onCurve = absDist < 0.06;

  return {
    x: baseX + n.dx * 0.4,
    y: baseY + curveDy + n.dy * 0.4,
    size: MARK_BASE + (onCurve ? 1.2 : 0) + (n.s - 0.5) * 0.3,
    opacity: clamp(0.3 + n.o * 0.2 + (onCurve ? 0.2 : 0), 0.2, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Participatory Systems Mapping ---
// 4-5 regions with bridge lines of aligned marks connecting them. Purple at bridges.
function variantParticipatoryMapping(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Bridge paths between regions
  const bridges = [
    { x0: 0.15, y0: 0.3, x1: 0.4, y1: 0.2 },
    { x0: 0.4, y0: 0.2, x1: 0.7, y1: 0.35 },
    { x0: 0.2, y0: 0.65, x1: 0.55, y1: 0.7 },
    { x0: 0.55, y0: 0.7, x1: 0.85, y1: 0.55 },
    { x0: 0.4, y0: 0.2, x1: 0.55, y1: 0.7 },
  ];

  let minBridgeDist = 1;
  for (const b of bridges) {
    // Distance from point to line segment
    const dx = b.x1 - b.x0, dy = b.y1 - b.y0;
    const len2 = dx * dx + dy * dy;
    const t = clamp(((nx - b.x0) * dx + (ny - b.y0) * dy) / len2, 0, 1);
    const projX = b.x0 + t * dx, projY = b.y0 + t * dy;
    const d = dist(nx, ny, projX, projY);
    if (d < minBridgeDist) minBridgeDist = d;
  }

  const onBridge = minBridgeDist < 0.05;
  const nearBridge = minBridgeDist < 0.1;
  const isPurple = onBridge && n.extra > 0.5;

  // Bridge marks: aligned along the path
  const bridgePull = nearBridge ? smoothstep(0.1, 0, minBridgeDist) : 0;

  return {
    x: baseX + n.dx * (1.5 - bridgePull * 1.2),
    y: baseY + n.dy * (1.5 - bridgePull * 1.2),
    size: MARK_BASE + bridgePull * 1.2 + (n.s - 0.5) * 0.4,
    opacity: clamp(0.25 + n.o * 0.2 + bridgePull * 0.35, 0.15, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Probe-Sense-Respond ---
// Left: purple probe enters. Centre: ripple. Right: reorganised new pattern.
function variantProbeSenseRespond(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Probe: purple mark at left edge
  const isProbe = nx < 0.06 && Math.abs(ny - 0.45) < 0.05;
  if (isProbe) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 1.5,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  // Sensing: ripple radiates from probe entry point
  const probeX = 0.05, probeY = 0.45;
  const d = dist(nx, ny, probeX, probeY);
  const ripple = smoothstep(0.1, 0.5, d) * smoothstep(0.65, 0.5, d);
  const rippleDx = ripple * Math.sin(d * 30) * 5;
  const rippleDy = ripple * Math.cos(d * 30) * 4;

  // Response: right third reorganises into new orderly pattern
  if (nx > 0.65) {
    const newPattern = Math.sin(ny * 12 + nx * 3) * 2;
    return {
      x: baseX + newPattern * 0.5 + n.dx * 0.3,
      y: baseY + Math.cos(ny * 8) * 1.5 + n.dy * 0.3,
      size: MARK_BASE + 0.5,
      opacity: 0.45 + n.o * 0.2,
      colour: DEEP,
    };
  }

  return {
    x: baseX + rippleDx + n.dx * 0.5,
    y: baseY + rippleDy + n.dy * 0.5,
    size: MARK_BASE + ripple * 1.2 + (n.s - 0.5) * 0.4,
    opacity: clamp(0.3 + n.o * 0.2 + ripple * 0.15, 0.15, 0.7),
    colour: DEEP,
  };
}

// --- Sense-Analyse-Respond ---
// Three vertical thirds: messy data, sorted analysis, precise action. Purple in analysis zone.
function variantSenseAnalyseRespond(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // Left: raw data (varied, messy)
  if (nx < 0.33) {
    return {
      x: baseX + n.dx * 5,
      y: baseY + n.dy * 4,
      size: MARK_BASE + n.s * 2.5 - 0.5,
      opacity: 0.25 + n.o * 0.3,
      colour: DEEP,
    };
  }

  // Middle: analysis (sorted by size, aligned)
  if (nx < 0.66) {
    const isPurple = n.extra > 0.75;
    // Sort effect: marks aligned by row, sized by position
    const sortedSize = MARK_BASE + (r / ROWS) * 2.5;
    return {
      x: baseX + n.dx * 0.3,
      y: baseY + n.dy * 0.3,
      size: sortedSize,
      opacity: clamp(0.4 + n.o * 0.2, 0.3, isPurple ? 0.9 : 0.7),
      colour: isPurple ? ACCENT : DEEP,
    };
  }

  // Right: precise calculated response
  return {
    x: baseX,
    y: baseY,
    size: MARK_BASE + 0.5,
    opacity: 0.55 + n.o * 0.15,
    colour: DEEP,
  };
}

// --- Minimum Viable Intervention ---
// One purple mark shifted. Small but clear ripple to immediate neighbours. Quiet grid emphasises contrast.
function variantMinimumViableIntervention(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  const targetCol = 11, targetRow = 6;
  const shift = 5;

  // The intervention mark — bold purple, clearly displaced
  if (c === targetCol && r === targetRow) {
    return {
      x: baseX + shift,
      y: baseY + shift * 0.4,
      size: MARK_BASE + 1.8,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  // Neighbours respond in a visible ripple (2-mark radius)
  const colDist = Math.abs(c - targetCol);
  const rowDist = Math.abs(r - targetRow);
  const manhattanDist = colDist + rowDist;
  const isAffected = colDist <= 2 && rowDist <= 2 && manhattanDist > 0 && manhattanDist <= 3;

  if (isAffected) {
    const fade = Math.pow(1 - manhattanDist / 4, 1.5);
    return {
      x: baseX + shift * fade * 0.5,
      y: baseY + shift * 0.4 * fade * 0.5,
      size: MARK_BASE + fade * 1,
      opacity: 0.4 + fade * 0.15 + n.o * 0.15,
      colour: DEEP,
    };
  }

  // Everything else: very still grid (minimal noise to maximise contrast)
  return {
    x: baseX + n.dx * 0.15,
    y: baseY + n.dy * 0.15,
    size: MARK_BASE,
    opacity: 0.4 + n.o * 0.1,
    colour: DEEP,
  };
}

// --- Holding Space ---
// Open empty region in centre-right. Marks gently displaced outward. Purple at edges of space.
function variantHoldingSpace(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const spaceX = 0.55, spaceY = 0.48;
  const spaceR = 0.18;
  const d = dist(nx, ny, spaceX, spaceY);

  // Inside the held space: empty
  if (d < spaceR) {
    return { x: baseX, y: baseY, size: 0, opacity: 0, colour: DEEP };
  }

  // Edge of space: purple facilitator marks, gently displaced outward
  const atEdge = d < spaceR + 0.08;
  const isPurple = atEdge && n.extra > 0.5;
  const pushOut = atEdge ? (1 - (d - spaceR) / 0.08) * 4 : 0;
  const angle = Math.atan2(ny - spaceY, nx - spaceX);

  // Gentle outward displacement that fades with distance
  const gentlePush = d < spaceR + 0.25 ? Math.max(0, 1 - (d - spaceR) / 0.25) * 2 : 0;

  return {
    x: baseX + Math.cos(angle) * (pushOut + gentlePush) + n.dx * 0.5,
    y: baseY + Math.sin(angle) * (pushOut + gentlePush) + n.dy * 0.5,
    size: MARK_BASE + (n.s - 0.5) * 0.4,
    opacity: clamp(0.3 + n.o * 0.25 + (atEdge ? 0.15 : 0), 0.2, isPurple ? 0.85 : 0.7),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Transition Management ---
// Bold morph: tight horizontal rows left → loose diagonal right. Purple milestone columns.
function variantTransitionManagement(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const blend = nx;

  // Horizontal pattern (tight rows, left side)
  const horizDy = Math.sin(ny * 12) * 5 * (1 - blend);
  // Diagonal pattern (right side)
  const diagDx = Math.sin((nx + ny) * 7) * 5 * blend;
  const diagDy = Math.cos((nx + ny) * 7) * 5 * blend;

  // Size transition: small left → larger right
  const sizeTransition = blend * 2;

  // Bold purple milestone columns
  const m1 = Math.abs(nx - 0.25) < 0.035;
  const m2 = Math.abs(nx - 0.5) < 0.035;
  const m3 = Math.abs(nx - 0.75) < 0.035;
  const isMilestone = m1 || m2 || m3;

  if (isMilestone) {
    return {
      x: baseX + diagDx * 0.3 + n.dx * 0.2,
      y: baseY + horizDy * 0.3 + diagDy * 0.3 + n.dy * 0.2,
      size: MARK_BASE + 1.2,
      opacity: 0.85,
      colour: ACCENT,
    };
  }

  return {
    x: baseX + diagDx + n.dx * 0.3,
    y: baseY + horizDy + diagDy + n.dy * 0.3,
    size: MARK_BASE + sizeTransition + (n.s - 0.5) * 0.3,
    opacity: clamp(0.3 + n.o * 0.2, 0.2, 0.65),
    colour: DEEP,
  };
}

// --- Portfolio of Experiments ---
// 6 bold disruption zones, each with different character. Large purple centres. Wider radius.
function variantPortfolioExperiments(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const experiments = [
    { x: 0.15, y: 0.3, type: 'expand' },
    { x: 0.45, y: 0.2, type: 'rotate' },
    { x: 0.75, y: 0.3, type: 'shift' },
    { x: 0.2, y: 0.7, type: 'shrink' },
    { x: 0.55, y: 0.7, type: 'expand' },
    { x: 0.85, y: 0.65, type: 'rotate' },
  ];

  for (const exp of experiments) {
    const d = dist(nx, ny, exp.x, exp.y);
    if (d > 0.16) continue;

    // Bold purple centres
    if (d < 0.04) {
      return {
        x: baseX,
        y: baseY,
        size: MARK_BASE + 2,
        opacity: 0.9,
        colour: ACCENT,
      };
    }

    const effect = Math.pow(1 - d / 0.16, 1.5);

    let dx = 0, dy = 0, sizeBoost = 0;
    if (exp.type === 'expand') {
      const angle = Math.atan2(ny - exp.y, nx - exp.x);
      dx = Math.cos(angle) * effect * 9;
      dy = Math.sin(angle) * effect * 9;
      sizeBoost = effect * 2;
    } else if (exp.type === 'rotate') {
      const angle = Math.atan2(ny - exp.y, nx - exp.x) + effect * 2;
      dx = Math.cos(angle) * d * 50 - (nx - exp.x) * 50;
      dy = Math.sin(angle) * d * 50 - (ny - exp.y) * 50;
    } else if (exp.type === 'shift') {
      dx = effect * 9;
      dy = effect * 3;
    } else if (exp.type === 'shrink') {
      const angle = Math.atan2(ny - exp.y, nx - exp.x);
      dx = -Math.cos(angle) * effect * 6;
      dy = -Math.sin(angle) * effect * 6;
      sizeBoost = -effect * 1.5;
    }

    return {
      x: baseX + dx + n.dx * 0.2,
      y: baseY + dy + n.dy * 0.2,
      size: Math.max(1, MARK_BASE + sizeBoost + (n.s - 0.5) * 0.3),
      opacity: clamp(0.3 + n.o * 0.2 + effect * 0.25, 0.15, 0.8),
      colour: DEEP,
    };
  }

  // Between zones: calm
  return {
    x: baseX + n.dx * 0.8,
    y: baseY + n.dy * 0.8,
    size: MARK_BASE + (n.s - 0.5) * 0.3,
    opacity: 0.3 + n.o * 0.18,
    colour: DEEP,
  };
}

// --- Carrying Capacity ---
// Bottom full, capacity line compressed, above the line marks fade. Purple at capacity line.
function variantCarryingCapacity(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const capacityLine = 0.4;
  const isPurple = Math.abs(ny - capacityLine) < 0.04;

  if (ny > capacityLine) {
    // Below capacity: full, packed
    const fullness = (ny - capacityLine) / (1 - capacityLine);
    return {
      x: baseX + n.dx * 0.3,
      y: baseY + n.dy * 0.3,
      size: MARK_BASE + 0.8 + fullness * 0.5,
      opacity: clamp(0.5 + fullness * 0.2 + n.o * 0.1, 0.4, 0.75),
      colour: DEEP,
    };
  }

  if (isPurple) {
    // Capacity line: compressed, purple
    return {
      x: baseX + n.dx * 0.2,
      y: baseY + n.dy * 0.2,
      size: MARK_BASE + 1,
      opacity: 0.85,
      colour: ACCENT,
    };
  }

  // Above capacity: shrinks and fades rapidly
  const overshoot = (capacityLine - ny) / capacityLine;
  return {
    x: baseX + n.dx * (1 + overshoot * 3),
    y: baseY + n.dy * (1 + overshoot * 2),
    size: Math.max(0.5, MARK_BASE * (1 - overshoot * 0.8)),
    opacity: Math.max(0.04, 0.35 - overshoot * 0.3 + n.o * 0.08),
    colour: DEEP,
  };
}

// --- Symbiosis ---
// Two interleaved patterns sharing the same grid. Purple where they overlap closest.
function variantSymbiosis(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // Pattern A: even columns, pattern B: odd columns (offset by half spacing)
  const isPatternA = c % 2 === 0;

  if (isPatternA) {
    // Pattern A: slightly larger marks
    return {
      x: baseX + n.dx * 0.5,
      y: baseY + 1.5 + n.dy * 0.5,
      size: MARK_BASE + 0.8,
      opacity: 0.5 + n.o * 0.2,
      colour: DEEP,
    };
  }

  // Pattern B: offset, slightly smaller, some purple where closest to A
  const nearA = r % 2 === 0;
  const isPurple = nearA && n.extra > 0.6;

  return {
    x: baseX + n.dx * 0.5,
    y: baseY - 1.5 + n.dy * 0.5,
    size: MARK_BASE + 0.3,
    opacity: clamp(0.4 + n.o * 0.2, 0.25, isPurple ? 0.85 : 0.65),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Keystone Species ---
// One mark missing. Dramatic distortion radiates from the gap. Purple adjacent to gap.
function variantKeystoneSpecies(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const gapX = 0.45, gapY = 0.45;
  const d = dist(nx, ny, gapX, gapY);

  // The gap: mark removed
  if (d < 0.035) {
    return { x: baseX, y: baseY, size: 0, opacity: 0, colour: DEEP };
  }

  // Purple mark adjacent to gap
  const isPurple = d > 0.035 && d < 0.08;

  // Dramatic pull toward the gap
  const angle = Math.atan2(gapY - ny, gapX - nx);
  const pull = d < 0.5 ? Math.pow(1 - d / 0.5, 2) * 12 : 0;

  return {
    x: baseX + Math.cos(angle) * pull + n.dx * 0.3,
    y: baseY + Math.sin(angle) * pull + n.dy * 0.3,
    size: MARK_BASE + (d < 0.2 ? (1 - d / 0.2) * 1 : 0) + (n.s - 0.5) * 0.3,
    opacity: clamp(0.3 + n.o * 0.25 + (d < 0.2 ? 0.15 : 0), 0.15, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Succession ---
// Left to right: bare → sparse → dense/complex → simplifying. Purple in early growth.
function variantSuccession(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Density curve: low → growing → peak → slight decline
  const density = Math.sin(nx * Math.PI * 0.95) ;
  const isPurple = nx > 0.15 && nx < 0.35 && n.extra > 0.7;

  // Very left: sparse, small
  if (nx < 0.15) {
    const show = n.extra > 0.6;
    return {
      x: baseX + n.dx * 3,
      y: baseY + n.dy * 3,
      size: show ? MARK_BASE * 0.7 : 0,
      opacity: show ? 0.25 + n.o * 0.15 : 0,
      colour: DEEP,
    };
  }

  // Complexity: size variation increases toward the middle-right
  const complexity = smoothstep(0.15, 0.6, nx) * smoothstep(0.95, 0.6, nx);
  const sizeVar = complexity * n.s * 3;
  const dispVar = complexity * 3;

  return {
    x: baseX + n.dx * dispVar + n.dx * 0.5,
    y: baseY + n.dy * dispVar + n.dy * 0.5,
    size: MARK_BASE + sizeVar * density + density * 1,
    opacity: clamp(0.2 + density * 0.4 + n.o * 0.15, 0.08, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Niche Construction ---
// Central purple cluster that has reorganised the surrounding grid. Fades with distance.
function variantNicheConstruction(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const nicheX = 0.4, nicheY = 0.45;
  const d = dist(nx, ny, nicheX, nicheY);

  // The organism/actor cluster
  if (d < 0.08) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 1.5,
      opacity: 0.9,
      colour: ACCENT,
    };
  }

  // Reorganised surroundings: marks pushed into radial alignment
  const influence = smoothstep(0.5, 0.08, d);
  const angle = Math.atan2(ny - nicheY, nx - nicheX);
  // Radial alignment: snap toward rings
  const ringPhase = Math.sin(d * 40) * influence * 5;

  return {
    x: baseX + Math.cos(angle) * ringPhase + n.dx * (1 - influence * 0.8),
    y: baseY + Math.sin(angle) * ringPhase + n.dy * (1 - influence * 0.8),
    size: MARK_BASE + influence * 1 + (n.s - 0.5) * 0.3,
    opacity: clamp(0.3 + n.o * 0.2 + influence * 0.2, 0.15, 0.75),
    colour: DEEP,
  };
}

// --- Diversity and Stability ---
// Every mark different but overall grid shape holds. Purple scattered throughout.
function variantDiversityStability(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const isPurple = n.extra > 0.82;

  // Every mark unique: varied size, position, opacity
  const sizeVar = MARK_BASE + (n.s - 0.3) * 2.5;
  const posVarX = n.dx * 2.5;
  const posVarY = n.dy * 2.5;

  return {
    x: baseX + posVarX,
    y: baseY + posVarY,
    size: clamp(sizeVar, 1.5, 6),
    opacity: clamp(0.25 + n.o * 0.45, 0.15, isPurple ? 0.9 : 0.75),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Mutualism ---
// Paired marks lean toward each other, both larger. Purple on one per pair.
function variantMutualism(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // Define pairs as adjacent marks in specific positions
  const pairs = [
    { c1: 4, r1: 3, c2: 5, r2: 3 },
    { c1: 10, r1: 2, c2: 10, r2: 3 },
    { c1: 18, r1: 5, c2: 19, r2: 5 },
    { c1: 7, r1: 8, c2: 8, r2: 8 },
    { c1: 14, r1: 10, c2: 15, r2: 10 },
    { c1: 22, r1: 7, c2: 22, r2: 8 },
  ];

  for (const p of pairs) {
    const isMark1 = c === p.c1 && r === p.r1;
    const isMark2 = c === p.c2 && r === p.r2;

    if (isMark1 || isMark2) {
      // Lean toward partner
      const dx = isMark1 ? 2.5 : -2.5;
      const dy = (p.r1 !== p.r2) ? (isMark1 ? 2 : -2) : 0;
      const isPurple = isMark1;

      return {
        x: baseX + dx,
        y: baseY + dy,
        size: MARK_BASE + 2,
        opacity: 0.8,
        colour: isPurple ? ACCENT : DEEP,
      };
    }
  }

  // Normal marks
  return {
    x: baseX + n.dx * 1,
    y: baseY + n.dy * 1,
    size: MARK_BASE + (n.s - 0.5) * 0.4,
    opacity: 0.35 + n.o * 0.2,
    colour: DEEP,
  };
}

// --- Parasitism ---
// Pairs where one mark grows at the expense of the other. Purple on the parasite.
function variantParasitism(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // Parasite-host pairs (parasite first, host second)
  const pairs = [
    { pc: 5, pr: 3, hc: 6, hr: 3 },
    { pc: 12, pr: 2, hc: 12, hr: 3 },
    { pc: 20, pr: 6, hc: 21, hr: 6 },
    { pc: 8, pr: 9, hc: 9, hr: 9 },
    { pc: 16, pr: 11, hc: 16, hr: 12 },
  ];

  for (const p of pairs) {
    const isParasite = c === p.pc && r === p.pr;
    const isHost = c === p.hc && r === p.hr;

    if (isParasite) {
      // Parasite: large, displaced toward host
      const dx = (p.hc - p.pc) * 2;
      const dy = (p.hr - p.pr) * 2;
      return {
        x: baseX + dx,
        y: baseY + dy,
        size: MARK_BASE + 3,
        opacity: 0.85,
        colour: ACCENT,
      };
    }

    if (isHost) {
      // Host: shrunken, displaced away from parasite
      const dx = (p.hc - p.pc) * 1.5;
      const dy = (p.hr - p.pr) * 1.5;
      return {
        x: baseX + dx,
        y: baseY + dy,
        size: Math.max(1, MARK_BASE - 1),
        opacity: 0.25,
        colour: DEEP,
      };
    }
  }

  // Normal marks
  return {
    x: baseX + n.dx * 1,
    y: baseY + n.dy * 1,
    size: MARK_BASE + (n.s - 0.5) * 0.4,
    opacity: 0.35 + n.o * 0.2,
    colour: DEEP,
  };
}

// --- Bounded Rationality ---
// Small well-lit rectangle perfectly ordered. Everything outside fades to invisible.
function variantBoundedRationality(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // The bounded rational window
  const winX = 0.3, winY = 0.35, winW = 0.3, winH = 0.35;
  const inWindow = nx > winX && nx < winX + winW && ny > winY && ny < winY + winH;

  // Purple at boundary
  const atBorder = !inWindow && (
    (Math.abs(nx - winX) < 0.03 || Math.abs(nx - (winX + winW)) < 0.03) && ny > winY - 0.03 && ny < winY + winH + 0.03 ||
    (Math.abs(ny - winY) < 0.03 || Math.abs(ny - (winY + winH)) < 0.03) && nx > winX - 0.03 && nx < winX + winW + 0.03
  );

  if (inWindow) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 0.4,
      opacity: 0.6 + n.o * 0.15,
      colour: DEEP,
    };
  }

  if (atBorder) {
    return {
      x: baseX + n.dx * 0.5,
      y: baseY + n.dy * 0.5,
      size: MARK_BASE + 0.6,
      opacity: 0.8,
      colour: ACCENT,
    };
  }

  // Outside: fades with distance from window
  const dToWinX = Math.max(0, winX - nx, nx - (winX + winW));
  const dToWinY = Math.max(0, winY - ny, ny - (winY + winH));
  const dToWin = Math.sqrt(dToWinX * dToWinX + dToWinY * dToWinY);
  const fade = smoothstep(0, 0.3, dToWin);

  return {
    x: baseX + n.dx * (1 + fade * 2),
    y: baseY + n.dy * (1 + fade * 2),
    size: MARK_BASE + (n.s - 0.5) * 0.3,
    opacity: Math.max(0.04, 0.3 - fade * 0.28 + n.o * 0.05),
    colour: DEEP,
  };
}

// --- Satisficing ---
// Marks improve left to right but plateau at "good enough". Purple where improvement stops.
function variantSatisficing(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Improvement curve: rapid at first, then plateaus at ~70%
  const improvement = nx < 0.65 ? nx / 0.65 : 1;
  const error = Math.pow(1 - improvement * 0.7, 2);

  // Displacement decreases with improvement but never reaches zero
  const dx = n.dx * error * 10;
  const dy = n.dy * error * 8;

  // Purple where improvement plateaus
  const isPurple = nx > 0.6 && nx < 0.72 && n.extra > 0.7;

  return {
    x: baseX + dx,
    y: baseY + dy,
    size: MARK_BASE + error * 1.5 + (n.s - 0.5) * error * 0.8,
    opacity: clamp(0.35 + n.o * 0.2 + improvement * 0.1, 0.2, isPurple ? 0.9 : 0.7),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Cognitive Load ---
// Extra marks make everything denser. Left readable, right congested mess. Purple in worst zone.
function variantCognitiveLoad(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Density increases left to right
  const density = nx * nx;

  // Overcrowding: marks displaced by competition for space
  const crowdDx = density * n.dx * 6;
  const crowdDy = density * n.dy * 5;

  // Extra "phantom" marks simulated by size variation and overlap
  const sizeBoost = density * n.s * 3;

  const isPurple = nx > 0.7 && n.extra > 0.75;

  return {
    x: baseX + crowdDx + n.dx * 0.5,
    y: baseY + crowdDy + n.dy * 0.5,
    size: MARK_BASE + sizeBoost,
    opacity: clamp(0.3 + n.o * 0.2 + density * 0.2, 0.15, isPurple ? 0.9 : 0.8),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Sensemaking Under Pressure ---
// Top compresses down. Some clusters find order despite pressure. Purple at ordered clusters.
function variantSensemakingPressure(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  // Pressure from above: top rows compressed downward
  const pressure = Math.pow(Math.max(0, 1 - ny / 0.6), 2) * 10;

  // Local clusters managing to organise: small pockets of alignment
  const cluster1 = dist(nx, ny, 0.3, 0.5) < 0.12;
  const cluster2 = dist(nx, ny, 0.6, 0.55) < 0.1;
  const cluster3 = dist(nx, ny, 0.8, 0.45) < 0.09;
  const inCluster = cluster1 || cluster2 || cluster3;

  const isPurple = inCluster && n.extra > 0.6;

  if (inCluster) {
    // Ordered despite pressure
    return {
      x: baseX + n.dx * 0.3,
      y: baseY + pressure * 0.3 + n.dy * 0.3,
      size: MARK_BASE + 0.5,
      opacity: clamp(0.45 + n.o * 0.2, 0.35, isPurple ? 0.9 : 0.7),
      colour: isPurple ? ACCENT : DEEP,
    };
  }

  // Crushed: displaced by pressure, chaotic
  return {
    x: baseX + n.dx * (2 + pressure * 0.3),
    y: baseY + pressure + n.dy * (1 + pressure * 0.2),
    size: MARK_BASE + (n.s - 0.5) * 0.5,
    opacity: clamp(0.25 + n.o * 0.2 - pressure * 0.02, 0.08, 0.6),
    colour: DEEP,
  };
}

// --- Motivated Reasoning ---
// All marks subtly displaced toward a predetermined purple target on the right.
function variantMotivatedReasoning(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const targetX = 0.78, targetY = 0.4;
  const d = dist(nx, ny, targetX, targetY);

  // The predetermined conclusion
  if (d < 0.04) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 2.5,
      opacity: 0.92,
      colour: ACCENT,
    };
  }

  const angle = Math.atan2(targetY - ny, targetX - nx);

  // Confirmation bias: marks already pointing toward target move more
  const alignment = Math.max(0, Math.cos(angle - Math.atan2(targetY - 0.5, targetX - 0.5)));
  const basePull = (1 - d / 0.9) * 4;
  const biasPull = alignment * basePull * 1.5;

  return {
    x: baseX + Math.cos(angle) * (basePull + biasPull) + n.dx * 0.3,
    y: baseY + Math.sin(angle) * (basePull + biasPull) + n.dy * 0.3,
    size: MARK_BASE + (n.s - 0.5) * 0.4,
    opacity: clamp(0.3 + n.o * 0.25, 0.15, 0.7),
    colour: DEEP,
  };
}

// --- Action Bias ---
// Right side was fine. Left side pushes rightward, disrupting. Purple on left (the unnecessary action).
function variantActionBias(ctx) {
  const { baseX, baseY, nx, ny, n } = ctx;

  const isPurple = nx < 0.1;

  // Unnecessary push from the left
  const push = Math.pow(Math.max(0, 1 - nx / 0.6), 2) * 10;

  // The push disrupts the previously fine right side
  const disruption = nx > 0.5 ? push * 0.3 * Math.sin(ny * 8 + n.extra * 5) : 0;

  return {
    x: baseX + push + disruption + n.dx * 0.3,
    y: baseY + disruption * 0.5 + n.dy * 0.3,
    size: MARK_BASE + (isPurple ? 1.5 : 0) + (n.s - 0.5) * 0.3,
    opacity: clamp(isPurple ? 0.85 : 0.35 + n.o * 0.25, 0.2, 0.85),
    colour: isPurple ? ACCENT : DEEP,
  };
}

// --- Narrative Fallacy ---
// Random marks with a "selected" line of purple marks imposing a story. Others faded.
function variantNarrativeFallacy(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // The narrative line: 7 marks forming a rough upward path
  const narrativePoints = [
    { c: 2, r: 10 }, { c: 6, r: 8 }, { c: 9, r: 9 },
    { c: 13, r: 6 }, { c: 16, r: 7 }, { c: 20, r: 4 }, { c: 24, r: 3 },
  ];

  const isNarrative = narrativePoints.some(p => c === p.c && r === p.r);

  if (isNarrative) {
    return {
      x: baseX + n.dx * 1.5,
      y: baseY + n.dy * 1.5,
      size: MARK_BASE + 1.8,
      opacity: 0.85,
      colour: ACCENT,
    };
  }

  // All other marks: random displacement, faded (the noise the narrative ignores)
  return {
    x: baseX + n.dx * 4,
    y: baseY + n.dy * 4,
    size: MARK_BASE + (n.s - 0.5) * 1.5,
    opacity: 0.12 + n.o * 0.12,
    colour: DEEP,
  };
}

// --- Hindsight Bias ---
// Winding purple path looks obvious in retrospect. Ghost paths show alternatives.
function variantHindsightBias(ctx) {
  const { baseX, baseY, nx, ny, n, c, r } = ctx;

  // The taken path (winding left to right)
  const pathPoints = [
    { c: 1, r: 7 }, { c: 4, r: 6 }, { c: 7, r: 8 },
    { c: 10, r: 5 }, { c: 13, r: 6 }, { c: 16, r: 4 },
    { c: 19, r: 5 }, { c: 22, r: 3 }, { c: 25, r: 4 },
  ];

  // Alternative paths (ghostly)
  const altPoints = [
    { c: 4, r: 8 }, { c: 7, r: 5 }, { c: 10, r: 8 },
    { c: 13, r: 3 }, { c: 16, r: 7 }, { c: 19, r: 2 },
    { c: 22, r: 6 },
  ];

  const isPath = pathPoints.some(p => c === p.c && r === p.r);
  const isAlt = altPoints.some(p => c === p.c && r === p.r);

  if (isPath) {
    return {
      x: baseX,
      y: baseY,
      size: MARK_BASE + 2,
      opacity: 0.88,
      colour: ACCENT,
    };
  }

  if (isAlt) {
    return {
      x: baseX + n.dx * 1,
      y: baseY + n.dy * 1,
      size: MARK_BASE + 1,
      opacity: 0.18,
      colour: ACCENT,
    };
  }

  // Normal grid
  return {
    x: baseX + n.dx * 1,
    y: baseY + n.dy * 1,
    size: MARK_BASE + (n.s - 0.5) * 0.4,
    opacity: 0.3 + n.o * 0.2,
    colour: DEEP,
  };
}

// --- The component ---

export default function DotGrid({
  seed = 42,
  variant = 'default',
  width = 380,
  height = 285,
  className = '',
}) {
  const marks = useMemo(
    () => generateMarks(seed, variant, width, height),
    [seed, variant, width, height]
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      role="img"
      aria-label={`Dot-grid illustration: ${variant}`}
    >
      {marks.map((m, i) => {
        const rects = [];
        // Render echo trails behind the mark (for dynamic thinking etc.)
        if (m.echoes && m.echoDx !== undefined) {
          for (let e = m.echoes; e >= 1; e--) {
            const fade = e / (m.echoes + 1);
            rects.push(
              <rect
                key={`${i}-e${e}`}
                x={m.x + m.echoDx * e - (m.size * (1 - fade * 0.3)) / 2}
                y={m.y + m.echoDy * e - (m.size * (1 - fade * 0.3)) / 2}
                width={m.size * (1 - fade * 0.3)}
                height={m.size * (1 - fade * 0.3)}
                fill={m.colour}
                opacity={clamp(m.opacity * (1 - fade * 0.7), 0.04, 0.5)}
              />
            );
          }
        }
        rects.push(
          <rect
            key={i}
            x={m.x - m.size / 2}
            y={m.y - m.size / 2}
            width={m.size}
            height={m.size}
            fill={m.colour}
            opacity={clamp(m.opacity, 0.04, 0.95)}
          />
        );
        return rects;
      })}
    </svg>
  );
}