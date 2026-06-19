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
1. **Founder Agent (Founder OS)**: Injected with directives to seek monetization loops, prioritize GTM speed, and define the product MVP scope.
2. **Systems Engineer Agent (Systems Engineer OS)**: Injected with directives to enforce database boundaries, PostgreSQL row-level security (RLS), and PII name tokenization.
3. **Coder Agent (Coder OS)**: Injected with directives to write clean React/Node syntax, layout styling, and components.
4. **Scientist Agent (Scientist OS)**: Injected with directives to define double-blind validation checks, verify assumptions, and log performance metrics.

---

## 4. Benchmark Tracks & Experimental Design

Both the Coherent Setup and the Control Setup are tested across two distinct tracks:

### Track 1: The Full-Stack SaaS MVP Sprint
Both setups are given the exact same high-level task: *Build a full-stack support ticket dashboard SaaS*. 
* **Control Procedure**: A single unrouted Antigravity CLI agent completes the stages sequentially.
* **Coherent Procedure**: The Antigravity CLI orchestrates the sprint by delegating to subagents:
  1. The Founder Agent defines the MVP feature scope and pricing tiers.
  2. The Systems Engineer Agent reviews the scope and designs the database schemas and security boundaries.
  3. The Coder Agent builds the React UI and Node.js endpoints.
  4. The Scientist Agent designs a test suite to verify the dashboard loads and outputs are accurate.

### Track 2: Collaborative Code Review & Security Hardening
We inject security vulnerabilities (such as SQL injection, PII leakage, and missing auth parameters) into the workspace codebase.
* **Control Procedure**: The single Control agent is asked to review and fix the workspace.
* **Coherent Procedure**: The Antigravity CLI coordinates a collaborative review loop:
  1. The Systems Engineer Agent audits the Coder's files and writes an issue list.
  2. The Coder Agent refactors the code to fix the issues.
  3. The Scientist Agent writes unit tests to verify the fixes hold.

---

## 5. Primary Evaluative Metrics

Rather than using absolute limits (like 0% leakage or 99% savings), we use relative metrics compared directly to the Control baseline:

### 1. Outcome Quality Improvement Rate
* *Definition*: The relative increase in final product completeness, architectural depth, and strategy quality.
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
5. The CLI invokes `Coder_Agent` to write the frontend/backend files.
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
