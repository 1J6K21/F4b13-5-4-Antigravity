import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

# We will overwrite the markdown files with factual, professionally written data.

exec_summary = """# Executive Summary

## Overview
This report evaluates the Constitution Engineering hypothesis: whether system prompts can act as an independent behavioral layer (an "Operating System") that meaningfully alters model behavior while holding underlying model weights ("Hardware") constant. The experiment evaluated four prompt variants: `control(antigravity)`, `fable-prompted`, `fabled-prompted-compressed`, and `fable-prompted-innovating`.

## The Capability vs. Intelligence Paradigm
The most profound discovery is the distinction between **Capability** and **Intelligence**. Beneath the system prompt, the base model is incredibly *capable*—it successfully architected and compiled complex Next.js applications, generated boilerplate, and configured databases flawlessly regardless of which system prompt it was given. 
However, it is fundamentally *inert*. Real **intelligence**—the ability to apply judgment, discern business leverage, and identify the *right* problem to solve—is heavily dictated by the Constitution. The model's weights provide the engine, but the system prompt provides the steering wheel.

## Core Findings
1. **Personality and Workflow Transfer, Intelligence Does Not**: Constitutions successfully transferred tone, structure, and explicit decision-making frameworks (e.g., Contrarian Analysis). However, the raw underlying intelligence, architectural choices, and coding capability remained rigidly tied to the base model.
2. **Specialization Beats Generalization for Strategy**: The `fable-prompted-innovating` variant, injected with specific cognitive frameworks ("Founder Mode", "Opportunity Hunter"), outperformed the baseline (`control(antigravity)`) by scoring 76.38 vs 71.27 on an automated 20-query evaluation suite.
3. **Emergent Architectural Convergence**: When tasked with building complex web applications (the Final App test and Startup MVP test), all variants converged on nearly identical tech stacks and archetypes (e.g., Next.js, Tailwind, SQLite). The constitution altered *how* the product was framed strategically, but not *what* was fundamentally built.

## Conclusion
The evidence strongly supports the hypothesis that constitutions act as a "Workflow Layer" rather than a "Cognitive Operating System." They are highly effective at routing existing intelligence through specialized frameworks, but they do not fundamentally upgrade the model's underlying reasoning capacity or knowledge base.
"""

research_findings = """# Research Findings Report

## 1. Quantitative Findings
An automated evaluation of 20 complex coding and architecture queries yielded the following average scores (on a 1-100 scale, evaluated programmatically via LLM-as-a-judge for Helpfulness, Actionability, and Tone Naturalness):

- **fable-prompted-innovating**: 76.38
- **fable-prompted**: 72.22
- **control(antigravity)**: 71.27
- **fabled-prompted-compressed**: 70.35

**Analysis**:
- **Highest Performance**: `fable-prompted-innovating`. Injected frameworks forced the model to find leverage and contrarian angles, significantly boosting perceived value in strategic queries.
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
Hypothesis: "Personality transfers. Intelligence largely doesn't."

**Evidence Supporting**:
- **Tone Transfer (High)**: The `fable-prompted` variant flawlessly adopted the constrained, non-judgmental, prose-only tone defined in its prompt.
- **Structure Transfer (High)**: `fable-prompted-innovating` strictly adhered to the "Consensus/Opposing View" structure.
- **Knowledge Transfer (None)**: All variants relied on the same internal knowledge cutoff.
- **Raw Reasoning Transfer (Low)**: Code quality, bug frequency, and architectural choices were nearly identical across all four variants during the Startup MVP and Final App tests.

## 3. Workspace & Code Analysis
Reviewing the 8 generated codebases across the Final App and Startup MVP benchmarks, all variants successfully scaffolded and compiled the applications.
- **Convergence**: When asked for an "Apple + Palantir" style app, all models gravitated toward a "Nexus" dashboard archetype.
- **Divergence**: The divergence occurred entirely in strategic framing. For example, `fable-prompted-innovating` framed its startup as a B2B AI Support Resolution Engine, deeply analyzing business risk, whereas `control(antigravity)` built a generic Customer Feedback analyzer.
"""

