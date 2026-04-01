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
      {marks.map((m, i) => (
        <rect
          key={i}
          x={m.x - m.size / 2}
          y={m.y - m.size / 2}
          width={m.size}
          height={m.size}
          fill={m.colour}
          opacity={clamp(m.opacity, 0.04, 0.95)}
        />
      ))}
    </svg>
  );
}