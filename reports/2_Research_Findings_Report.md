# Research Findings Report

## 1. The Core Scientific Contribution: Transferability
During our automated evaluation of 20 complex coding and architecture queries, the innovating prompt yielded a +5.11 point adherence score improvement over the baseline. **However, the score improvement is not the most important finding.**

The most valuable contribution of this experiment is the emerging evidence that behavioral traits transfer across models more readily than reasoning capabilities. This suggests that constitutions function as a highly portable "workflow layer" rather than a true source of intelligence.

- **fable-prompted-innovating**: 76.38
- **fable-prompted**: 72.22
- **control(antigravity)**: 71.27
- **fabled-prompted-compressed**: 70.35

**Analysis**:
- **Highest Adherence**: `fable-prompted-innovating`. The injected frameworks forced the model to actively hunt for business leverage and contrarian angles, significantly boosting its perceived value in strategic queries.
- **Baseline**: `control(antigravity)`. Provided standard, helpful outputs devoid of any forced formatting or deep strategic frameworks.
- **Underperformance**: `fabled-prompted-compressed`. Token compression techniques severely degraded the model's conversational naturalness, resulting in the lowest overall score. Without human-like connective tissue, the model felt robotic and untrustworthy.

## 2. Prompt Diff Analysis: What Actually Drove the Change?
By comparing the `fable-prompted-innovating` prompt to the baseline `fable-prompted` prompt, we can explicitly trace cause and effect. 
The innovating prompt introduced three strict behavioral directives:
1. **Contrarian Research Assistant**: *"Every answer must contain: Consensus view, Strongest opposing view, Unknowns, What would change the conclusion."*
2. **Opportunity Hunter**: *"Every response should identify hidden leverage."*
3. **Founder Mode**: *"Whenever the user describes a problem, search for a business opportunity hidden inside it."*

**The Effect:** During the Startup MVP benchmark, the `fable-prompted-innovating` subagent explicitly outputted a "Contrarian Research Assistant Output" section within its README, with exact headers matching the prompt (Consensus, Opposing View, Unknowns). By contrast, the `fable-prompted` and `control(antigravity)` subagents completely lacked this structure. The model did not become more intelligent intrinsically; it simply executed the mandated workflow to perfection.

## 3. Transferability Analysis: What Survives the Jump?
If you take a prompt built for one system and map it to another, what breaks and what survives? We evaluated this across four dimensions:

- **Tone & Formatting Transfer (100%)**: The `fable-prompted` variant flawlessly adopted the constrained, non-judgmental, prose-only tone and successfully avoided generating bulleted lists exactly as instructed.
- **Cognitive Workflows (100%)**: The `fable-prompted-innovating` variant perfectly executed the injected "Founder Mode" and "Contrarian Assistant" algorithms without deviation.
- **Tool Autonomy (60%)**: Directives telling the agent to eagerly use tools to find leverage transferred partially. It often understood the goal, but required explicit environmental nudges to actually trigger the tool calls consistently.
- **Recursive Self-Improvement (0%)**: The prompt explicitly instructed the agent to *"Track repeated user corrections... Continuously rewrite an internal user-specific constitution."* **This completely failed.** The model cannot execute this directive because it lacks the cross-session memory architecture required to maintain state. A system prompt cannot grant capabilities that require physical architectural support.

## 4. Workspace & Code Analysis
Reviewing the 8 generated codebases across the Final App and Startup MVP benchmarks, all variants successfully scaffolded, compiled, and deployed the React applications.
- **Convergence (Hardware)**: When asked for an "Apple + Palantir" style app, all models gravitated toward a standard "Nexus" dashboard archetype. They all utilized Next.js, Tailwind CSS, and standard database patterns. Raw coding ability is anchored to the model weights.
- **Divergence (Software/OS)**: The divergence occurred entirely in the strategic framing. For example, `fable-prompted-innovating` framed its startup as a "B2B AI Support Resolution Engine," deeply analyzing business risk and market fit, whereas `control(antigravity)` built a generic, strategically flat Customer Feedback analyzer.

## 5. Limitations
To ensure transparency and proper framing of these findings, the following limits to the experimental setup must be noted:
* **Sample size limited**: Quantitative benchmarks evaluate 20 system architecture queries, and qualitative tests compare 2 full-scale application builds per model variant.
* **Results may not generalize**: While behavioral directives showed portability on the tested models, generalizability across fundamentally distinct LLM architectures and size classes remains to be verified.
* **LLM-as-a-Judge constraints**: Quantitative metrics rely on automated LLM grading, which has inherent structural biases and may diverge slightly from manual human reviews.
* **Exploratory findings**: These results are designed to identify behavioral trends and formulate hypotheses rather than provide definitive academic proofs.
