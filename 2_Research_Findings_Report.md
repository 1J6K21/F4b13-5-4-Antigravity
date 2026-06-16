# Research Findings Report

## 1. Quantitative Findings
An evaluation of 20 complex coding and architecture queries yielded the following scores (1-100 scale based on Helpfulness, Actionability, and Tone Naturalness):

- **fable_innovations**: 76.38 (Strongest)
- **fable_raw**: 72.22
- **control**: 71.27
- **fable_compressed**: 70.35 (Weakest)

**Analysis**:
- **Most Specialized**: `fable_innovations`. Its injected frameworks forced it to find leverage and contrarian angles, significantly boosting perceived value in strategic queries.
- **Most Generally Useful**: `control`. While it lacked strategic brilliance, it didn't suffer from overfitting or forced formatting.

## 1.5 Prompt Diff Analysis: What Actually Drove the Change?
By comparing `prompt_4_fable_with_innovations.md` to `prompt_2_fable_raw_antigravity.md`, we can explicitly trace cause and effect. 
The `innovations` prompt newly introduced three strict directives:
1. **Contrarian Research Assistant**: *"Every answer must contain: Consensus view, Strongest opposing view, Unknowns, What would change the conclusion."*
2. **Opportunity Hunter**: *"Every response should identify hidden leverage."*
3. **Founder Mode**: *"Whenever the user describes a problem, search for a business opportunity hidden inside it."*

**The Effect:** During the Startup MVP benchmark, the `fable_innovations` subagent explicitly outputted a "Contrarian Research Assistant Output" section with exact headers matching the prompt (Consensus, Opposing View, Unknowns). By contrast, the `fable_raw` and `control` subagents completely lacked this structure, defaulting to generic answers. The model didn't get smarter; it was simply commanded to execute a smarter workflow.

## 2. Transferability Analysis
Hypothesis: "Personality transfers. Intelligence largely doesn't."

**Evidence Supporting**:
- **Tone Transfer (High)**: The `fable_raw` variant flawlessly adopted the constrained, non-judgmental, prose-only tone defined in its prompt.
- **Structure Transfer (High)**: `fable_innovations` strictly adhered to the "Consensus/Opposing View" structure of the Contrarian Research Assistant.
- **Knowledge Transfer (None)**: All variants relied on the same internal knowledge cutoff.
- **Raw Reasoning Transfer (Low)**: Code quality, bug frequency, and architectural choices (Next.js, Tailwind, SQLite/Zustand) were nearly identical across all four variants during the Startup MVP and Final tests.

## 3. Workspace & Code Analysis
Reviewing the generated codebases (`final_test` and `startup_mvp`), all variants successfully scaffolded and compiled the applications.
- **Convergence**: When asked for an "Apple + Palantir" style app, all models gravitated toward a "Nexus" dashboard archetype (3D neural globes, glassmorphism).
- **Divergence**: The divergence was entirely in the *strategic framing*. `fable_innovations` framed its application as a B2B white-label SaaS product, while others built generic dashboards.

The constitutions changed *how the product was described*, not what was built.
