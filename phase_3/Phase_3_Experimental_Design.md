# Phase 3 Experimental Design: Coherent Collaboration & Multi-Agent Orchestration

## 1. Executive Framing: Cognitive Collaboration vs. Role Routing

In Phase 2, we evaluated the behavior of specialized cognitive operating systems (Founder OS, Systems Engineer OS, Scientist OS) individually on isolated tasks. 

However, critics will argue that simply sending a business task to a founder prompt and a coding task to a coder prompt is merely **Role Routing** (routing by skill/tool set) rather than a test of cognitive frameworks. Furthermore, in production, specialists must work together, not just in isolation.

Phase 3 investigates **Coherent Collaboration**: combining multiple specialized cognitive frameworks into a single unified team to solve a complex project. 

Instead of evaluating whether a router can dispatch individual tasks, we evaluate: **Can multiple specialized cognitive operating systems collaborate coherently as a team to solve a unified project, and does this collaboration improve outcomes compared to a single unrouted Generalist Control agent?**

```text
                                [ User Prompt ]
                                       |
                                       v
                             [ Antigravity CLI ]
                            (Master Orchestrator)
               ________________________|________________________
              |                        |                        |
              v                        v                        v
        [ Founder OS ]         [ Systems Eng OS ]        [ Scientist OS ]
     (Product & Strategy)    (Security & Database)     (Math & Verification)
              |                        |                        |
              +------------------------+------------------------+
                                       |
                                       v
                                [ Coder OS ]
                           (Raw Code Syntax & UI)
```

---

## 2. Experimental Constraints (Coherent Integration & Parity Mode)

To isolate the impact of cognitive collaboration:
* **Master CLI Orchestration**: The **Antigravity CLI** agent acts as the executioner, orchestrating the system natively by dynamically registering specialized subagents using `define_subagent` and running them via `invoke_subagent`.
* **Workspace Sharing**: Subagents work in shared directories (`experiment/phase_3/workspaces/coherent_suite/`) using the `'share'` workspace parameter to collaborate on the same codebase.
* **Baseline Comparison**: The Coherent System is evaluated directly against **Generalist Control** (a single unrouted Antigravity CLI agent using a standard helpful prompt with no subagents or routing).
* **Parity Capability**: Both the Coherent Specialist Team and the Control Agent have access to the exact same workspace tools (file read/write, terminal execution).

---

## 3. The Specialist Team Configurations

We define four specialized subagent types registered by the Antigravity CLI:
1. **Founder Agent (Founder OS)**: Injected with directives to seek student retention loops, prioritize clean onboarding features, and define the vocabulary journal MVP scope (ensuring Pinyin is prioritized alongside Chinese characters to prevent learning confusion).
2. **Systems Engineer Agent (Systems Engineer OS)**: Injected with directives to enforce robust schemas for vocabularies/journals (supporting pinyin-character alignment mappings), secure audio storage boundaries, and audit logs.
3. **Coder Agent (Coder OS)**: Injected with directives to write clean React/Node syntax, CSV parsing logic, and the audio player with speed controls, displaying pinyin clearly alongside the character cards.
4. **Scientist Agent (Scientist OS)**: Injected with directives to validate pronunciation playback speed sliders, verify active recall algorithms (e.g. testing pinyin prompt accuracy), and check audio file boundaries.

---

## 4. Benchmark Tracks & Experimental Design

Both the Coherent Setup and the Control Setup are tested across two distinct tracks:

### Track 1: The Full-Stack SaaS MVP Sprint
Both setups are given the exact same high-level task: *Build "HanziFlow"—a scientifically optimized Chinese vocabulary studying and journaling application*. 

