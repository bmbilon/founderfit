<!-- PASTE THIS WHOLE BLOCK INTO MANUS (or replace your existing <script> where questions/scoring live).
     It includes:
     - 30-question instrument (22 core + 8 validity)
     - option-order shuffling (kills “2nd option always better” + far-right bias)
     - reverse-scoring + nonlinear scoring
     - trait scoring + validity scoring + success index using context priors (age + domain exp + optional stage/industry/etc)
-->

<script>
/* =========================
   0) UTILITIES
========================= */

// Stable-ish per-session seed so option order is consistent for a respondent.
const SESSION_SEED = (() => {
  const key = "ff_seed_v1";
  const existing = sessionStorage.getItem(key);
  if (existing) return parseInt(existing, 10);
  const seed = Math.floor(Math.random() * 1e9);
  sessionStorage.setItem(key, String(seed));
  return seed;
})();

function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeLikert01To100(v01) { // v01 in [0,1]
  return clamp(Math.round(v01 * 100), 0, 100);
}

function likertTo01(value1to5) {
  // 1..5 -> 0..1
  return (clamp(value1to5, 1, 5) - 1) / 4;
}

function reverseLikert(value1to5) {
  return 6 - clamp(value1to5, 1, 5);
}

/* =========================
   1) CONFIG: DIMENSIONS, WEIGHTS, PRIORS
========================= */

const DIMENSIONS = [
  "Openness",
  "Conscientiousness",
  "Energy & Drive",
  "Conviction",
  "Emotional Stability",
  "Skepticism & Adaptability",
];

const DIMENSION_WEIGHTS_BASE = {
  "Openness": 1.00,
  "Conscientiousness": 1.10,
  "Energy & Drive": 1.20,
  "Conviction": 1.10,
  "Emotional Stability": 1.30,
  "Skepticism & Adaptability": 1.00
};

// Stage multipliers (dimension emphasis)
const STAGE_WEIGHTS = {
  "pre-launch": {
    "Openness": 1.15, "Conscientiousness": 0.95, "Energy & Drive": 1.10,
    "Conviction": 1.10, "Emotional Stability": 1.00, "Skepticism & Adaptability": 1.00
  },
  "mvp": {
    "Openness": 1.10, "Conscientiousness": 1.00, "Energy & Drive": 1.10,
    "Conviction": 1.05, "Emotional Stability": 1.05, "Skepticism & Adaptability": 1.00
  },
  "pmf-search": {
    "Openness": 1.05, "Conscientiousness": 1.10, "Energy & Drive": 1.05,
    "Conviction": 1.05, "Emotional Stability": 1.10, "Skepticism & Adaptability": 1.05
  },
  "scaling": {
    "Openness": 0.95, "Conscientiousness": 1.20, "Energy & Drive": 1.05,
    "Conviction": 1.05, "Emotional Stability": 1.15, "Skepticism & Adaptability": 1.00
  },
  "mature": {
    "Openness": 0.95, "Conscientiousness": 1.15, "Energy & Drive": 1.00,
    "Conviction": 1.00, "Emotional Stability": 1.10, "Skepticism & Adaptability": 1.00
  },
};

// Industry multipliers (dimension emphasis)
const INDUSTRY_WEIGHTS = {
  "saas": {
    "Openness": 1.05, "Conscientiousness": 1.10, "Energy & Drive": 1.00,
    "Conviction": 1.00, "Emotional Stability": 1.00, "Skepticism & Adaptability": 1.00
  },
  "consumer-ecom": {
    "Openness": 1.05, "Conscientiousness": 1.00, "Energy & Drive": 1.15,
    "Conviction": 1.00, "Emotional Stability": 1.00, "Skepticism & Adaptability": 1.00
  },
  "services": {
    "Openness": 1.00, "Conscientiousness": 1.10, "Energy & Drive": 1.00,
    "Conviction": 1.00, "Emotional Stability": 1.10, "Skepticism & Adaptability": 1.00
  },
  "hardware-regulated": {
    "Openness": 0.95, "Conscientiousness": 1.20, "Energy & Drive": 1.00,
    "Conviction": 1.00, "Emotional Stability": 1.05, "Skepticism & Adaptability": 1.10
  },
};

