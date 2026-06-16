import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

# 1. Update Executive Summary
exec_sum_path = os.path.join(base_dir, "1_Executive_Summary.md")
with open(exec_sum_path, 'r') as f:
    exec_content = f.read()

new_exec = exec_content.replace("## Core Findings", """## Core Findings

### The Capability vs. Intelligence Paradigm
The most profound discovery is the distinction between **Capability** and **Intelligence**. Beneath the system prompt, the base model is incredibly *capable*—it successfully architected and compiled complex Next.js applications, generated boilerplate, and configured databases flawlessly regardless of which system prompt it was given. 
However, it is fundamentally *inert*. Real **intelligence**—the ability to apply judgment, discern business leverage, and identify the *right* problem to solve—is heavily dictated by the Constitution. The model's weights provide the engine, but the system prompt provides the steering wheel.

## Core Findings""")

with open(exec_sum_path, 'w') as f:
    f.write(new_exec)


# 2. Update Research Findings Report
res_find_path = os.path.join(base_dir, "2_Research_Findings_Report.md")
with open(res_find_path, 'r') as f:
    res_content = f.read()

new_res = res_content.replace("## 2. Transferability Analysis", """## 1.5 Prompt Diff Analysis: What Actually Drove the Change?
By comparing `prompt_4_fable_with_innovations.md` to `prompt_2_fable_raw_antigravity.md`, we can explicitly trace cause and effect. 
The `innovations` prompt newly introduced three strict directives:
1. **Contrarian Research Assistant**: *"Every answer must contain: Consensus view, Strongest opposing view, Unknowns, What would change the conclusion."*
2. **Opportunity Hunter**: *"Every response should identify hidden leverage."*
3. **Founder Mode**: *"Whenever the user describes a problem, search for a business opportunity hidden inside it."*

**The Effect:** During the Startup MVP benchmark, the `fable_innovations` subagent explicitly outputted a "Contrarian Research Assistant Output" section with exact headers matching the prompt (Consensus, Opposing View, Unknowns). By contrast, the `fable_raw` and `control` subagents completely lacked this structure, defaulting to generic answers. The model didn't get smarter; it was simply commanded to execute a smarter workflow.

## 2. Transferability Analysis""")

with open(res_find_path, 'w') as f:
    f.write(new_res)


# 3. Update Community Presentation (HTML)
pres_path = os.path.join(base_dir, "community_presentation.html")
with open(pres_path, 'r') as f:
    pres_content = f.read()

new_pres = pres_content.replace('<!-- THE VIRAL TAKEAWAY -->', """<!-- CAPABILITY VS INTELLIGENCE -->
        <section>
            <h2>Capability vs. Intelligence</h2>
            <p>Beneath the prompt, the model is merely <span class="highlight">capable</span>, not <span class="highlight">intelligent</span>.</p>
            <ul>
                <li class="fragment"><strong>Capability (Hardware):</strong> All 4 variants successfully wrote complex, compiling Next.js + Tailwind React applications. The base weights can *code*.</li>
                <li class="fragment"><strong>Intelligence (OS):</strong> Only the Innovations prompt identified high-leverage business opportunities and contrarian angles. The OS provides the *judgment*.</li>
            </ul>
        </section>
        
        <!-- PROMPT DIFF -->
        <section>
            <h2>Prompt Diff: Cause & Effect</h2>
            <p>What changed in the Innovations prompt?</p>
            <div class="output-box fragment" style="font-size: 0.8rem;">
                + "Every answer must contain: Consensus view, Strongest opposing view..."<br>
                + "Every response should identify hidden leverage."
            </div>
            <p class="fragment" style="font-size: 1rem;"><strong>Result:</strong> The agent literally outputted these exact headers in the Startup Benchmark, forcing a smarter decision workflow.</p>
        </section>

        <!-- THE VIRAL TAKEAWAY -->""")

with open(pres_path, 'w') as f:
    f.write(new_pres)


# 4. Update One Pager (HTML)
one_pager_path = os.path.join(base_dir, "research_recap_one_pager.html")
with open(one_pager_path, 'r') as f:
    one_content = f.read()

new_one = one_content.replace('<h2>What Actually Transferred?</h2>', """<h2>Capability vs. Intelligence</h2>
    <p>A key discovery was the distinction between hardware and software. Beneath the system prompt, the base model is incredibly <strong>capable</strong> (all 4 variants wrote compiling Next.js web applications). However, raw capability is inert. Real <strong>intelligence</strong>—the judgment to pick the right business problem and apply leverage—was injected entirely via the system prompt. By adding specific directives like <em>"Every answer must contain: Consensus view, Strongest opposing view"</em> to the Innovations prompt, the model was forced to execute a superior cognitive workflow, resulting in drastically higher value output.</p>

    <h2>What Actually Transferred?</h2>""")

with open(one_pager_path, 'w') as f:
    f.write(new_one)

print("Updated findings, summaries, and presentations successfully.")
