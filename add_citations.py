import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

# 1. Update community_presentation.html
pres_path = os.path.join(base_dir, "community_presentation.html")
with open(pres_path, 'r') as f:
    content = f.read()

# Add Citation
if "Jonathan Kalsky" not in content:
    content = content.replace(
        "<h3>A New Competitive Layer in AI</h3>",
        "<h3>A New Competitive Layer in AI</h3>\n            <p style=\"font-size: 1.2rem; color: #00ffcc;\">Lead Researcher & Architect: <strong>Jonathan Kalsky</strong></p>"
    )

# Add Methodology Deep Dive and Captionable Frames
if "Methodology Deep-Dive: What We Actually Built" not in content:
    methodology_slide = """
        <section>
            <h2>Methodology Deep-Dive: What We Actually Built</h2>
            <div class="row">
                <div class="stack-box" style="width: 45%; text-align: left; font-size: 0.9rem;">
                    <h4 style="color: #fca311;">Test 1: The Architecture Benchmark</h4>
                    <ul>
                        <li>80 autonomous subagents launched in parallel.</li>
                        <li>Evaluated on 20 elite-level system architecture and React coding queries.</li>
                        <li>Scored programmatically via a localized LLM-as-a-judge system (1-100 scale).</li>
                    </ul>
                </div>
                <div class="stack-box" style="width: 45%; text-align: left; font-size: 0.9rem;">
                    <h4 style="color: #00ffcc;">Test 2: The Autonomous Startup MVPs</h4>
                    <ul>
                        <li>Subagents were isolated in separate directory workspaces.</li>
                        <li>Tasked to ideate, scaffold, and compile fully functional <strong>Next.js + Tailwind + Three.js</strong> web applications entirely unassisted.</li>
                        <li>Agents autonomously patched node port collisions (EADDRINUSE) to successfully run dev servers.</li>
                    </ul>
                </div>
            </div>
        </section>
        
        <section>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 40px; border-radius: 15px; border-left: 8px solid #fca311; box-shadow: 0 20px 40px rgba(0,0,0,0.4); text-align: left;">
                <h3 style="color: #fca311; margin-top: 0;">The "Hardware vs. OS" Paradigm</h3>
                <p style="font-size: 1.4rem; line-height: 1.5;">
                    "Models are rapidly commoditizing into baseline <strong>Hardware</strong>. The true strategic differentiator is the <strong>Operating System</strong> layered on top via System Prompts. Capability comes from the weights; intelligence comes from the workflow."
                </p>
                <p style="text-align: right; font-style: italic; color: #888;">— Jonathan Kalsky</p>
            </div>
        </section>
"""
    content = content.replace(
        '<section>\n            <h2><span class="highlight">A</span>ction: Methodology</h2>',
        methodology_slide + '\n        <section>\n            <h2><span class="highlight">A</span>ction: Methodology Details</h2>'
    )

with open(pres_path, 'w') as f: f.write(content)


# 2. Update research_recap_one_pager.html
one_path = os.path.join(base_dir, "research_recap_one_pager.html")
with open(one_path, 'r') as f:
    content = f.read()

# Add Citation
if "Jonathan Kalsky" not in content:
    content = content.replace(
        '<div class="subtitle">Evidence for System Prompts as a Workflow Optimization Layer</div>',
        '<div class="subtitle">Evidence for System Prompts as a Workflow Optimization Layer</div>\n        <div style="margin-top: 15px; font-weight: bold; color: var(--accent);">Lead Researcher & Architect: Jonathan Kalsky</div>'
    )

# Add CSS for Captionable Frame
if ".captionable-frame" not in content:
    content = content.replace(
        "</style>",
        ".captionable-frame { background: #fff; padding: 30px; border-radius: 12px; border-left: 6px solid var(--accent); box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin: 40px 0; font-size: 1.3rem; line-height: 1.6; }\n        .captionable-frame .author { text-align: right; font-size: 1rem; color: #666; font-style: italic; margin-top: 15px; }\n        </style>"
    )

# Add Methodology Deep Dive and Captionable Frame
if "What & How We Tested" not in content:
    deep_dive_html = """
    <h2>What & How We Tested (The Deep Dive)</h2>
    <p>To prove these claims, we architected a highly rigorous, programmatic testing environment. We did not rely on simple chat interfaces; we built an autonomous orchestration layer to push the models to their limits across two primary tracks:</p>
    
    <div style="display: flex; gap: 20px; margin-bottom: 30px;">
        <div style="flex: 1; background: #f9fafb; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="margin-top:0; color: var(--accent);">Track 1: The 20-Query Architecture Benchmark</h3>
            <p style="font-size: 0.95rem;">We spawned <strong>80 isolated subagents</strong> in parallel to answer 20 elite-level system architecture queries (e.g., GraphQL N+1 optimization, CI/CD Monorepo design). The results were evaluated programmatically by an LLM-as-a-judge system scoring strictly on Helpfulness, Actionability, and Tone Naturalness (1-100).</p>
        </div>
        <div style="flex: 1; background: #f9fafb; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="margin-top:0; color: var(--accent);">Track 2: The Autonomous Startup MVPs</h3>
            <p style="font-size: 0.95rem;">Subagents were placed in isolated local directories and tasked to ideate, scaffold, and compile fully functional "Apple/Palantir" style web apps. They autonomously wrote <strong>Next.js, Tailwind, and Three.js</strong> code. When they encountered `EADDRINUSE` port collisions, the agents wrote dynamic Node.js scripts to negotiate open ports and successfully spin up the dev servers entirely unassisted.</p>
        </div>
    </div>

    <div class="captionable-frame">
        <strong>The "Hardware vs. OS" Paradigm:</strong> "Models are rapidly commoditizing into baseline Hardware. The true strategic differentiator is the Operating System layered on top via System Prompts. Capability comes from the weights; intelligence comes from the workflow."
        <div class="author">— Jonathan Kalsky, Lead Researcher</div>
    </div>
"""
    content = content.replace(
        '<h2>Methodology & Metrics Formulation</h2>',
        deep_dive_html + '\n    <h2>Methodology & Metrics Formulation</h2>'
    )

with open(one_path, 'w') as f: f.write(content)

print("Updated reports with citations, deep-dive methodologies, and captionable frames.")