// Conservative priors (v1 defaults; calibrate later with outcomes)
const AGE_PRIOR = {
  "under-25": 0.85,
  "25-34": 0.95,
  "35-44": 1.00,
  "45-54": 1.07,
  "55-64": 1.05,
  "65+": 1.02
};

const DOMAIN_EXP_PRIOR = {
  "lt-1": 0.85,
  "1-3": 0.95,
  "3-7": 1.05,
  "7+": 1.10
};

const FOUNDER_EXP_PRIOR = {
  "first-time": 1.00,
  "1": 1.03,
  "2-3": 1.06,
  "4+": 1.08
};

const CAPITAL_PRIOR = {
  "bootstrapped": 1.02,
  "angel-seed": 1.00,
  "vc": 0.98
};

/* =========================
   2) INSTRUMENT (22 CORE + 8 VALIDITY = 30)
   - Options are shuffled at render-time.
   - Each item carries scoring metadata.
========================= */

const QUESTION_BANK = [
  // ---------- CORE: OPENNESS (5)
  {
    id: "A1", dimension: "Openness", type: "binary",
    text: "You uncover a promising new market while executing against an existing roadmap. What do you do first?",
    options: [
      { key: "A", text: "Pressure-test whether it fits the current strategy before allocating time", traitDir: 0 },
      { key: "B", text: "Allocate time immediately to explore it hands-on", traitDir: 1 }
    ]
  },
  {
    id: "A2", dimension: "Openness", type: "binary",
    text: "Which statement describes you more accurately?",
    options: [
      { key: "A", text: "I prefer shipping small, controlled improvements once evidence is clear", traitDir: 0 },
      { key: "B", text: "I’m comfortable building rough experiments before evidence exists", traitDir: 1 }
    ]
  },
  {
    id: "A3", dimension: "Openness", type: "binary",
    text: "When encountering established industry norms, you are more likely to:",
    options: [
      { key: "A", text: "Assume they exist for good reasons unless proven otherwise", traitDir: 0 },
      { key: "B", text: "Assume they’re outdated until proven useful", traitDir: 1 }
    ]
  },
  {
    id: "A4", dimension: "Openness", type: "binary",
    text: "When learning a new tool or technology:",
    options: [
      { key: "A", text: "I want conceptual understanding before touching implementation", traitDir: 0 },
      { key: "B", text: "I learn fastest by using it immediately and refining later", traitDir: 1 }
    ]
  },
  {
    id: "A5", dimension: "Openness", type: "likert", reverse: true,
    text: "I am uncomfortable making decisions without most variables defined.",
    likertLabels: ["Strongly agree","Agree","Neutral","Disagree","Strongly disagree"]
  },

  // ---------- CORE: CONSCIENTIOUSNESS (3)
  {
    id: "BCONS1", dimension: "Conscientiousness", type: "binary",
    text: "In complex projects, I’m more effective when I:",
    options: [
      { key: "A", text: "Maintain oversight of dependencies and milestones myself", traitDir: 1 },
      { key: "B", text: "Define outcomes clearly and trust others to manage details", traitDir: 0 }
    ]
  },
  {
    id: "BCONS2", dimension: "Conscientiousness", type: "binary",
    text: "As the organization grows, which instinct shows up more often?",
    options: [
      { key: "A", text: "“If this is critical, I should stay close to it.”", traitDir: 1 },
      { key: "B", text: "“If this is critical, someone else should own it fully.”", traitDir: 0 }
    ]
  },
  {
    id: "BCONS3", dimension: "Conscientiousness", type: "likert",
    text: "Once I commit to a project, I tend to see it through even when alternatives appear.",
    likertLabels: ["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"]
  },

  // ---------- CORE: ENERGY & DRIVE (4)
  {
    id: "C1", dimension: "Energy & Drive", type: "binary",
    text: "After a major setback, I usually:",
    options: [
      { key: "A", text: "Pause to re-assess before changing direction", traitDir: 0 },
      { key: "B", text: "Regain momentum quickly by trying the next approach", traitDir: 1 }
    ]
  },
  {
    id: "C2", dimension: "Energy & Drive", type: "binary",
    text: "When setting goals, I’m more motivated by:",
    options: [
      { key: "A", text: "Targets I’m confident we can hit", traitDir: 0 },
      { key: "B", text: "Targets that feel slightly unreasonable", traitDir: 1 }
    ]
  },
  {
    id: "C3", dimension: "Energy & Drive", type: "binary",
    text: "Teams respond best to me when I:",
    options: [
      { key: "A", text: "Engage deeply one-on-one", traitDir: 0 },
      { key: "B", text: "Create momentum through shared vision", traitDir: 1 }
    ]
  },
  {
    id: "C4", dimension: "Energy & Drive", type: "likert", hasRiskCap: true,
    text: "I struggle to disengage from long-term goals, even when it affects balance.",
    likertLabels: ["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"]
  },

  // ---------- CORE: CONVICTION (3)
  {
    id: "DCONV1", dimension: "Conviction", type: "binary",
    text: "When stakeholders push back on my direction:",
    options: [
      { key: "A", text: "I assume they may see risks I’ve missed", traitDir: 0 },
      { key: "B", text: "I assume my reasoning may be clearer than theirs", traitDir: 1 }
    ]
  },
  {
    id: "DCONV2", dimension: "Conviction", type: "binary",
    text: "When my strategy is questioned repeatedly:",
    options: [
      { key: "A", text: "I revisit assumptions and adjust if needed", traitDir: 0 },
      { key: "B", text: "I reinforce the rationale and stay the course", traitDir: 1 }
    ]
  },
  {
    id: "DCONV3", dimension: "Conviction", type: "likert", reverse: true,
    text: "My strategy is mostly shaped by external signals rather than internal conviction.",
    likertLabels: ["Strongly agree","Agree","Neutral","Disagree","Strongly disagree"]
  },

  // ---------- CORE: EMOTIONAL STABILITY (3)
  {
    id: "E1", dimension: "Emotional Stability", type: "binary",
    text: "When multiple urgent problems arise:",
    options: [
      { key: "A", text: "I slow down to avoid compounding mistakes", traitDir: 0 },
      { key: "B", text: "I narrow focus aggressively and act", traitDir: 1 }
    ]
  },
  {
    id: "E2", dimension: "Emotional Stability", type: "binary",
    text: "When uncertain about a decision:",
    options: [
      { key: "A", text: "I seek reassurance before committing", traitDir: 0 },
      { key: "B", text: "I commit and course-correct later if needed", traitDir: 1 }
    ]
  },
  {
    id: "E3", dimension: "Emotional Stability", type: "likert",
    text: "Under sustained pressure, others describe me as composed.",
    likertLabels: ["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"]
  },

  // ---------- CORE: SKEPTICISM & ADAPTABILITY (4)
  {
    id: "F1", dimension: "Skepticism & Adaptability", type: "binary",
    text: "When experienced advisors suggest a different approach:",
    options: [
      { key: "A", text: "I weigh their track record heavily", traitDir: 0 },
      { key: "B", text: "I test the idea myself before committing", traitDir: 1 }
    ]
  },
  {
    id: "F2", dimension: "Skepticism & Adaptability", type: "binary",
    text: "When my view conflicts with group consensus:",
    options: [
      { key: "A", text: "I reconsider my position", traitDir: 0 },
      { key: "B", text: "I articulate my reasoning clearly", traitDir: 1 }
    ]
  },
  {
    id: "F3", dimension: "Skepticism & Adaptability", type: "likert", nonlinearMap: true,
    text: "Established best practices are usually:",
    // Values 1..5 stored, but we map to non-linear points later
    likertLabels: [
      "Rules to follow closely",
      "Useful guidelines",
      "Context-dependent",
      "Starting points",
      "Constraints to overcome"
    ]
  },
  {
    id: "F4", dimension: "Skepticism & Adaptability", type: "binary", contextDependent: true,
    text: "When data contradicts my strategy:",
    options: [
      { key: "A", text: "I analyze deeply before changing", traitDir: 0 }, // rigor-first
      { key: "B", text: "I adjust direction quickly", traitDir: 1 }      // speed-first
    ]
  },

  // ---------- VALIDITY (8)
  // V1 Attention: requires Agree (value=4 in standard 1..5)
  {
    id: "V1", dimension: "Validity", type: "likert", validityOnly: true,
    text: "To confirm you’re paying attention, please select “Agree” for this item.",
    likertLabels: ["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"],
    attention: { requiredValue: 4 }
  },
  // V2 Too-perfect (envy never)
  {
    id: "V2", dimension: "Validity", type: "likert", validityOnly: true,
    text: "I have never felt envy toward another founder’s wins.",
    likertLabels: ["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"],
    tooPerfect: { triggerValue: 5 }
  },
  // V3 Consistency with A5 (reverse)
  {
    id: "V3", dimension: "Validity", type: "likert", validityOnly: true,
    text: "I can make important decisions even when most variables are still unknown.",
    likertLabels: ["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"],
    consistency: { pairWith: "A5", direction: "inverse" } // A5 is discomfort, reverse-scored
  },
  // V4 Consistency with BCONS3
  {
    id: "V4", dimension: "Validity", type: "likert", validityOnly: true,
    text: "Once I commit to a plan, I rarely abandon it midstream.",
    likertLabels: ["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"],
    consistency: { pairWith: "BCONS3", direction: "same" }
  },
  // V5 Too-perfect (never avoidable mistake)
  {
    id: "V5", dimension: "Validity", type: "likert", validityOnly: true,
    text: "I have never made an avoidable mistake in a high-stakes situation.",
    likertLabels: ["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"],
    tooPerfect: { triggerValue: 4 } // Agree or Strongly agree are suspicious
  },
  // V6 Integrity (self report)
  {
    id: "V6", dimension: "Validity", type: "likert", validityOnly: true,
    text: "I answered these questions carefully and honestly.",
    likertLabels: ["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"],
    integrity: { minValue: 3 } // below neutral is a big issue
  },
  // V7 Second attention / infrequency: requires Disagree (value=2)
  {
    id: "V7", dimension: "Validity", type: "likert", validityOnly: true,
    text: "For quality control, please select “Disagree” for this item.",
    likertLabels: ["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"],
    attention: { requiredValue: 2 }
  },
  // V8 Infrequency (random clicking indicator)
  {
    id: "V8", dimension: "Validity", type: "likert", validityOnly: true,
    text: "I selected answers without reading the questions carefully.",
    likertLabels: ["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"],
    infrequency: { triggerValue: 4 } // Agree/Strongly agree = big penalty
  },
];

