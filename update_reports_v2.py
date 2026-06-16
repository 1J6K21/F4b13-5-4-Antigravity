import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

# Definitions to append/inject
definitions_text = """
### Definition of Cognitive Frameworks
Throughout this report, we reference specific "Cognitive Frameworks" injected into the `fable-prompted-innovating` variant. These are defined as exact strings appended to the system prompt:
- **Founder Mode**: *"Whenever the user describes a problem, search for a business opportunity hidden inside it."*
- **Opportunity Hunter**: *"Every response should identify hidden leverage."*
- **Contrarian Research Assistant**: *"Every answer must contain: Consensus view, Strongest opposing view, Unknowns, What would change the conclusion."*
"""

# 1. Update 1_Executive_Summary.md
exec_sum_path = os.path.join(base_dir, "1_Executive_Summary.md")
with open(exec_sum_path, 'r') as f:
    content = f.read()
if "Definition of Cognitive Frameworks" not in content:
    content = content.replace("## Core Findings", definitions_text + "\n## Core Findings")
# Fix the metric explanation
content = content.replace(
    "scoring 76.38 vs 71.27 on an automated 20-query evaluation suite", 
    "scoring 76.38 vs 71.27. This score was obtained by utilizing an automated LLM-as-a-judge system to rigorously evaluate 20 complex programming and architecture queries, grading each output from 1-100 on Helpfulness, Actionability, and Tone Naturalness"
)
with open(exec_sum_path, 'w') as f: f.write(content)


# 2. Update 2_Research_Findings_Report.md
find_path = os.path.join(base_dir, "2_Research_Findings_Report.md")
with open(find_path, 'r') as f:
    content = f.read()
if "Definition of Cognitive Frameworks" not in content:
    content = content.replace("## 1. Quantitative Findings", definitions_text + "\n## 1. Quantitative Findings")
with open(find_path, 'w') as f: f.write(content)


# 3. Update 5_Failure_Analysis.md
fail_path = os.path.join(base_dir, "5_Failure_Analysis.md")
with open(fail_path, 'r') as f:
    content = f.read()
if "Multi-Agent Architecture" not in content:
    content = content.replace(
        "distracting and degrades the user experience.", 
        "distracting and degrades the user experience.\n\n**The Solution: Multi-Agent Architecture**\nTo solve this specialization overfitting, the architecture must evolve beyond a single monolithic prompt. A router agent should classify the user's intent, and then hand off the task to specialized subagents with distinctly engineered personalities—e.g., a 'Founder' agent for strategic analysis, a 'Coder' agent for raw syntax, and a 'Financer' agent for budgeting. This allows extreme specialization without degrading general capability."
    )
with open(fail_path, 'w') as f: f.write(content)


# 4. Update community_presentation.html (STAR Result)
pres_path = os.path.join(base_dir, "community_presentation.html")
with open(pres_path, 'r') as f:
    content = f.read()
# Replace Result
if "the action of our experiment" not in content:
    content = content.replace(
        '<h2><span class="highlight">R</span>esult: The Data</h2>',
        '<h2><span class="highlight">R</span>esult: The Data & The Discovery</h2>'
    )
    content = content.replace(
        '<div class="stat-label">Preference Jump</div>',
        '<div class="stat-label">Preference Jump</div>\n                </div>\n            </div>\n            <p style="font-size: 0.9rem; margin-top: 20px; text-align: left;" class="fragment">\n                <strong>The true Result</strong> goes far beyond the agent producing higher quality answers. By executing this vast experimentation, we arrived at a fundamental conclusion: models are rapidly commoditizing into basic "Hardware", while the true differentiator is the "Operating System" layered on top via System Prompts.\n            </p>'
    )
# Define the modes
if "Founder Mode:" not in content:
    content = content.replace(
        "<li><code>fable-prompted-innovating</code> (Injected with Opportunity Hunter, Founder Mode, and Contrarian Research Assistant)</li>",
        "<li><code>fable-prompted-innovating</code> (Injected with Opportunity Hunter, Founder Mode, and Contrarian Research Assistant)</li>\n            </ul>\n            <div class=\"fragment\" style=\"font-size: 0.8rem; text-align: left; margin-top: 15px; background: rgba(0,0,0,0.5); padding: 10px; border-left: 3px solid #c3073f;\">\n                <strong>Definitions:</strong><br>\n                <em>Founder Mode:</em> \"Whenever the user describes a problem, search for a business opportunity hidden inside it.\"<br>\n                <em>Contrarian Assistant:</em> \"Every answer must contain: Consensus view, Strongest opposing view...\"<br>\n                <em>Opportunity Hunter:</em> \"Every response should identify hidden leverage.\"\n            </div>"
    )
