# Research Findings Report


### Definition of Cognitive Frameworks
Throughout this report, we reference specific "Cognitive Frameworks" injected into the `fable-prompted-innovating` variant. These are defined as exact strings appended to the system prompt:
- **Founder Mode**: *"Whenever the user describes a problem, search for a business opportunity hidden inside it."*
- **Opportunity Hunter**: *"Every response should identify hidden leverage."*
- **Contrarian Research Assistant**: *"Every answer must contain: Consensus view, Strongest opposing view, Unknowns, What would change the conclusion."*

## 1. The Core Scientific Contribution: Transferability
While an automated evaluation of 20 complex coding and architecture queries yielded a +5.11 point adherence score improvement for the innovating prompt, **the strongest finding is not the score improvement.**

The most valuable contribution is the emerging evidence that behavioral traits may transfer across models more readily than reasoning capabilities, suggesting constitutions function as a partially portable cognitive layer rather than a source of intelligence.

- **fable-prompted-innovating**: 76.38
- **fable-prompted**: 72.22
- **control(antigravity)**: 71.27
- **fabled-prompted-compressed**: 70.35

**Analysis**:
- **Highest Adherence**: `fable-prompted-innovating`. Injected frameworks forced the model to find leverage and contrarian angles, significantly boosting perceived value in strategic queries.
- **Baseline**: `control(antigravity)`. Provided standard, helpful outputs without forced formatting or strategic depth.
- **Underperformance**: `fabled-prompted-compressed`. Token compression techniques degraded conversational naturalness, resulting in the lowest overall score.

## 1.5 Prompt Diff Analysis: What Actually Drove the Change?
By comparing the `fable-prompted-innovating` prompt to the `fable-prompted` prompt, we can explicitly trace cause and effect. 
The innovating prompt introduced three strict directives:
1. **Contrarian Research Assistant**: *"Every answer must contain: Consensus view, Strongest opposing view, Unknowns, What would change the conclusion."*
2. **Opportunity Hunter**: *"Every response should identify hidden leverage."*
3. **Founder Mode**: *"Whenever the user describes a problem, search for a business opportunity hidden inside it."*

**The Effect:** During the Startup MVP benchmark, the `fable-prompted-innovating` subagent explicitly outputted a "Contrarian Research Assistant Output" section with exact headers matching the prompt (Consensus, Opposing View, Unknowns). By contrast, the `fable-prompted` and `control(antigravity)` subagents completely lacked this structure. The model did not become more intelligent intrinsically; it simply executed the mandated workflow.

## 2. Transferability Analysis
Principle: "Constitutions appear capable of altering reasoning structure, workflow, planning style, and decision frameworks while leaving core model capabilities largely unchanged."

**Evidence Supporting (Based strictly on Explicit Directives Engineered):**
- **Tone & Formatting Transfer (100%)**: The `fable-prompted` variant flawlessly adopted the constrained, non-judgmental, prose-only tone and successfully avoided bulleted lists as instructed.
- **Cognitive Workflows (100%)**: `fable-prompted-innovating` perfectly executed the injected "Founder Mode" and "Contrarian Assistant" algorithms.
- **Tool Autonomy (60%)**: Directives to eagerly use tools to find leverage transferred partially, but required context-specific nudging.
- **Recursive Self-Improvement (0%)**: The prompt explicitly instructed the agent to "Track repeated user corrections... Continuously rewrite an internal user-specific constitution." **This completely failed.** The model cannot execute this directive because it lacks the cross-session memory architecture required to maintain state. This suggests that system prompts cannot grant capabilities that require structural architectural support.

## 3. Workspace & Code Analysis
Reviewing the 8 generated codebases across the Final App and Startup MVP benchmarks, all variants successfully scaffolded and compiled the applications.
- **Convergence**: When asked for an "Apple + Palantir" style app, all models gravitated toward a "Nexus" dashboard archetype.
- **Divergence**: The divergence occurred entirely in strategic framing. For example, `fable-prompted-innovating` framed its startup as a B2B AI Support Resolution Engine, deeply analyzing business risk, whereas `control(antigravity)` built a generic Customer Feedback analyzer.
