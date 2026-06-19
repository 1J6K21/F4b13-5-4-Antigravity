# Website Refactor Directive (Evidence-Only Mode)

You are performing a final publication refactor of the Constitution Engineering website, reports, one-pager, slideshow, methodology documents, and supporting materials.

Your goal is NOT to improve the research.

Your goal is NOT to strengthen the narrative.

Your goal is NOT to make the project more impressive.

Your goal is to align every public claim with the strongest evidence actually produced by the experiments.

Treat the auditor's report as authoritative.

---

## Primary Rule

If a claim is not directly supported by observed data, measured outputs, evaluations, benchmarks, workspace artifacts, or documented experimental results:

REMOVE IT.

Do not weaken.

Do not rephrase.

Remove it entirely.

---

## Evidence Hierarchy

Rank all statements according to the following hierarchy:

### Tier 1 (Observed Evidence)

Keep.

Examples:

* actual benchmark outputs
* evaluator scores
* code generated
* workspace artifacts
* prompt outputs
* side-by-side comparisons
* contamination examples
* observed failures
* observed successes

---

### Tier 2 (Supported Interpretation)

Keep if clearly labeled.

Examples:

* "results suggest"
* "results indicate"
* "evidence supports"
* "preliminary findings imply"

Must be tied directly to Tier 1 evidence.

---

### Tier 3 (Hypothesis)

Move into:

* Future Work
* Open Questions
* Phase 3 Motivation

Examples:

* cognitive operating systems
* constitutional orchestration
* architecture primitives
* marketplace concepts
* future industry implications

Must never be presented as findings.

---

### Tier 4 (Unsupported Claims)

Delete.

Examples:

* proves
* validates
* demonstrates conclusively
* establishes
* confirms
* independent architectural primitive
* revolutionary
* paradigm shift
* breakthrough

Unless directly justified by evidence.

---

## Required Global Search

Find and replace:

"proves"
→ "suggests"

"validates"
→ "provides evidence for"

"demonstrates"
→ "observed in"

"confirms"
→ "is consistent with"

"establishes"
→ "explores"

when appropriate.

---

## Specific Refactoring Targets

### Cognitive Operating Systems

Current risk:

The website sometimes implies that constitutions have been proven to function as cognitive operating systems.

This has NOT been demonstrated.

Replace with:

"Our findings motivated the hypothesis that constitutions may function as behavioral operating systems. This remains an open research question explored in Phase 3."

---

### Architectural Primitive Claims

Current risk:

The website implies that constitutions are an independent architectural layer.

This has NOT been proven.

Move all such statements into:

Future Work
Phase 3
Research Questions

Never Findings.

---

### Token Efficiency Claims

Remove all claims that imply lower runtime cost.

Only discuss:

* prompt density
* system prompt size
* context utilization

If runtime costs were not measured, explicitly state they were not measured.

---

### Causality Claims

Any statement of the form:

"X caused Y"

must become:

"X was associated with Y"

unless causality was directly tested.

---

## Required New Section

Add:

# What We Actually Observed

A concise section listing only findings directly supported by data.

Examples:

* Behavioral scaffolding transferred between models more reliably than expected.
* Workflow structure transferred more consistently than raw reasoning ability.
* Some constitutions improved startup ideation quality.
* Combining multiple behavioral directives increased contamination in certain tasks.
* Prompt compression reduced behavioral consistency.

Only include observations supported by experimental evidence.

---

## Required New Section

Add:

# What We Did NOT Prove

Explicitly state:

This research does not prove:

* constitutions are cognitive operating systems
* constitutions improve intelligence
* constitutions replace model quality
* constitutions are architectural primitives
* any superiority of one frontier model over another

These remain open questions.

---

## Final Goal

After refactoring, a skeptical AI researcher should be able to read the website and conclude:

"The authors may be wrong, but they are not overstating their evidence."

Optimize for credibility.

Optimize for survivability under public criticism.

Optimize for truth.

Do not optimize for hype.