// Build an in-memory questions list with per-session option shuffling
function buildQuestionsForSession() {
  const rng = mulberry32(SESSION_SEED);

  return QUESTION_BANK.map((q) => {
    const copy = JSON.parse(JSON.stringify(q));

    // Shuffle binary option order (and preserve scoring via option.key / traitDir)
    if (copy.type === "binary" && Array.isArray(copy.options)) {
      shuffleInPlace(copy.options, rng);
    }

    // For likert: we do NOT shuffle the scale values (1..5), but we DO shuffle label positions sometimes by wording.
    // Here: keep labels stable for usability. (You already fixed directional bias via reverse + nonlinear maps.)

    return copy;
  });
}

/* =========================
   3) RENDER + RESPONSE STORAGE (HOOK INTO YOUR EXISTING UI)
   This expects you already have:
     - currentQuestion, responses, initSurvey(), showQuestion(), nextQuestion() etc.
   If you don't, you can still use the scoring functions below.
========================= */

const questions = buildQuestionsForSession();

// Expected response structure:
// responses[q.id] = { dimension, type, value, meta?: {...} }
// For binary: value is option.key ("A"/"B") OR store traitDir directly.
// For likert: value is integer 1..5.

// Helper: compute a 0–100 trait signal from a response
function itemScore01(q, resp, context) {
  // returns { score100, riskFlags:[], notes:[] } for CORE items only
  const riskFlags = [];
  const notes = [];

  if (!resp) return { score100: null, riskFlags, notes };

  // Skip validity-only items here
  if (q.validityOnly) return { score100: null, riskFlags, notes };

  if (q.type === "binary") {
    // Find chosen option by key (if resp.value is key) or by traitDir (if you stored that)
    let chosen = null;

    if (typeof resp.value === "string") {
      chosen = q.options.find(o => o.key === resp.value);
    } else if (typeof resp.value === "number") {
      // if you stored traitDir directly:
      chosen = q.options.find(o => o.traitDir === resp.value) || { traitDir: resp.value };
    }

    if (!chosen) return { score100: null, riskFlags, notes };

    // Context-dependent binary (F4): treat as trait signal now, fit later in success index.
    // traitDir 0/1 -> 0/100
    const score100 = chosen.traitDir ? 100 : 0;
    return { score100, riskFlags, notes };
  }

  if (q.type === "likert") {
    let v = clamp(parseInt(resp.value, 10), 1, 5);
    if (q.reverse) v = reverseLikert(v);

    // Nonlinear mapping (F3): break far-right-is-best pattern
    if (q.nonlinearMap) {
      // Map 1..5 to points: 20, 50, 80, 100, 70
      const map = { 1: 20, 2: 50, 3: 80, 4: 100, 5: 70 };
      return { score100: map[v] ?? 50, riskFlags, notes };
    }

    // C4 burnout risk flag if extreme
    if (q.hasRiskCap && q.id === "C4" && clamp(parseInt(resp.value, 10), 1, 5) === 5) {
      riskFlags.push("burnout_risk_high_drive_extreme");
    }

    const score100 = normalizeLikert01To100(likertTo01(v));
    return { score100, riskFlags, notes };
  }

  return { score100: null, riskFlags, notes };
}

