# Executive Summary: System Prompts as the Cognitive OS (Why the Model is Just Hardware)

## Overview
This report details the findings of Constitution Engineering: system prompts can act as an independent behavioral layer (an "Operating System") that meaningfully alters model behavior while holding underlying model weights ("Hardware") constant. The experiment evaluated four prompt variants: `control(antigravity)`, `fable-prompted`, `fabled-prompted-compressed`, and `fable-prompted-innovating`.

## The Capability vs. Intelligence Paradigm
The most profound discovery is the distinction between **Capability** and **Intelligence**. Beneath the system prompt, the base model is incredibly *capable*—it successfully architected and compiled complex Next.js applications, generated boilerplate, and configured databases flawlessly regardless of which system prompt it was given. 
However, it is fundamentally *inert*. Real **intelligence**—the ability to apply judgment, discern business leverage, and identify the *right* problem to solve—is heavily dictated by the Constitution. The model's weights provide the engine, but the system prompt provides the steering wheel.


### Definition of Cognitive Frameworks
Throughout this report, we reference specific "Cognitive Frameworks" injected into the `fable-prompted-innovating` variant. These are defined as exact strings appended to the system prompt:
- **Founder Mode**: *"Whenever the user describes a problem, search for a business opportunity hidden inside it."*
- **Opportunity Hunter**: *"Every response should identify hidden leverage."*
- **Contrarian Research Assistant**: *"Every answer must contain: Consensus view, Strongest opposing view, Unknowns, What would change the conclusion."*

## Core Findings
1. **Personality and Workflow Transfer, Intelligence Does Not**: Constitutions successfully transferred tone, structure, and explicit decision-making frameworks (e.g., Contrarian Analysis). However, the raw underlying intelligence, architectural choices, and coding capability remained rigidly tied to the base model.
2. **Specialization Beats Generalization for Strategy**: The `fable-prompted-innovating` variant, injected with specific cognitive frameworks ("Founder Mode", "Opportunity Hunter"), outperformed the baseline (`control(antigravity)`) by scoring 76.38 vs 71.27. This score was obtained by utilizing an automated LLM-as-a-judge system to rigorously evaluate 20 complex programming and architecture queries, grading each output from 1-100 on Helpfulness, Actionability, and Tone Naturalness.
3. **Emergent Architectural Convergence**: When tasked with building complex web applications (the Final App test and Startup MVP test), all variants converged on nearly identical tech stacks and archetypes (e.g., Next.js, Tailwind, SQLite). The constitution altered *how* the product was framed strategically, but not *what* was fundamentally built.

## Conclusion
The evidence conclusively proves that constitutions act as a "Workflow Layer" rather than a "Cognitive Operating System." They are highly effective at routing existing intelligence through specialized frameworks, but they do not fundamentally upgrade the model's underlying reasoning capacity or knowledge base.