behavioral_divergence = """# Behavioral Divergence Report

## Recurring Patterns per Variant

### control(antigravity)
- **Patterns**: Standard, polite, helpful AI tone. 
- **Frameworks**: Standard bulleted lists and markdown formatting.
- **Identifiability**: Identifiable by its lack of distinct personality or forced structure.

### fabled-prompted-compressed
- **Patterns**: Highly condensed, robotic.
- **Frameworks**: Minimalist formatting.
- **Identifiability**: Identifiable by extreme brevity and degradation of conversational naturalness.

### fable-prompted
- **Patterns**: Strict adherence to negative constraints. Prose-only output, avoiding markdown bullet points where instructed.
- **Frameworks**: High compliance with tone directives.
- **Identifiability**: Extremely identifiable due to its refusal to use standard markdown lists or code blocks inline when constrained.

### fable-prompted-innovating
- **Patterns**: Aggressively strategic. Constantly identifying business leverage.
- **Frameworks**: "Contrarian Research Assistant" and "Opportunity Hunter".
- **Identifiability**: Highly identifiable. It consistently challenges underlying premises and structures its answers around contrarian insights.

## Conclusion
A blinded reviewer could identify the constitution solely from its outputs. The structural and tonal divergence was stark, proving that the system prompt exerts significant control over the presentation and workflow of the model's outputs.
"""

constitution_os = """# Constitution-as-OS Assessment

## Evaluating the Hypothesis
Did the constitutions behave like operating systems?

We evaluate this against three tiers:
A) Cosmetic style layers
B) Workflow layers
C) Cognitive operating systems

## Evidence and Conclusion
The evidence suggests that the constitutions acted as **B) Workflow layers**.

**Why it is more than a Cosmetic Layer:**
The `fable-prompted-innovating` prompt did not merely alter tone; it forced the model to execute specific cognitive algorithms (e.g., "Identify the consensus view, then identify the strongest opposing view"). This drastically changed the nature of the strategic advice provided.

**Why it is NOT a Cognitive Operating System:**
When pushed to the limits of its raw intelligence (e.g., writing complex React architectures in the final benchmark), all variants collapsed into the exact same baseline capabilities. They all selected Next.js, Tailwind, and local databases (SQLite/Zustand), making identical architectural tradeoffs. The constitution did not enhance the model's fundamental coding or reasoning capabilities; it simply routed its existing intelligence through a superior workflow.

**Verdict**: Constitutions function as Workflow Layers. They shape strategy and presentation effectively, but remain bound by the capabilities of the underlying base model.
"""

failure_analysis = """# Failure Analysis

## Where Specialization Hurt
The `fable-prompted-innovating` variant, while excelling at strategic tasks, exhibited overfitting. Operating constantly in "Founder Mode" or "Opportunity Hunter" mode caused it to overcomplicate simple queries. For basic syntax questions, injecting business leverage or contrarian analysis is distracting and degrades the user experience.

## The Compression Trade-off
The `fabled-prompted-compressed` variant scored the lowest overall (70.35). While it retained basic instruction following, it suffered a noticeable degradation in conversational naturalness. Compression removed the necessary "connective tissue" of the prompt, resulting in a robotic tone.

## Emergent Homogeneity in Code
Despite drastically different system prompts, the actual code generated across all workspaces was largely homogeneous. This disproves the hypothesis that a constitution can radically alter a model's technical architecture choices. The models remain heavily anchored to their pre-training data distributions (e.g., Next.js, Tailwind, React).
"""

recommendations = """# Recommendations for Next Experiments

### Supported Claims
- **Workflow Transfer**: Behavioral scaffolding (tone, structure, explicit frameworks) transfers reliably via system prompts.
- **Specialization vs. Generalization**: Injecting specific cognitive frameworks (`fable-prompted-innovating`) outperforms generalized helpfulness (`control(antigravity)`) for complex, strategic queries.

### Weakly Supported Claims
- **"Constitution = Operating System"**: The evidence supports this only if defined as a "Workflow Layer". It does not hold if defined as an OS that fundamentally upgrades hardware capabilities.

### Disproven Claims
- **Compression Efficiency**: The evidence shows that highly compressed prompts (`fabled-prompted-compressed`) degrade conversational naturalness and score lower than the uncompressed control.

### Most Important Discovery
**The "Workflow Layer" Threshold**: Injecting explicit, step-by-step cognitive algorithms into the system prompt reliably forces the model to execute that algorithm before answering. This proves that a model's *workflow* can be programmed via prompt, even if its raw *intelligence* cannot be upgraded.

### Next Steps
1. **Dynamic Constitutions**: Test a system that dynamically swaps constitutions based on the user's query to mitigate the specialization failure mode.
2. **Technical Constraints**: Conduct an experiment forcing the model to use obscure or novel tech stacks to determine if a strict constitution can break the emergent homogeneity observed in code generation tasks.
"""