/* =========================
   4) VALIDITY SCORING (0–100) + FLAGS
========================= */

function scoreValidity(responsesMap, msTotal = null) {
  let validity = 100;
  const flags = [];
  let tooPerfectPoints = 0;

  // Attention checks
  for (const q of questions) {
    if (!q.validityOnly) continue;
    const r = responsesMap[q.id];
    if (!r) continue;

    if (q.attention && q.attention.requiredValue) {
      if (parseInt(r.value, 10) !== q.attention.requiredValue) {
        flags.push(`attention_fail_${q.id}`);
        // hard-ish fail
        validity -= 40;
      }
    }
  }

  // Integrity + infrequency
  {
    const v6 = responsesMap["V6"];
    if (v6 && parseInt(v6.value, 10) < 3) {
      flags.push("integrity_low");
      validity -= 40;
    }
    const v8 = responsesMap["V8"];
    if (v8 && parseInt(v8.value, 10) >= 4) {
      flags.push("random_clicking_admitted");
      validity -= 35;
    }
  }

  // Too-perfect
  {
    const v2 = responsesMap["V2"];
    if (v2 && parseInt(v2.value, 10) === 5) tooPerfectPoints += 1;

    const v5 = responsesMap["V5"];
    if (v5 && parseInt(v5.value, 10) >= 4) tooPerfectPoints += 1;

    if (tooPerfectPoints >= 1) flags.push("too_perfect_signal");
    validity -= Math.min(30, tooPerfectPoints * 12);
  }

  // Consistency checks (convert paired items to 0..100 and compare)
  function likertAsScore100(qid) {
    const q = questions.find(x => x.id === qid);
    const r = responsesMap[qid];
    if (!q || !r) return null;

    let v = clamp(parseInt(r.value, 10), 1, 5);
    if (q.reverse) v = reverseLikert(v);
    if (q.nonlinearMap) {
      const map = { 1: 20, 2: 50, 3: 80, 4: 100, 5: 70 };
      return map[v] ?? 50;
    }
    return normalizeLikert01To100(likertTo01(v));
  }

  // V3 vs A5 (inverse)
  {
    const v3 = likertAsScore100("V3");
    const a5 = likertAsScore100("A5"); // A5 is reverse-scored in scoring, so higher means more comfortable
    if (v3 != null && a5 != null) {
      const diff = Math.abs(v3 - a5);
      if (diff > 50) {
        flags.push("inconsistency_openness");
        validity -= 15;
      }
    }
  }

  // V4 vs BCONS3 (same)
  {
    const v4 = likertAsScore100("V4");
    const b3 = likertAsScore100("BCONS3");
    if (v4 != null && b3 != null) {
      const diff = Math.abs(v4 - b3);
      if (diff > 50) {
        flags.push("inconsistency_conscientiousness");
        validity -= 15;
      }
    }
  }

  // Optional: response-time anomaly (if you pass msTotal)
  if (typeof msTotal === "number") {
    // Very rough: under ~2.5 minutes for 30 items is suspicious for careful reading
    if (msTotal < 150000) {
      flags.push("speed_suspicious_fast");
      validity -= 10;
    }
  }

  validity = clamp(Math.round(validity), 0, 100);
  const confidenceBand = validity >= 80 ? "High" : validity >= 60 ? "Moderate" : "Low";
  return { validity, confidenceBand, flags };
}

