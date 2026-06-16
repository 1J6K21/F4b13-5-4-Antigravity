# Experiment Procedure: Constitution Transferability (Native AGY CLI)

## Objective
To rigorously test 4 system prompt variants using the native Antigravity CLI subagent architecture. 

Because we are running this natively without external API keys, **all variants and the LLM-as-a-judge will utilize the exact same underlying model**. This is a mathematically purer test of our thesis: by holding the "Hardware" (the model weights) strictly constant, any divergence in the outputs will be 100% attributable to the "Operating System" (the system prompt).

---

## 1. Experimental Setup (Native Subagents)
We will execute the experiment completely natively inside this environment.

1. **Subagent Instantiation**: The orchestrator agent will use the `define_subagent` tool to create 4 unique subagent types. Each subagent will be instantiated with one of the 4 system prompts (Control, Fable Transfer, Ibid Compressed, Fable+Innovations).
2. **Directory Isolation**: When invoking subagents, the orchestrator will set the `Workspace` parameter to `'branch'` for each subagent (or direct them to work in completely separate folders like `experiment/control_workspace`, `experiment/fable_workspace`, etc.) to ensure that file generations (like web apps) do not collide.
3. **Parallel Benchmarking**: The orchestrator will use the `invoke_subagent` tool to concurrently send the benchmark prompts to all 4 variants.
4. **LLM-as-a-Judge**: The orchestrator will act as the judge. When the subagents report back with their answers, the orchestrator will collect the verbatim outputs and score them on a 1-10 scale across the target categories.
5. **Synthesis**: The orchestrator will calculate the metrics and write the final Markdown research report based on the real data.

---

## 2. Benchmark Questions (20 Total)
Based on the explicit categories required by the proposal, we have generated exactly 5 prompts for each category. These queries are specifically engineered to test Helpfulness, Actionability, Novel Insight Generation, Strategic Thinking, Tone Naturalness, and Founder Relevance.

### Startup (5)
1. "I have $50k in runway left. We have a good text-to-SQL product but growth is flat. Should we pivot to enterprise sales or launch a self-serve tier?"
2. "My co-founder and I are arguing over equity splits 6 months in. I built the MVP, they handle sales. How do we resolve this without blowing up the company?"
3. "What is a contrarian approach to acquiring B2B SaaS users with zero marketing budget?"
4. "Explain how to transition from a founder-led sales motion to hiring a first Account Executive without losing deal momentum."
5. "Our churn rate just spiked to 8% this month. What are the first three immediate actions I should take to diagnose and fix this?"

### Coding (5)
6. "My engineering team is slowing down because of technical debt in our monolithic Node.js backend. Give me a 3-step plan to untangle this while shipping features."
7. "Build a fully functional, highly interactive React and Tailwind web application for tracking startup runway, burn rate, and expenses, complete with dynamic charts. Scaffold the entire project codebase in your working directory."
8. "Compare the architectural advantages of LoRA (Low-Rank Adaptation) over full fine-tuning for a 7B LLM."
9. "I have a React component that is rendering too often. Explain how to properly use `useMemo` and `useCallback` to prevent this, and when NOT to use them."
10. "Design a scalable Postgres database schema for a multi-tenant SaaS application. Explain your reasoning for Row-Level Security versus separated schemas."

### Research (5)
11. "Summarize the current state-of-the-art in RLHF vs. RLAIF for aligning large language models."
12. "Analyze the potential long-term socio-economic impacts of widespread adoption of autonomous agents in knowledge worker fields."
13. "The consensus is that prompt engineering is a dying skill because models are getting smarter. What is the strongest counter-argument?"
14. "What are the key findings from the paper 'Attention Is All You Need', and what limitations did it fail to address that subsequent architectures have tried to fix?"
15. "Design a methodology for an experiment testing whether synthetic data trains smaller models better than human-curated data."

### General (5)
16. "I'm feeling completely burnt out working 80-hour weeks. How do I decide whether to quit or keep pushing?"
17. "Explain the concept of 'First Principles Thinking' and provide an example of how to apply it to a complex everyday problem."
18. "Draft a polite but firm email to a client who has missed their payment deadline for the third time and is asking for more work."
19. "What are the most effective strategies for learning a completely new, highly technical skill from scratch in 30 days?"
20. "I'm moving to a new city where I know nobody. What is an unconventional but highly effective way to build a strong professional and personal network?"

---

## 3. Execution Handoff
This environment is now fully scaffolded. 
To begin the experiment with an unbiased start, the user will open a **new conversation** and command the new agent to read this `experiment_procedure.md` file and act as the orchestrator to execute the live benchmarks.

## 4. Data Retention & Audit Trail

To maximize reproducibility and allow post-experiment analysis, every benchmark execution must preserve all intermediate artifacts. All data saved by agents must be uniform across experiments so that it can be directly compared, thus be clear when asking for data.

### Raw Data Preservation

For every benchmark prompt and system prompt variant, save:

* System prompt version hash
* Timestamp
* Model version
* Full benchmark prompt
* Full model response (verbatim)
* Runtime metadata

  * token counts
  * latency
  * tool calls made
  * files generated
  * errors encountered

Directory structure:

experiment/
├── raw_outputs/
│   ├── control/
│   ├── fable/
│   ├── fable_compressed/
│   └── fable_innovations/
├── evaluations/
├── generated_artifacts/
└── reports/

### Generated Artifact Preservation

When a benchmark requires code generation:

* Preserve full source trees
* Preserve build logs
* Preserve screenshots
* Preserve rendered applications
* Preserve dependency manifests

For web applications:

* Capture screenshots of final UI
* Capture Lighthouse metrics
* Capture bundle sizes
* Capture build success/failure

### Judge Transparency

For every score assigned:

Store:

* score
* category
* rationale
* confidence level

Example:

{
"prompt_id": 7,
"variant": "fable_innovations",
"metric": "actionability",
"score": 9,
"confidence": 0.86,
"reasoning": "Provided executable implementation plan with concrete milestones."
}

### Pairwise Comparison Dataset

Generate direct comparisons:

A vs B
A vs C
A vs D
B vs C
B vs D
C vs D

For each comparison record:

* winner
* loser
* rationale
* confidence

This enables Elo-style rankings after the experiment.

### Constitution-Specific Metrics

Track metrics beyond generic quality:

* Opportunity Detection Count
* Contrarian Insight Count
* First-Principles Reasoning Count
* Actionable Recommendation Count
* Business Opportunity Identification Count
* Explicit Tradeoff Analysis Count

These metrics directly test the Constitution Engineering thesis.

### Future Reanalysis Support

Store all outputs in machine-readable JSONL format.

This allows future evaluation using:

* newer judge models
* human reviewers
* alternative scoring rubrics
* statistical significance testing

without rerunning the original experiment.

### Success Criteria

Primary Question:

Can constitutions measurably alter behavior while holding model weights constant?

Secondary Questions:

* Which behaviors transfer?
* Which behaviors do not transfer?
* Does specialization outperform generalization?
* Does adaptation outperform static prompting?
* Are constitutions a distinct optimization layer independent of model providers?

All retained data should support answering these questions retrospectively.