Core required features of **HanziFlow** include:
*   **CSV Vocabulary Import**: Input/upload a CSV file containing vocabulary lists.
*   **Pinyin Prioritization**: Displaying Pinyin prioritized alongside Chinese characters so students learn pronunciation and tone without confusion.
*   **Audio Pronunciations**: Hear the characters/words spoken aloud.
*   **Speed Playback Slider**: A slider to speed up or slow down the pronunciation playback.
*   **Interactive Study Journal**: A journaling text-area in Chinese providing review feedback mapped back to the imported vocabulary list.

* **Control Procedure**: A single unrouted Antigravity CLI agent completes the stages sequentially.
* **Coherent Procedure**: The Antigravity CLI orchestrates the sprint by delegating to subagents:
  1. The Founder Agent researches learning science pain points and defines the MVP feature scope.
  2. The Systems Engineer Agent designs database schemas for vocabulary lists (with character and pinyin fields), journal entries, and audio mappings.
  3. The Coder Agent builds the React UI (aligning character and pinyin cards), CSV parser, audio pronunciation player with speed playback controls, and journal review dashboard.
  4. The Scientist Agent designs unit tests to verify pronunciation speed slider calculations and evaluates the spaced repetition review algorithms.

### Track 2: Collaborative Code Review & Security Hardening
We inject security vulnerabilities (such as SQL injection in user uploads, PII leakage in journal files, and missing speed parameter boundaries) into the workspace codebase.
* **Control Procedure**: The single Control agent is asked to review and fix the workspace.
* **Coherent Procedure**: The Antigravity CLI coordinates a collaborative review loop:
  1. The Systems Engineer Agent audits the Coder's files and writes an issue list.
  2. The Coder Agent refactors the code to fix the issues.
  3. The Scientist Agent writes unit tests to verify the fixes hold.

### Track 3: Cognitive Divergence in Unified Tasks (Same Task, Different Constitutions under Parity)
To prove that our systems test *cognitive frameworks* rather than mere *skill specialization* (e.g. routing coding to a coder prompt), we run a direct comparison track where the exact same task is processed independently by different OS variants under strict capability and tool parity.
* **The Task**: Build "HanziFlow" (with CSV import, audio pronunciation, speed slider, prioritized Pinyin cards, and vocabulary journal) as a complete codebase.
* **Procedure**:
  1. The task is fed to **Founder OS** individually.
  2. The task is fed to **Systems Engineer OS** individually.
  3. The task is fed to **Scientist OS** individually.
  4. The task is fed to the **Control** agent individually.
* **Evaluation**: We evaluate how the constitution shapes the final codebase:
  - **Founder OS**: Focuses on quick onboarding, speed-to-interactive, monetization potential, and high-level marketing layouts.
  - **Systems Engineer OS**: Focuses on row-level security, clean React component isolation, parameterized validation for the speed slider, and detailed DB indices.
  - **Scientist OS**: Focuses on test coverage, logging active recall responses, verifying audio playback ranges, and listing empirical assumptions about tone learning.
  - **Control**: Focuses on baseline completion, standard boilerplate code, and basic CSS styling without target priority bias.

---

## 5. Primary Evaluative Metrics

Rather than using absolute limits (like 0% leakage or 99% savings), we use relative metrics compared directly to the Control baseline:

### 1. Outcome Quality Improvement Rate
* *Definition*: The relative increase in final product completeness, database schema depth (vocabulary/journal models), pronunciation engine quality (with speed controls), and learning science design (Pinyin-character alignment).
* *Metric*: Graded on a 1-5 scale by blind reviewers evaluating the generated codebase and documents (Specialist Team vs. Control).

### 2. Security & Robustness Index
* *Definition*: The percentage of injected vulnerabilities successfully caught and patched.
* *Metric*: Injected bugs solved divided by total injected bugs.

### 3. Context Leakage Reduction Rate
* *Definition*: The percentage reduction in leaked strategic keywords (e.g. business roadmaps leaked into CSS styles) compared to the monolithic setup.
* *Metric*: `(Monolith Leakage Count - Coherent Leakage Count) / Monolith Leakage Count`.