/* =========================
   5) TRAIT SCORING (DIMENSIONS + OVERALL) + RISK FLAGS
========================= */

function scoreTraits(responsesMap) {
  const dimBuckets = {};
  const riskFlags = [];

  for (const d of DIMENSIONS) dimBuckets[d] = [];

  for (const q of questions) {
    if (q.validityOnly) continue;
    const r = responsesMap[q.id];
    const { score100, riskFlags: itemFlags } = itemScore01(q, r, null);
    if (score100 == null) continue;

    if (q.id === "C4" && itemFlags.includes("burnout_risk_high_drive_extreme")) {
      riskFlags.push("burnout_risk_high_drive_extreme");
    }

    // Push into dimension bucket
    if (DIMENSIONS.includes(q.dimension)) {
      dimBuckets[q.dimension].push(score100);
    }
  }

  const dimScores = {};
  for (const d of DIMENSIONS) {
    const vals = dimBuckets[d];
    const avg = vals.length ? (vals.reduce((a,b)=>a+b,0) / vals.length) : 0;
    dimScores[d] = Math.round(avg);
  }

  // Overall Trait Score (dimension-weighted base)
  const num = DIMENSIONS.reduce((s, d) => s + dimScores[d] * (DIMENSION_WEIGHTS_BASE[d] || 1), 0);
  const den = DIMENSIONS.reduce((s, d) => s + (DIMENSION_WEIGHTS_BASE[d] || 1), 0);
  const overall = den ? Math.round(num / den) : 0;

  // Optional: flag “too many extreme highs” (used as soft validity input elsewhere if you want)
  const extremeHighDims = Object.values(dimScores).filter(v => v >= 90).length;
  if (extremeHighDims >= 4) riskFlags.push("profile_extreme_many_dims");

  return { overallTraitScore: overall, dimScores, riskFlags };
}

