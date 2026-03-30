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