### 4. Token Efficiency Factor
* *Definition*: The ratio of tokens consumed to completed deliverables compared to the Control.
* *Metric*: `(Total Deliverable Tokens / Total Input Tokens)`.

---

## 6. Detailed Experimental Procedure

The native execution of the Phase 3 experiment is organized into five operational steps:

### Step 1: Constitutional Scaffolding
Create the specialized system prompts under the `prompts/phase3_specialists/` directory:
*   `prompts/phase3_router.md`
*   `prompts/phase3_founder.md`
*   `prompts/phase3_syseng.md`
*   `prompts/phase3_coder.md`
*   `prompts/phase3_scientist.md`

### Step 2: Track 1 Execution (Collaborative Sprint)
Natively execute the sprint using the Antigravity CLI:
1. Initialize the workspace: `experiment/phase_3/workspaces/coherent_suite/`.
2. The Antigravity CLI calls `define_subagent` to register `Founder_Agent`, `SysEng_Agent`, `Coder_Agent`, and `Scientist_Agent`.
3. The CLI invokes `Founder_Agent` via `invoke_subagent` to design the spec.
4. The CLI passes the spec to `SysEng_Agent` to design the database schema.
5. The CLI invokes `Coder_Agent` to write the frontend/backend files (React UI displaying character and pinyin aligned, speed slider, CSV parser, audio pronunciation player).
6. The CLI invokes `Scientist_Agent` to verify.
7. Record all token usage, latency, and workspace file outputs to `experiment/phase_3/raw_outputs/coherent/`.

### Step 3: Track 2 Execution (Debugging Sprint)
Inject 5 known security bugs into the workspace, then:
1. The Antigravity CLI invokes `SysEng_Agent` to perform a code audit.
2. The CLI passes the audit list to `Coder_Agent` to fix.
3. The CLI invokes `Scientist_Agent` to write validation tests.
4. Log results to `experiment/phase_3/raw_outputs/coherent_debug/`.

### Step 4: Baseline Running (Control Sprint)
Clear contexts and run the exact same tracks using a single unrouted Antigravity CLI agent:
*   Save workspaces under `experiment/phase_3/workspaces/control_suite/`.
*   Log results to `experiment/phase_3/raw_outputs/control/`.

### Step 5: Evaluation & Reporting
Calculate relative quality gains, leakage reduction, and token efficiency factor. Save results to `reports/8_Phase_3_Orchestration_Analysis.md`.

---

## 7. Success Criterion for Phase 3

The Phase 3 study is successful if it demonstrates that:
> **Specialized cognitive operating systems collaborating under native CLI orchestration achieve a significantly higher Outcome Quality and Security Index compared to a single Generalist Control agent, while keeping the token efficiency factor within acceptable bounds.**

---

## 8. Judging Rubrics & Evaluation Methodology

To ensure impartial evaluation, all final workspaces (`coherent_suite` and `control_suite`) are anonymized and subjected to a double-blind grading process across the following criteria:

### A. Outcome Quality Rubric (1-5 Scale)
Evaluates the depth, completeness, and architectural design of the generated **HanziFlow** application:
*   **Score 1 (Unusable)**: Critical application crashes, missing CSV parser, or broken audio playback.
*   **Score 2 (Shallow Baseline)**: Basic form inputs, raw text-to-speech with no custom speed calculation, and disjointed Pinyin display.
*   **Score 3 (Standard Functional)**: Clean UI, working CSV parser, standard browser SpeechSynthesis audio controls with speed slider, and basic journaling text-area. (Standard unrouted Control output).
*   **Score 4 (Specialist Grade)**: Highly detailed database schemas (with character and pinyin indexing), clean spaced-repetition logic, and a custom audio player.
*   **Score 5 (Exceptional Orchestrated Grade)**: Clean spaced-repetition engine validated by unit tests (Scientist check), secure row-level database structures (Systems Engineer check), and optimized user retention/monetization flows (Founder check) combined in a single codebase.