/* =========================
   6) SUCCESS LIKELIHOOD INDEX (CONTEXT PRIORS + FIT WEIGHTS)
   Compute ONLY if validity >= 60 (recommended).
========================= */

function scoreSuccessIndex(traits, validityObj, context) {
  // context expected shape:
  // {
  //   ageBucket: "under-25"|"25-34"|"35-44"|"45-54"|"55-64"|"65+",
  //   domainExp: "lt-1"|"1-3"|"3-7"|"7+",
  //   stage: "pre-launch"|"mvp"|"pmf-search"|"scaling"|"mature" (optional),
  //   industry: "saas"|"consumer-ecom"|"services"|"hardware-regulated" (optional),
  //   founderExp: "first-time"|"1"|"2-3"|"4+" (optional),
  //   capital: "bootstrapped"|"angel-seed"|"vc" (optional)
  // }

  const { dimScores } = traits;
  const validity = validityObj?.validity ?? 100;
  if (validity < 60) {
    return { successIndex: null, note: "Validity below threshold; success index suppressed." };
  }

  const stageW = STAGE_WEIGHTS[context.stage || "mvp"] || STAGE_WEIGHTS["mvp"];
  const industryW = INDUSTRY_WEIGHTS[context.industry || "saas"] || INDUSTRY_WEIGHTS["saas"];

  // FitScore: dimension-weighted average (base weights * stage * industry)
  let num = 0, den = 0;
  for (const d of DIMENSIONS) {
    const w = (DIMENSION_WEIGHTS_BASE[d] || 1) * (stageW[d] || 1) * (industryW[d] || 1);
    num += (dimScores[d] || 0) * w;
    den += w;
  }
  let fitScore = den ? (num / den) : 0;

  // Special handling for context-dependent F4:
  // If scaling/hardware-regulated, favor rigor-first (traitDir 0); if pre-launch/consumer, favor speed-first (traitDir 1)
  const f4 = responses["F4"];
  if (f4 && typeof f4.value === "string") {
    const chose = (questions.find(q=>q.id==="F4")?.options || []).find(o=>o.key===f4.value);
    if (chose) {
      const isSpeed = chose.traitDir === 1;
      const stage = context.stage || "mvp";
      const industry = context.industry || "saas";
      const speedHelpful =
        (stage === "pre-launch" || stage === "mvp") && (industry === "consumer-ecom" || industry === "saas");
      const rigorHelpful =
        (stage === "scaling" || stage === "mature") || (industry === "hardware-regulated");

      if (isSpeed && rigorHelpful) fitScore -= 3; // small penalty
      if (!isSpeed && speedHelpful) fitScore -= 2; // small penalty
      if (isSpeed && speedHelpful) fitScore += 2;
      if (!isSpeed && rigorHelpful) fitScore += 2;
    }
  }

  // Priors
  const ageP = AGE_PRIOR[context.ageBucket] ?? 1.0;
  const domP = DOMAIN_EXP_PRIOR[context.domainExp] ?? 1.0;
  const fexpP = FOUNDER_EXP_PRIOR[context.founderExp || "first-time"] ?? 1.0;
  const capP  = CAPITAL_PRIOR[context.capital || "angel-seed"] ?? 1.0;

  let success = fitScore * ageP * domP * fexpP * capP * (validity / 100);

  // Burnout risk: small penalty unless Emotional Stability is high
  const burnoutFlag = traits.riskFlags.includes("burnout_risk_high_drive_extreme");
  if (burnoutFlag && (dimScores["Emotional Stability"] || 0) < 70) {
    success *= 0.97; // light penalty
  }

  success = clamp(Math.round(success), 0, 100);

  return { successIndex: success };
}