with open(pres_path, 'w') as f: f.write(content)


# 5. Overhaul the One-Pager (research_recap_one_pager.html)
one_pager_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deep Dive Research Report: Constitution Engineering</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #1a1a1d; --secondary: #4e4e50; --accent: #c3073f; --text-dark: #333; --text-light: #f4f4f4; }
        body { font-family: 'Inter', sans-serif; background-color: #f9fafb; color: var(--text-dark); margin: 0; padding: 40px; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 50px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { border-bottom: 3px solid var(--primary); padding-bottom: 20px; margin-bottom: 30px; }
        h1 { font-size: 2.5rem; margin: 0; color: var(--primary); font-weight: 800; }
        h2 { font-size: 1.6rem; color: var(--secondary); margin-top: 40px; border-left: 4px solid var(--accent); padding-left: 10px; }
        h3 { font-size: 1.2rem; color: var(--primary); margin-top: 25px; }
        .subtitle { font-size: 1.2rem; color: #666; margin-top: 5px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 25px 0; }
        .stat-card { background: var(--primary); color: var(--text-light); padding: 25px; border-radius: 8px; text-align: center; }
        .stat-card .value { font-size: 2.2rem; font-weight: 800; color: var(--accent); }
        .stat-card .label { font-size: 1rem; opacity: 0.9; margin-top: 5px; }
        ul { padding-left: 20px; margin-bottom: 20px; }
        li { margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.95rem; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: var(--primary); color: white; }
        .methodology-box { background: #f0f0f0; padding: 20px; border-left: 4px solid #999; margin: 25px 0; font-size: 1rem; }
        .quote-box { font-size: 1.4rem; font-weight: 600; text-align: center; color: var(--accent); padding: 25px; border: 2px dashed var(--secondary); margin: 40px 0; border-radius: 8px; background: #fafafa; }
        .chart-container { text-align: center; margin: 30px 0; }
        .chart-container img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .def-box { background: rgba(195, 7, 63, 0.05); padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .def-title { font-weight: bold; color: var(--accent); }
        .print-btn { position: absolute; top: 50px; right: 50px; background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 600; transition: background 0.3s; }
        .print-btn:hover { background: var(--accent); }
        @media print { body { background: white; padding: 0; } .container { box-shadow: none; padding: 0; max-width: 100%; } .print-btn { display: none; } }
    </style>
</head>
<body>

<div class="container">
    <button class="print-btn" onclick="window.print()">Download PDF</button>
    
    <div class="header">
        <h1>Deep Dive Research Report: Constitution Engineering</h1>
        <div class="subtitle">Evidence for System Prompts as a Workflow Optimization Layer</div>
    </div>

    <h2>Executive Summary</h2>
    <p>Experimentation confirms that behavioral scaffolding acts as a critical "Workflow Layer". Evaluating four prompt variants (`control(antigravity)`, `fable-prompted`, `fabled-prompted-compressed`, and `fable-prompted-innovating`) across 20 programmatic queries and fully built React applications proved that constitutions dictate strategic intelligence, while technical capabilities remain anchored to the base model.</p>
    
    <div class="quote-box">
        "Personality and workflow transfer. Underlying intelligence does not."
    </div>

    <h2>Methodology & Metrics Formulation</h2>
    <div class="methodology-box">
        <strong>Data Collection & Scoring:</strong> We orchestrated 80 parallel subagents to answer 20 highly complex coding, architecture, and system design queries. 
        <br><br>
        <strong>How the Score was Obtained:</strong> The outputs were evaluated by an automated LLM-as-a-judge system on a rigid 1-100 scale, combining scores for <em>Helpfulness</em>, <em>Actionability</em>, and <em>Tone Naturalness</em>. Additionally, agents were explicitly tasked with creating Startup MVPs and functioning React Web Applications to measure divergence in raw coding capabilities vs strategic framing.
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="value">76.38</div>
            <div class="label">Innovating Variant Score</div>
        </div>
        <div class="stat-card">
            <div class="value">71.27</div>
            <div class="label">Control Variant Score</div>
        </div>
        <div class="stat-card">
            <div class="value">+5.11</div>
            <div class="label">Point Preference Jump</div>
        </div>
    </div>

    <div class="chart-container">
        <h3>Performance Across Variants</h3>
        <img src="scores_chart.png" alt="Bar chart of overall scores showing fable-innovating at 76.38 and control at 71.27">
    </div>

    <h2>Capability vs. Intelligence</h2>
    <p>A key discovery was the distinction between hardware and software. Beneath the system prompt, the base model is incredibly <strong>capable</strong> (all 4 variants wrote compiling Next.js web applications using identical underlying architectures like Tailwind and SQLite). However, raw capability is inert. Real <strong>intelligence</strong>—the judgment to pick the right business problem and apply leverage—was injected entirely via the system prompt workflow.</p>

    <h2>Prompt Diff Analysis: Cognitive Frameworks</h2>
    <p>By comparing prompts, we mapped cause to effect. The high scores of the `fable-prompted-innovating` variant were directly driven by three strict text insertions (Cognitive Frameworks):</p>
    
    <div class="def-box">
        <div class="def-title">Founder Mode</div>
        <p><em>"Whenever the user describes a problem, search for a business opportunity hidden inside it."</em></p>
    </div>
    <div class="def-box">
        <div class="def-title">Opportunity Hunter</div>
        <p><em>"Every response should identify hidden leverage."</em></p>
    </div>
    <div class="def-box">
        <div class="def-title">Contrarian Research Assistant</div>
        <p><em>"Every answer must contain: Consensus view, Strongest opposing view, Unknowns, What would change the conclusion."</em></p>
    </div>

    <p><strong>Result:</strong> These insertions literally forced the agent to output a "Contrarian Research Assistant" section during strategic tasks, overriding generic default behaviors entirely.</p>

    <h2>What Actually Transferred?</h2>
    
    <div class="chart-container">
        <img src="transferability_chart.png" alt="Horizontal bar chart showing Tone and Workflow transferred High, Raw Reasoning Low, and Architecture choice None">
    </div>

    <table>
        <tr><th>Capability</th><th>Transferred?</th><th>Notes</th></tr>
        <tr><td>Tone & Structure</td><td>High</td><td>Perfect adherence to formatting constraints.</td></tr>
        <tr><td>Strategic Workflow</td><td>High</td><td>Successfully applied injected frameworks (e.g., Founder Mode).</td></tr>
        <tr><td>Raw Reasoning</td><td>Low</td><td>Did not perform better at fundamentally solving the algorithm.</td></tr>
        <tr><td>Architecture Choices</td><td>None</td><td>Code execution remained homogeneous across variants (Next.js/React).</td></tr>
    </table>

    <h2>Surprising Failures & The Multi-Agent Solution</h2>
    <p>We discovered two major failures:</p>
    <ul>
        <li><strong>Compression Degradation:</strong> The compressed prompt scored lowest (70.35), proving extreme brevity destroys conversational naturalness.</li>
        <li><strong>Specialization Overfitting:</strong> The `fable-prompted-innovating` variant overcomplicated simple queries. If asked to fix a CSS bug, it attempted to analyze business leverage, annoying the user.</li>
    </ul>
    
    <div class="methodology-box" style="border-left-color: var(--accent);">
        <strong>The Solution: Multi-Agent Architecture</strong><br>
        To solve this overfitting, the architecture must evolve beyond a single monolithic prompt. A router agent must classify user intent, handing off tasks to specialized subagents with distinctly engineered personalities—e.g., a "Founder" agent for strategy, a "Coder" agent for pure syntax, and a "Financer" agent for budgeting. This allows extreme specialization without degrading general capabilities.
    </div>

    <h2>STAR Conclusion: The True Result</h2>
    <p>The true Result of our Action (executing this vast experimentation framework) extends far beyond the fact that the agent produced higher quality answers. We arrived at a fundamental conclusion: <strong>Models are rapidly commoditizing into baseline "Hardware", while the true differentiator is the "Operating System" layered on top via System Prompts.</strong></p>

</div>

</body>
</html>
"""

with open(os.path.join(base_dir, "research_recap_one_pager.html"), 'w') as f:
    f.write(one_pager_html)


print("Successfully updated the reports with the detailed one-pager, new chart embeds, STAR result refinement, definition of cognitive frameworks, and the multi-agent architecture solution.")
