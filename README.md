# Antigravity: The Constitution Layer as an Agentic Operating System
An empirical study on the behavioral portability and limits of model-level alignment directives across diverse LLM substrates.

---

## Author & Principal Architect
* **Jonathan Kalsky** 
  * *Lead Researcher & Systems Architect*
  * Contact/Portfolio: [Insert link or email if desired, or keep as name-only representation]

---

## Overview
This repository contains the complete experimental findings, methodology, deliverables, and sandbox workspaces from the **Antigravity** project. 

The project evaluates a core architectural thesis: **the Constitution Layer acts as a Software/OS layer sitting on top of the raw hardware/compute layer of underlying LLM intelligence**. Specifically, we investigate how effectively behavior, workflow preferences, and tone transfer between different agent substrates when guided by identical constitutional constraints—and analyze the threshold where underlying substrate intelligence becomes the limiting bottleneck.

---

## Repository Structure

The codebase is organized into modular directories at the root level, preserving access hierarchies while keeping key research assets easy to locate:

* 📄 **[`reports/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/reports/)**: Scientific and experimental reports detailing the core findings.
  * [`1_Executive_Summary.md`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/reports/1_Executive_Summary.md) — Main overview of the experimental findings.
  * [`2_Research_Findings_Report.md`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/reports/2_Research_Findings_Report.md) — Deep dive into behavioral patterns and portability findings.
  * [`3_Behavioral_Divergence_Report.md`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/reports/3_Behavioral_Divergence_Report.md) — Analysis of substrate-dependent behavioral drift.
  * [`4_Constitution_as_OS_Assessment.md`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/reports/4_Constitution_as_OS_Assessment.md) — Evaluation of the "Constitution-as-an-OS" paradigm.
  * [`5_Failure_Analysis.md`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/reports/5_Failure_Analysis.md) — Breakdown of system failure modes, including context-compression degradation.
  * [`6_Recommendations_for_Next_Experiments.md`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/reports/6_Recommendations_for_Next_Experiments.md) — Directions for future research iterations.
  * [`research_methodology_and_analysis.md`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/reports/research_methodology_and_analysis.md) — Details on the proposed experimental setup vs. observed results.
* 📊 **[`presentations/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/presentations/)**: HTML-based visual deliverables.
  * [`community_presentation.html`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/presentations/community_presentation.html) — Slide deck for presenting research findings.
  * [`research_recap_one_pager.html`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/presentations/research_recap_one_pager.html) — Interactive high-density summary page.
* 💡 **[`prompts/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/prompts/)**: The raw constitutional files and benchmarking templates used.
* 🛠️ **[`scripts/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/scripts/)**: Automated utilities for data extraction, chart formatting, and text polishing.
* 🖼️ **[`assets/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/assets/)**: Visual charts and empirical data plots.
* 🧪 **[`experiment/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/)**: The active experimental workspace.
  * [`specs/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/specs/) — Test requirements, procedures, and architectural proposals.
  * [`scripts/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/scripts/) — Evaluation harnesses and batch-saving utilities.
  * [`raw_data/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/raw_data/) — Evaluation logs and raw quantitative scores.
  * [`raw_outputs/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/raw_outputs/) — Direct generated answers separated by tested LLM model.
  * Workspaces under evaluation:
    * [`control_workspace/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/control_workspace/)
    * [`fable_raw_workspace/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/fable_raw_workspace/)
    * [`fable_compressed_workspace/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/fable_compressed_workspace/)
    * [`fable_innovations_workspace/`](file:///Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/fable_innovations_workspace/)

---

## Citation & Academic Reference
If you build upon this research, utilize the datasets, or reference the "Constitution-as-an-OS" framing in your work, please cite the primary investigator:

```bibtex
@misc{kalsky2026antigravity,
  author       = {Jonathan Kalsky},
  title        = {Antigravity: The Constitution Layer as an Agentic Operating System},
  year         = {2026},
  publisher    = {GitHub},
  journal      = {GitHub Repository},
  howpublished = {\url{https://github.com/jonathankalsky/F4b13-5-4-Antigravity}}
}
```

---

## Collaborations and Future Usages
We encourage the community to leverage and extend the Antigravity framework:
1. **Alternative LLM Substrate Benchmarking**: Test these constitutions against new model releases and submit behavioral convergence data.
2. **Context Compression Research**: Fork this repository to test the thresholds where high-density behavioral directives degrade due to long-context attention thinning.
3. **Agentic System Design**: Integrate these design patterns into your own production agent workflows to enforce strict behavioral consistency.

For inquiries regarding research collaborations, speaking engagements, or commercial systems architecture consulting, please contact Jonathan Kalsky.