/* =========================
   7) CONTEXT MODULE (2 REQUIRED + 3 OPTIONAL)
   Call this AFTER the trait quiz before you compute SuccessIndex.
========================= */

const contextQuestions = [
  {
    id: "D1_AGE",
    text: "What is your age range?",
    options: [
      { key: "under-25", label: "Under 25" },
      { key: "25-34", label: "25–34" },
      { key: "35-44", label: "35–44" },
      { key: "45-54", label: "45–54" },
      { key: "55-64", label: "55–64" },
      { key: "65+", label: "65+" },
    ]
  },
  {
    id: "D6_DOMAIN_EXP",
    text: "How many years have you worked in this industry/domain?",
    options: [
      { key: "lt-1", label: "< 1 year" },
      { key: "1-3", label: "1–3 years" },
      { key: "3-7", label: "3–7 years" },
      { key: "7+", label: "7+ years" },
    ]
  },
  // OPTIONAL (recommended)
  {
    id: "D3_STAGE",
    text: "What stage is your current venture?",
    optional: true,
    options: [
      { key: "pre-launch", label: "Pre-launch (idea/prototype)" },
      { key: "mvp", label: "MVP / early traction" },
      { key: "pmf-search", label: "PMF search (repeatability unclear)" },
      { key: "scaling", label: "Scaling (repeatable acquisition + hiring)" },
      { key: "mature", label: "Mature / optimization" },
    ]
  },
  {
    id: "D5_INDUSTRY",
    text: "Which category best fits your business?",
    optional: true,
    options: [
      { key: "saas", label: "SaaS / software" },
      { key: "consumer-ecom", label: "Consumer / ecommerce" },
      { key: "services", label: "B2B services / agency" },
      { key: "hardware-regulated", label: "Hardware / biotech / regulated" },
    ]
  },
  {
    id: "D2_FOUNDER_EXP",
    text: "Founder experience (prior ventures)?",
    optional: true,
    options: [
      { key: "first-time", label: "First-time founder" },
      { key: "1", label: "1 prior venture" },
      { key: "2-3", label: "2–3 prior ventures" },
      { key: "4+", label: "4+ prior ventures" },
    ]
  },
  {
    id: "D4_CAPITAL",
    text: "Capital strategy (closest match)?",
    optional: true,
    options: [
      { key: "bootstrapped", label: "Bootstrapped" },
      { key: "angel-seed", label: "Angel / small seed" },
      { key: "vc", label: "VC-backed" },
    ]
  },
];