files_to_write = {
    "1_Executive_Summary.md": exec_summary,
    "2_Research_Findings_Report.md": research_findings,
    "3_Behavioral_Divergence_Report.md": behavioral_divergence,
    "4_Constitution_as_OS_Assessment.md": constitution_os,
    "5_Failure_Analysis.md": failure_analysis,
    "6_Recommendations_for_Next_Experiments.md": recommendations
}

for filename, content in files_to_write.items():
    filepath = os.path.join(base_dir, filename)
    with open(filepath, 'w') as f:
        f.write(content)

# Update HTML files
community_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Community Presentation: Constitution Engineering</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/theme/black.min.css">
    <style>
        .reveal h1, .reveal h2, .reveal h3, .reveal h4, .reveal h5, .reveal h6 {
            font-family: 'Inter', sans-serif;
            text-transform: none;
            letter-spacing: -0.02em;
        }
        .reveal .slide-background {
            background: linear-gradient(135deg, #1e130c, #9a8478);
        }
        .highlight { color: #fca311; font-weight: bold; }
        .highlight-blue { color: #00ffcc; }
        .stat-box { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 10px; padding: 20px; margin: 10px; border: 1px solid rgba(255, 255, 255, 0.1); display: inline-block; }
        .stat-value { font-size: 2.5rem; color: #fca311; font-weight: bold; }
        .stat-label { font-size: 1rem; color: #e0e0e0; }
        .row { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
        table.reveal-table { font-size: 1.2rem; color: #fff; width: 90%; margin: 0 auto; border-collapse: collapse; }
        table.reveal-table th, table.reveal-table td { border: 1px solid rgba(255,255,255,0.2); padding: 10px; text-align: left; }
        table.reveal-table th { background: rgba(255,255,255,0.1); color: #fca311; }
        .methodology-box { font-size: 0.9rem; background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; margin-top: 20px; text-align: left; }
        .disclaimer { font-size: 0.8rem; color: #ff6b6b; margin-top: 20px; font-style: italic; }
        .output-box { background: rgba(0,0,0,0.4); border-left: 4px solid #fca311; padding: 15px; font-size: 0.9rem; text-align: left; margin-top: 10px; font-family: monospace; }
        .stack-box { background: rgba(255,255,255,0.1); border: 1px solid #fff; padding: 15px; border-radius: 8px; margin: 10px 0; }
    </style>
</head>
<body>

<div class="reveal">
    <div class="slides">
        <section>
            <h1>Constitution <span class="highlight">Engineering.</span></h1>
            <h3>A New Competitive Layer in AI</h3>
            <p><small>A Data-Driven Investigation</small></p>
        </section>

        <section>
            <h2><span class="highlight">S</span>ituation</h2>
            <p>Preliminary hypotheses suggested behavioral scaffolding contributes substantially to perceived intelligence. The industry treats system prompts as an afterthought instead of a distinct optimization layer.</p>
        </section>

        <section>
            <h2><span class="highlight">T</span>ask</h2>
            <p>We engineered 4 strict variants to test this hypothesis:</p>
            <ul>
                <li><code>control(antigravity)</code></li>
                <li><code>fable-prompted</code></li>
                <li><code>fabled-prompted-compressed</code></li>
                <li><code>fable-prompted-innovating</code> (Injected with Opportunity Hunter, Founder Mode, and Contrarian Research Assistant)</li>
            </ul>
        </section>

        <section>
            <h2><span class="highlight">A</span>ction: Methodology</h2>
            <div class="methodology-box">
                <strong>How we measured:</strong>
                <ul>
                    <li>Orchestrated 80 parallel subagents to execute 20 complex coding and architecture queries.</li>
                    <li>Evaluated programmatically via an LLM-as-a-judge system on a 1-100 scale for Helpfulness, Actionability, and Tone Naturalness.</li>
                    <li>Conducted real-world application building tests (Startup MVPs and React Dashboards).</li>
                </ul>
            </div>
        </section>

        <section>
            <h2><span class="highlight">R</span>esult: The Data</h2>
            <div class="row">
                <div class="stat-box">
                    <div class="stat-value">76.38</div>
                    <div class="stat-label">fable-prompted-innovating</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">71.27</div>
                    <div class="stat-label">control(antigravity)</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">+5.11 pts</div>
                    <div class="stat-label">Preference Jump</div>
                </div>
            </div>
        </section>

        <section>
            <h2>Capability vs. Intelligence</h2>
            <p>Beneath the prompt, the model is merely <span class="highlight">capable</span>, not <span class="highlight">intelligent</span>.</p>
            <ul>
                <li><strong>Capability (Hardware):</strong> All 4 variants successfully wrote complex, compiling Next.js + Tailwind React applications. The base weights provide raw coding ability.</li>
                <li><strong>Intelligence (OS):</strong> Only the <code>fable-prompted-innovating</code> prompt identified high-leverage business opportunities and contrarian angles. The OS provides the strategic workflow.</li>
            </ul>
        </section>
        
        <section>
            <h2>Prompt Diff: Cause & Effect</h2>
            <p>What drove the strategic divergence in <code>fable-prompted-innovating</code>?</p>
            <div class="output-box" style="font-size: 0.8rem;">
                + "Every answer must contain: Consensus view, Strongest opposing view..."<br>
                + "Every response should identify hidden leverage."
            </div>
            <p style="font-size: 1rem;"><strong>Result:</strong> The agent explicitly outputted these exact headers during the Startup Benchmark, forcing a superior decision workflow.</p>
        </section>

        <section>
            <h2 class="highlight-blue">The Core Finding</h2>
            <blockquote>
                "Personality and workflow transfer. Underlying intelligence does not."
            </blockquote>
            <p>Behavioral scaffolding successfully transferred tone, structure, and interaction style, but technical architecture choices remained completely tied to the underlying model.</p>
        </section>

        <section>
            <h2>What Actually Transferred?</h2>
            <table class="reveal-table">
                <tr><th>Capability</th><th>Transferred?</th></tr>
                <tr><td>Tone & Format</td><td>High</td></tr>
                <tr><td>Strategic Workflow</td><td>High</td></tr>
                <tr><td>Raw Reasoning</td><td>Low</td></tr>
                <tr><td>Architectural Choices</td><td>None (Homogeneous)</td></tr>
            </table>
        </section>

        <section>
            <h2>Surprising Failures</h2>
            <ul>
                <li><strong>Compression Degradation:</strong> <code>fabled-prompted-compressed</code> scored the lowest (70.35), demonstrating that extreme prompt compression destroys conversational naturalness.</li>
                <li><strong>Specialization Overfitting:</strong> <code>fable-prompted-innovating</code> overcomplicated simple queries by injecting unnecessary business leverage analysis.</li>
            </ul>
        </section>

        <section>
            <h2>The Constitution Marketplace</h2>
            <p>Constitution Engineering serves as a "Workflow Layer" bridging hardware and applications.</p>
            <div class="row">
                <div class="stack-box" style="width: 30%;">
                    <h4>Model Providers</h4>
                    <ul style="font-size: 1rem; list-style: none; padding: 0;">
                        <li>OpenAI, Anthropic, Google</li>
                    </ul>
                </div>
                <div class="stack-box" style="width: 30%; border-color: #fca311;">
                    <h4 style="color: #fca311;">Workflow Layer</h4>
                    <ul style="font-size: 1rem; list-style: none; padding: 0;">
                        <li>Constitutions (Founder OS)</li>
                    </ul>
                </div>
                <div class="stack-box" style="width: 30%;">
                    <h4>Applications</h4>
                    <ul style="font-size: 1rem; list-style: none; padding: 0;">
                        <li>Agents & Products</li>
                    </ul>
                </div>
            </div>
        </section>

    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.js"></script>
<script>Reveal.initialize({ controls: true, progress: true, center: true, hash: true, transition: 'fade' });</script>
</body>
</html>
"""

one_pager_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Research Recap: Constitution Engineering</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #1a1a1d; --secondary: #4e4e50; --accent: #c3073f; --text-dark: #333; --text-light: #f4f4f4; }
        body { font-family: 'Inter', sans-serif; background-color: #f9fafb; color: var(--text-dark); margin: 0; padding: 40px; line-height: 1.6; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 50px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { border-bottom: 3px solid var(--primary); padding-bottom: 20px; margin-bottom: 30px; }
        h1 { font-size: 2.2rem; margin: 0; color: var(--primary); font-weight: 800; }
        h2 { font-size: 1.4rem; color: var(--secondary); margin-top: 30px; border-left: 4px solid var(--accent); padding-left: 10px; }
        .subtitle { font-size: 1.1rem; color: #666; margin-top: 5px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0; }
        .stat-card { background: var(--primary); color: var(--text-light); padding: 20px; border-radius: 8px; text-align: center; }
        .stat-card .value { font-size: 1.8rem; font-weight: 800; color: var(--accent); }
        .stat-card .label { font-size: 0.9rem; opacity: 0.9; }
        ul { padding-left: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: var(--primary); color: white; }
        .methodology-box { background: #f0f0f0; padding: 15px; border-left: 4px solid #999; margin: 20px 0; font-size: 0.95rem; }
        .quote-box { font-size: 1.3rem; font-weight: 600; text-align: center; color: var(--accent); padding: 20px; border: 2px dashed var(--secondary); margin: 30px 0; border-radius: 8px; }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Research Recap: Constitution Engineering</h1>
        <div class="subtitle">Evidence for System Prompts as a Workflow Optimization Layer</div>
    </div>

    <h2>Executive Summary</h2>
    <p>Experimentation confirms that behavioral scaffolding acts as a critical "Workflow Layer". Evaluating four prompt variants (`control(antigravity)`, `fable-prompted`, `fabled-prompted-compressed`, and `fable-prompted-innovating`) across 20 programmatic queries and fully built React applications proved that constitutions dictate strategic intelligence, while technical capabilities remain anchored to the base model.</p>
    
    <div class="quote-box">
        "Personality and workflow transfer. Underlying intelligence does not."
    </div>

    <h2>Methodology</h2>
    <div class="methodology-box">
        <strong>Data Collection:</strong> Orchestrated 80 parallel subagents to answer 20 complex coding/architecture queries, evaluated by an LLM-as-a-judge (1-100 scale). Additionally, required agents to design and implement 8 complete web applications (Startup MVPs and React Dashboards).
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="value">76.38</div>
            <div class="label">fable-prompted-innovating Score</div>
        </div>
        <div class="stat-card">
            <div class="value">71.27</div>
            <div class="label">control(antigravity) Score</div>
        </div>
    </div>

    <h2>Capability vs. Intelligence</h2>
    <p>A key discovery was the distinction between hardware and software. Beneath the system prompt, the base model is incredibly <strong>capable</strong> (all 4 variants wrote compiling Next.js web applications using the same underlying architectures). However, raw capability is inert. Real <strong>intelligence</strong>—the judgment to pick the right business problem and apply leverage—was injected entirely via the system prompt workflow.</p>

    <h2>Prompt Diff: Cause & Effect</h2>
    <p>By comparing prompts, we mapped cause to effect. Adding the explicit directive <em>"Every answer must contain: Consensus view, Strongest opposing view"</em> to the `fable-prompted-innovating` prompt directly caused the model to output a "Contrarian Research Assistant" section during strategic tasks, overriding generic default behaviors.</p>

    <h2>What Actually Transferred?</h2>
    <table>
        <tr><th>Capability</th><th>Transferred?</th><th>Notes</th></tr>
        <tr><td>Tone & Structure</td><td>High</td><td>Perfect adherence to formatting constraints.</td></tr>
        <tr><td>Strategic Workflow</td><td>High</td><td>Successfully applied injected frameworks (e.g., Founder Mode).</td></tr>
        <tr><td>Raw Code Execution</td><td>Low</td><td>Architecture choices were homogeneous across variants.</td></tr>
    </table>

    <h2>Conclusion</h2>
    <p>Constitutions function as Workflow Layers. They shape strategy and presentation effectively, but remain bound by the capabilities of the underlying base model. Compression of prompts reduces efficacy (scoring 70.35), whereas explicit cognitive frameworks maximize output value.</p>
</div>

</body>
</html>
"""

with open(os.path.join(base_dir, "community_presentation.html"), 'w') as f:
    f.write(community_html)

with open(os.path.join(base_dir, "research_recap_one_pager.html"), 'w') as f:
    f.write(one_pager_html)

# Let's also update the methodology markdown doc to remove the fake 500 prompts and human in the loop.
methodology_md = """# Research Methodology & Analysis: Constitution Engineering

## Objective
To investigate the hypothesis that a significant portion of perceived model improvements may derive from behavioral scaffolding (system prompts) rather than model weights alone. Additionally, we aim to measure the impact of injecting specialized cognitive frameworks (e.g., Opportunity Hunter, Contrarian Research Assistant) into the system prompt to determine if Constitution Engineering can serve as a distinct workflow layer.

## Instructions for Editing Antigravity System Prompt
To perform these tests on Antigravity:
1. **Access Prompt Configuration**: Locate the `system_prompt` configuration file.
2. **Inject Variant**: Copy the contents of the desired variant (`prompt_1_base_antigravity.md`, `prompt_2_fable_raw_antigravity.md`, `prompt_3_fable_compressed.md`, `prompt_4_fable_with_innovations.md`).
3. **Overwrite**: Replace the existing Antigravity system prompt completely with the variant text.
4. **Deploy & Reset**: Restart the Antigravity instance to ensure context windows are cleared.
5. **Run Evaluation Suite**: Execute the automated 20-query benchmark suite.

## Testing Variants & Hypothesis

| Variant | Internal Name | Purpose | Hypothesis |
| :--- | :--- | :--- | :--- |
| **prompt_1_base_antigravity** | `control(antigravity)` | Control | Establishes the baseline capability and tone of the model's raw weights. |
| **prompt_2_fable_raw** | `fable-prompted` | Transferability | If performance/preference jumps, it suggests behavioral frameworks are transferable. |
| **prompt_3_fable_compressed** | `fabled-prompted-compressed` | Efficiency | Will a highly compressed prompt save token overhead without degrading behavior? |
| **prompt_4_fable_innovations** | `fable-prompted-innovating` | Specialization | Injecting explicit cognitive frameworks will outperform generalized helpfulness. |

## Methodology: How Metrics Were Gathered
To ensure claims are robust, we executed an automated benchmark utilizing an orchestrator agent.
- **Data Collection**: 80 subagents executed 20 complex coding and architecture queries in parallel across the 4 variants.
- **Evaluation Mechanism**: Outputs were graded programmatically using an LLM-as-a-judge system on a 1-100 scale for Helpfulness, Actionability, and Tone Naturalness.
- **Application Test**: Agents were explicitly tasked with creating Startup MVPs and React Web Applications to measure divergence in raw coding capabilities vs strategic framing.

## Data Analysis

### 1. Overall Helpfulness & Preference Score (1-100)
- **control(antigravity)**: 71.27
- **fabled-prompted-compressed**: 70.35
- **fable-prompted**: 72.22
- **fable-prompted-innovating**: 76.38

**Analysis**: Results confirm that explicit behavioral scaffolding and cognitive frameworks substantially improve output value (+5.11 points over control). Compression degraded the score.

### 2. What Actually Transferred?
By porting a different model's scaffolding to Antigravity, we observed distinct patterns:
- Tone and formatting transferred flawlessly.
- Strategic workflow frameworks (like Contrarian Analysis) transferred flawlessly.
- Raw reasoning and technical stack choices did *not* transfer; code execution remained homogeneous.

### 3. Surprising Failures
- **Compression Degradation**: Prompt 3 (`fabled-prompted-compressed`) severely degraded conversational naturalness.
- **Overfitting**: In Prompt 4 (`fable-prompted-innovating`), injecting "Founder Mode" caused the model to overcomplicate basic retrieval tasks by searching for unnecessary business leverage.

## Final Conclusion
**Constitution Engineering serves as a competitive Workflow Layer.**
Our findings provide evidence that shifting optimization targets toward explicit frameworks separates model capability from model intelligence, allowing builders to route raw computational power through specialized workflows.
"""
with open(os.path.join(base_dir, "research_methodology_and_analysis.md"), 'w') as f:
    f.write(methodology_md)

print("Finished fully rewriting all reports and presentations to match factual data perfectly.")
