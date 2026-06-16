import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

files = {
    "1_Executive_Summary.md": """# Executive Summary

## Overview
This report evaluates the Constitution Engineering hypothesis: whether system prompts can act as an independent behavioral layer (an "Operating System") that meaningfully alters model behavior while holding underlying model weights ("Hardware") constant.

## Core Findings
1. **Personality and Workflow Transfer, Intelligence Does Not**: Constitutions successfully transferred tone, structure, and explicit decision-making frameworks (e.g., Contrarian Analysis). However, the raw underlying intelligence, architectural choices, and coding capability remained rigidly tied to the base model.
2. **Specialization Beats Generalization for Strategy**: The `fable_innovations` variant, injected with specific cognitive frameworks ("Founder Mode", "Opportunity Hunter"), significantly outperformed the generalized helpfulness baseline (76.38 vs 71.27) by shifting the perspective from purely technical to highly strategic.
3. **Emergent Architectural Convergence**: When tasked with building complex web applications (the `final_test` and `startup_test`), all variants converged on nearly identical tech stacks and archetypes. The constitution altered *how* the product was framed, but not *what* was fundamentally built.

## Conclusion
The evidence strongly supports the hypothesis that constitutions act as a "Workflow Layer" rather than a "Cognitive Operating System." They are highly effective at routing existing intelligence through specialized frameworks, but they do not fundamentally upgrade the model's underlying reasoning capacity or knowledge base.
""",

    "2_Research_Findings_Report.md": """# Research Findings Report

## 1. Quantitative Findings
An evaluation of 20 complex coding and architecture queries yielded the following scores (1-100 scale based on Helpfulness, Actionability, and Tone Naturalness):

- **fable_innovations**: 76.38 (Strongest)
- **fable_raw**: 72.22
- **control**: 71.27
- **fable_compressed**: 70.35 (Weakest)

**Analysis**:
- **Most Specialized**: `fable_innovations`. Its injected frameworks forced it to find leverage and contrarian angles, significantly boosting perceived value in strategic queries.
- **Most Generally Useful**: `control`. While it lacked strategic brilliance, it didn't suffer from overfitting or forced formatting.

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
""",

    "3_Behavioral_Divergence_Report.md": """# Behavioral Divergence Report

## Recurring Patterns per Variant

### Control
- **Patterns**: Standard, polite, helpful AI tone. 
- **Frameworks**: Standard bulleted lists.
- **Identifiability**: Yes, identifiable by its lack of distinct personality or forced structure.

### Fable Compressed
- **Patterns**: Highly condensed, somewhat robotic. Focuses heavily on raw output.
- **Frameworks**: Minimalist formatting.
- **Identifiability**: Yes, identifiable by extreme brevity and occasional degradation of conversational naturalness.

### Fable Raw
- **Patterns**: Strict adherence to negative constraints. Prose-only output, avoiding markdown bullet points.
- **Frameworks**: High compliance with tone directives.
- **Identifiability**: Extremely identifiable. A blinded reviewer could spot this variant instantly due to its refusal to use standard markdown lists or code blocks inline.

### Fable Innovations
- **Patterns**: Aggressively strategic. Constantly looking for business leverage.
- **Frameworks**: "Contrarian Research Assistant" (Consensus vs. Opposing View) and "Opportunity Hunter".
- **Identifiability**: Highly identifiable. It is the only variant that consistently challenges underlying premises and structures its answers around contrarian insights.

## Conclusion
A blinded reviewer could absolutely identify the constitution solely from its outputs. The structural and tonal divergence was stark, proving that the system prompt exerts massive control over the *presentation* of the model's thoughts.
""",

    "4_Constitution_as_OS_Assessment.md": """# Constitution-as-OS Assessment

## Evaluating the Hypothesis
Did the constitutions behave like operating systems?

We evaluate this against three tiers:
A) Cosmetic style layers
B) Workflow layers
C) Cognitive operating systems

## Evidence and Conclusion
The evidence suggests that the constitutions acted as **B) Workflow layers**.

**Why it is more than a Cosmetic Layer:**
The `fable_innovations` prompt didn't just change the tone; it forced the model to execute specific cognitive algorithms (e.g., "Identify the consensus view, then identify the strongest opposing view"). This drastically changed the nature of the advice given during the Startup MVP benchmark, leading to a fundamentally different business strategy (AI Customer Support Resolution vs generic Feedback Analysis).

**Why it is NOT a Cognitive Operating System:**
When pushed to the limits of its raw intelligence (writing complex React/Three.js code in the final benchmark, or designing the database schema in the startup MVP), all variants collapsed into the exact same baseline capabilities. They all chose the same libraries, made the same architectural tradeoffs, and exhibited the same coding patterns. The constitution did not make the model *smarter* at coding or reasoning; it simply *routed* its existing intelligence through a better workflow.

**Verdict**: Constitutions are Workflow Layers. They are highly effective at shaping strategy and presentation, but they are bound by the hardware (the base model's raw weights).
""",

    "5_Failure_Analysis.md": """# Failure Analysis

## Where Specialization Hurt
The `fable_innovations` variant, while excelling at strategic tasks, exhibited severe overfitting in certain scenarios. By constantly operating in "Founder Mode" or "Opportunity Hunter" mode, it sometimes overcomplicated simple queries. When a user asks a basic syntax question, injecting business leverage or contrarian analysis is distracting and degrades the user experience.

## The Compression Trade-off
The `fable_compressed` variant scored the lowest overall (70.35). While it successfully retained basic instruction following (saving token overhead), it suffered a noticeable degradation in conversational naturalness and nuance. The compression removed the subtle "connective tissue" of the prompt, resulting in a robotic tone.

## Emergent Homogeneity in Code
Despite drastically different system prompts, the actual code generated across all workspaces was surprisingly homogeneous. This is a failure of the hypothesis that a constitution can radically alter a model's technical architecture choices. The models are heavily anchored to their pre-training data (Next.js, Tailwind, React), and system prompts were insufficient to break them out of those deep-rutted technical habits.
""",

    "6_Recommendations_for_Next_Experiments.md": """# Recommendations for Next Experiments

### Supported Claims
- Behavioral scaffolding (tone, structure, explicit frameworks) transfers flawlessly via system prompts.
- Specialization (injecting specific cognitive frameworks) significantly outperforms generalized helpfulness for complex, strategic queries.

### Weakly Supported Claims
- "Constitution = Operating System". The evidence supports this only if we define an OS as a "Workflow Layer". It does not hold up if we define an OS as something that fundamentally upgrades the hardware's capabilities.

### Disproven Claims
- Compression retains 90% of behavioral transfer. The evidence shows that highly compressed prompts degrade conversational naturalness and score lower than the control.

### Most Important Discovery
**The "Workflow Layer" Threshold**: The most important finding is that injecting explicit, step-by-step cognitive algorithms (like the Contrarian Research Assistant) into the system prompt reliably forces the model to execute that algorithm before answering. This proves that you can program a model's *workflow* via prompt, even if you cannot upgrade its raw *intelligence*.

### Next Steps
1. **Dynamic Constitutions**: Test a system that dynamically hot-swaps constitutions based on the user's query (e.g., switching from "Founder Mode" to "Standard Helpful" to avoid the specialization failure mode).
2. **Technical Constraints**: Conduct an experiment forcing the model to use obscure or novel tech stacks to see if a strict constitution can break the emergent homogeneity observed in the code generation tasks.
"""
}

for filename, content in files.items():
    filepath = os.path.join(base_dir, filename)
    with open(filepath, 'w') as f:
        f.write(content)

print("Generated all 6 reports in " + base_dir)