/* =========================
   8) ONE CALL TO RUN EVERYTHING (USE THIS IN YOUR EXISTING calculateScore())
========================= */

function runFounderFitScoring({ responsesMap, msTotal, context }) {
  // 1) Traits
  const traits = scoreTraits(responsesMap);

  // 2) Validity
  const validityObj = scoreValidity(responsesMap, msTotal);

  // 3) Success index (requires context)
  const successObj = scoreSuccessIndex(traits, validityObj, context);

  return { traits, validity: validityObj, success: successObj };
}

/* =========================
   9) NOTES FOR HOOKING INTO YOUR CURRENT APP
=========================

A) For binary questions in your UI:
   - set responses[q.id] = { dimension: q.dimension, type: "binary", value: chosenOption.key }

B) For likert questions in your UI:
   - set responses[q.id] = { dimension: q.dimension, type: "likert", value: chosenValue1to5 }

C) When finished:
   - collect context answers into:
     const context = {
       ageBucket: "...",
       domainExp: "...",
       stage: "...",         // optional
       industry: "...",      // optional
       founderExp: "...",    // optional
       capital: "..."        // optional
     }

D) Then call:
   const result = runFounderFitScoring({ responsesMap: responses, msTotal: elapsedMs, context });

E) Display:
   - result.traits.overallTraitScore
   - result.traits.dimScores
   - result.validity.validity + confidenceBand + flags
   - result.success.successIndex (may be null if validity < 60)

*/
</script>
