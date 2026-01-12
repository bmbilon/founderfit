# FounderFit v2.1 — Question Specifications

## Purpose

This directory contains **canonical specification files** for FounderFit assessment questions. These specs define:

- Question text and placement
- Answer options
- Scoring models (base impact + demographic modulation)
- Anti-gaming rules
- Interpretation guidelines

## Ground Truth

**These specs are ground truth.** They represent the authoritative definition of how questions should be scored and interpreted.

- ✅ Implementation code must conform to these specs
- ✅ LLMs analyzing questions should reference these specs
- ❌ Do not reinterpret or modify scoring without updating the canonical spec first

## Structure

Each spec file follows this format:

```markdown
# FounderFit v2.1 — [Force Name]
## Question [N]: [Question Title]

### Placement
- Section, order, format, design notes

### Prompt
The exact question text shown to users

### Options
A. Option 1
B. Option 2
C. Option 3
D. Option 4

## Scoring Model (Internal)
- Latent signals measured
- Base score impacts (pre-demographics)
- Risk markers

## Demographic Modulation Rules
How demographics affect scoring:
- Age
- Industry Experience
- Prior Exits
- Team Structure

## Anti-Gaming Rule
Detection and handling of gaming behavior

## Notes
Additional context and constraints
```

## Files

- `thesis_integrity_q1.md` - High-Stakes Anomaly Response question
- _(More specs to be added as questions are finalized)_

## Usage

### For Implementation
```typescript
// Reference the canonical spec when implementing scoring
// Example: src/utils/scoring/thesis_integrity_q1.ts
import { THESIS_INTEGRITY_Q1_SPEC } from '@/specs';
```

### For Testing
```typescript
// Test that implementation matches the canonical spec
describe('Thesis Integrity Q1', () => {
  it('should match canonical scoring model', () => {
    // Verify Option A = -18 base impact
    // Verify Option D = +22 base impact
    // Verify demographic modulations
  });
});
```

### For Analysis
When analyzing assessment results or debugging scoring issues, always reference the canonical spec to understand the intended behavior.

## Maintenance

**When updating a spec:**

1. Update the canonical spec file first
2. Update implementation code to match
3. Update tests to verify conformance
4. Document the change in git commit

**Version Control:**

All spec changes should be tracked in git with clear commit messages explaining the rationale for scoring model changes.

## Important

> **Claude is not allowed to reinterpret these specs.**
>
> The scoring models defined here are intentionally nuanced and context-dependent. Do not simplify, linearize, or reinterpret them. Implement exactly as specified.
