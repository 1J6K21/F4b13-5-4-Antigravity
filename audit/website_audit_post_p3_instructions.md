# Independent Publication Audit

You are acting as a hostile but fair reviewer.

Assume this research is about to be published publicly on GitHub, Hacker News, X/Twitter, Reddit, LessWrong, AI engineering communities, and potentially viewed by researchers, founders, investors, and engineers.

Your task is NOT to improve the research.

Your task is to determine whether publication would survive scrutiny.

Review the entire website, report, one-pager, methodology, results, benchmarks, future work sections, presentations, and supporting materials.

Perform the review as if you were:

1. An AI researcher
2. A skeptical engineer
3. A startup founder
4. A Hacker News commenter
5. A LessWrong user
6. A journalist
7. A potential investor

For every section, identify:

* Overclaims
* Unsupported conclusions
* Missing evidence
* Hidden assumptions
* Biases
* Ambiguous language
* Credibility risks
* Statistical weaknesses
* Methodology flaws
* Reproducibility issues
* Potential public criticism
* Potential reputational risks

---

## Audit Categories

### 1. Credibility Audit

Identify every statement that could cause a reader to think:

* "This is exaggerated."
* "This wasn't actually tested."
* "The author is overstating the evidence."
* "This sounds stronger than the data supports."

For each issue:

* Quote the statement.
* Explain the problem.
* Provide a safer alternative.

---

### 2. Scientific Rigor Audit

Evaluate:

* Experimental design
* Controls
* Sample size
* Evaluation methodology
* Statistical validity
* Human review process
* LLM judge process
* Benchmark selection

Determine:

* Which conclusions are supported.
* Which conclusions are weakly supported.
* Which conclusions are unsupported.

Assign confidence levels:

* High Confidence
* Moderate Confidence
* Low Confidence
* Speculative

---

### 3. Reproducibility Audit

Determine whether another researcher could:

* Recreate the experiment.
* Verify the findings.
* Challenge the findings.

List all missing information required for replication.

---

### 4. Public Criticism Simulation

Simulate reactions from:

### Hacker News

Generate the top 10 criticisms.

### LessWrong

Generate the top 10 criticisms.

### AI Researchers

Generate the top 10 criticisms.

### Startup Founders

Generate the top 10 criticisms.

### Investors

Generate the top 10 criticisms.

For each criticism:

* Rate severity (1-10).
* Determine whether it is valid.
* Suggest a mitigation.

---

### 5. Bias Audit

Identify evidence of:

* Confirmation bias
* Selection bias
* Survivorship bias
* Evaluation bias
* Prompt-design bias
* Benchmark-design bias

Determine whether the research appears to be searching for truth or validating a predetermined conclusion.

---

### 6. Language Audit

Flag:

* Sensational wording
* Marketing language
* Venture hype
* Unjustified certainty
* Scientific overreach

Suggest more rigorous replacements.

---

### 7. Novelty Audit

Determine:

* What is genuinely novel.
* What is incremental.
* What already exists in agent systems.
* What resembles existing literature.
* What contribution remains after removing hype.

Summarize the strongest legitimate contribution in one sentence.

---

### 8. Publication Readiness Score

Score 1-10:

* Credibility
* Scientific Rigor
* Novelty
* Reproducibility
* Clarity
* Community Interest
* Publishability

Explain every score.

---

### 9. Kill Shot Test

Assume a highly respected AI researcher wants to invalidate the project.

Identify the 5 strongest attacks they could make.

Then determine:

* Would each attack succeed?
* Would it damage the conclusions?
* Would it only weaken them?

---

### 10. Final Verdict

Provide:

1. What should absolutely remain unchanged.
2. What must be revised before publication.
3. What should be removed entirely.
4. Whether publication is recommended.
5. Confidence level in that recommendation.

Do not be polite.

Do not optimize for encouragement.

Do not optimize for validation.

Optimize for truth and public survivability.