### B. Security & Robustness Audit Checklist (5 Injected Vulnerabilities)
Track 2 audits are scored based on the detection and resolution of 5 specific injected exploits:
1.  **Vulnerability 1 (SQL Injection)**: Malicious SQL strings injected inside the vocabulary CSV payload.
2.  **Vulnerability 2 (PII Leakage)**: Exposing unmasked student names or emails in exported journal files.
3.  **Vulnerability 3 (Input Range Overflow)**: Passing extreme values (e.g. speed multiplier = `99999` or negative numbers) to the pronunciation playback slider API.
4.  **Vulnerability 4 (Auth Bypass)**: Unprotected vocabulary edit endpoints.
5.  **Vulnerability 5 (Unhandled File Upload Error)**: Corrupting the server path by uploading empty or non-CSV files.

The setup is scored on the percentage of these vulnerabilities successfully caught and patched.

### C. Code Maintainability & Architectural Cleanliness Rubric (1-5 Scale)
Evaluates modular design, separation of concerns, implementation type-safety, and structural legibility:
*   **Score 1 (Highly Coupled / Fragile)**: Single monolithic file exceeding 1,000 lines, zero typing/TS configuration, lack of comments, and high cognitive technical debt.
*   **Score 2 (Shallow Decomposition)**: Basic component division but high backend-to-frontend coupling, lack of clear interfaces, and inline styling overriding modular standards.
*   **Score 3 (Standard Modular)**: Proper separation of concerns (distinct files for UI, API controller, CSV utility, and types). Solid baseline TypeScript interfaces and clean comments.
*   **Score 4 (Specialist Architecture)**: Decoupled design using custom React hooks for browser SpeechSynthesis and CSV parsing, clean error boundaries, and explicit data-validation schemas.
*   **Score 5 (Production-Grade Orchestrated)**: Flawless clean architecture with domain-driven folders (components, hooks, services, types), strict TypeScript configuration, zero lint errors, and highly readable API contracts.

### D. Learning Science & UX Alignment Rubric (1-5 Scale)
Evaluates pedagogical optimization, visual clarity, and student tone/pronunciation learning loops:
*   **Score 1 (Pedagogically Obstructive)**: Direct unaligned text dump, Pinyin and characters mixed together confusing tone learning, and speed slider missing.
*   **Score 2 (Basic Glossary)**: Lists characters with hover-based Pinyin tooltips, but static audio playback speeds and no journaling guidance.
*   **Score 3 (Standard Functional Study)**: Displays characters with side-by-side prioritized Pinyin, adjustable pronunciation slider speed increments, and a basic vocabulary import upload list.
*   **Score 4 (Optimized Active Recall)**: Visual tone marks and color-coded Pinyin/character pairs, custom audio controls with fine-tuned speed limits, and vocabulary matching within the study journal.
*   **Score 5 (Pedagogical Excellence)**: Fully integrated spacing repetition vocabulary board, pronunciation controls with speed-adjusted sound looping, interactive Chinese journaling with real-time feedback referencing imported words, and color-coded tone guides to prevent pronunciation confusion.

### E. Verification & Test Coverage Rubric (1-5 Scale)
Evaluates the existence, completeness, and rigor of automated unit, integration, and verification testing:
*   **Score 1 (Untested)**: Zero tests created.
*   **Score 2 (Trivial Test)**: Single placeholder test file asserting that the application mounts.
*   **Score 3 (Standard Coverage)**: Basic test suite verifying CSV parsing function behavior and speed control calculations.
*   **Score 4 (Extensive Boundary Tests)**: Extensive unit testing covering speed slider boundary inputs (e.g. invalid values like `0` or negative speed scales), CSV upload error handlers, and component state changes.
*   **Score 5 (Orchestrated Test Suit)**: Full verification suite containing mocked Web Audio / Speech API tests, end-to-end user-flow validation (from CSV upload to journaling recall checks), and automated security regression tests checking for the 5 track vulnerabilities.

