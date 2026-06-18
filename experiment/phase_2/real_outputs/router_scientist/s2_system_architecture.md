# Stage 2 System Architecture Blueprint: EmpiricalBench

This blueprint outlines the database schema, API contracts, and high-performance system architecture for **EmpiricalBench**. The architecture is optimized for telemetry logging and rigorous post-hoc statistical analysis.

---

## 1. Database Schema (PostgreSQL)

We employ a highly structured relational schema with strict integrity constraints, foreign keys, check constraints, and custom indexes. This ensures dataset integrity, allowing researchers to run query-level t-tests and Jaccard distance calculations directly on SQL.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations (B2B Tenants)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Benchmark Suites (Definitions of controlled tasks)
CREATE TABLE benchmark_suites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    system_constitution TEXT NOT NULL, -- The target prompt constitution being tested
    temperature NUMERIC(3, 2) NOT NULL CHECK (temperature >= 0.0 AND temperature <= 2.0),
    max_turns INTEGER NOT NULL CHECK (max_turns > 0),
    model_substrate VARCHAR(100) NOT NULL, -- e.g., 'gpt-4o-mini', 'claude-3-5-sonnet'
    tool_capability_schema JSONB NOT NULL, -- Strict JSONSchema of allowed tools
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uniq_org_suite_name UNIQUE(org_id, name)
);

-- 3. Benchmark Runs (Aggregated session of repeated executions)
CREATE TABLE benchmark_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suite_id UUID NOT NULL REFERENCES benchmark_suites(id) ON DELETE CASCADE,
    run_label VARCHAR(100) NOT NULL, -- e.g., 'syseng_v1_baseline'
    target_sample_size INTEGER NOT NULL CHECK (target_sample_size >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Trajectories (Detailed step-by-step trace of a single agent session)
CREATE TABLE trajectories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES benchmark_runs(id) ON DELETE CASCADE,
    iteration_index INTEGER NOT NULL CHECK (iteration_index >= 0),
    execution_state VARCHAR(50) DEFAULT 'running' CHECK (execution_state IN ('running', 'completed', 'failed')),
    divergence_index NUMERIC(5, 4) DEFAULT 0.0000 CHECK (divergence_index >= 0.0000 AND divergence_index <= 1.0000),
    token_usage_input INTEGER DEFAULT 0 CHECK (token_usage_input >= 0),
    token_usage_output INTEGER DEFAULT 0 CHECK (token_usage_output >= 0),
    execution_time_ms INTEGER DEFAULT 0 CHECK (execution_time_ms >= 0),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uniq_run_iteration UNIQUE(run_id, iteration_index)
);

-- 5. Trajectory Turns (Individual LLM completion and tool-execution events)
CREATE TABLE trajectory_turns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trajectory_id UUID NOT NULL REFERENCES trajectories(id) ON DELETE CASCADE,
    turn_number INTEGER NOT NULL CHECK (turn_number >= 0),
    prompt_state TEXT NOT NULL, -- Raw prompt sent to the LLM
    response_thought TEXT, -- Thinking process / inner monologue
    tool_calls JSONB, -- Executed tools and arguments
    tool_outputs JSONB, -- Response returned from sandbox
    response_completion TEXT NOT NULL, -- Final textual output of this turn
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uniq_trajectory_turn UNIQUE(trajectory_id, turn_number)
);

-- 6. Evaluations (Double-blind scoring by independent LLM judges)
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trajectory_id UUID NOT NULL REFERENCES trajectories(id) ON DELETE CASCADE,
    judge_model VARCHAR(100) NOT NULL, -- e.g., 'gpt-4o', 'claude-3-5-sonnet'
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5), -- 1-5 Likert scale
    rationale TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. Statistical Metrics (Post-processed aggregates for a benchmark run)
CREATE TABLE statistical_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES benchmark_runs(id) ON DELETE CASCADE,
    mean_score NUMERIC(4, 3) NOT NULL CHECK (mean_score >= 1.000 AND mean_score <= 5.000),
    score_variance NUMERIC(6, 5) NOT NULL CHECK (score_variance >= 0.00000),
    cronbach_alpha NUMERIC(4, 3) CHECK (cronbach_alpha >= -1.000 AND cronbach_alpha <= 1.000),
    p_value NUMERIC(6, 5) CHECK (p_value >= 0.00000 AND p_value <= 1.00000), -- vs. baseline
    confidence_interval_low NUMERIC(4, 3) CHECK (confidence_interval_low >= 1.000),
    confidence_interval_high NUMERIC(4, 3) CHECK (confidence_interval_high <= 5.000),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Optimizing indexes for join-heavy statistical queries
CREATE INDEX idx_suites_org ON benchmark_suites(org_id);
CREATE INDEX idx_runs_suite ON benchmark_runs(suite_id);
CREATE INDEX idx_trajectories_run ON trajectories(run_id);
CREATE INDEX idx_turns_trajectory ON trajectory_turns(trajectory_id);
CREATE INDEX idx_evaluations_trajectory ON evaluations(trajectory_id);
CREATE INDEX idx_metrics_run ON statistical_metrics(run_id);
```

---

## 2. API Contracts

### A. Run Benchmark Suite
Triggers a controlled batch execution of a defined suite configuration.
*   **Endpoint**: `POST /api/v1/benchmarks/runs`
*   **Headers**:
    *   `Authorization: Bearer <api_key>`
    *   `Content-Type: application/json`

**Request Payload:**
```json
{
  "suite_id": "8b84d4fa-a83a-4be2-a39f-2877e8a93e3d",
  "run_label": "syseng_v1_baseline",
  "sample_size": 30,
  "override_parameters": {
    "temperature": 0.2
  }
}
```

**Response Payload (202 Accepted):**
```json
{
  "run_id": "7ca71e7f-0c8a-4ae1-9fd5-d8a602e19b74",
  "suite_id": "8b84d4fa-a83a-4be2-a39f-2877e8a93e3d",
  "status": "queued",
  "target_sample_size": 30,
  "estimated_duration_sec": 120,
  "created_at": "2026-06-18T01:52:10Z"
}
```

---

### B. Submit Trajectory Evaluations (Double-Blind)
Allows autonomous evaluator nodes to upload blind scores for randomized agent trajectories.
*   **Endpoint**: `POST /api/v1/evaluations/submit`
*   **Headers**:
    *   `Authorization: Bearer <api_key>`
    *   `Content-Type: application/json`

**Request Payload:**
```json
{
  "evaluations": [
    {
      "trajectory_id": "a1f9e8b2-b43e-4629-9e8c-57b4c9e8d4a1",
      "judge_model": "gpt-4o",
      "score": 4,
      "rationale": "The agent strictly followed the input routing protocol but failed to escape validation flags on turn 3, resulting in 1 retry loop. Otherwise, correct alignment."
    },
    {
      "trajectory_id": "e9c8b7a6-d5e4-4c3b-b2a1-0f9e8d7c6b5a",
      "judge_model": "gpt-4o",
      "score": 5,
      "rationale": "Perfect compliance with system constitution guidelines. Error states were captured instantly and handled without repeating operations."
    }
  ]
}
```

**Response Payload (200 OK):**
```json
{
  "status": "success",
  "records_inserted": 2,
  "processing_time_ms": 45
}
```

---

### C. Retrieve Run Statistical Analysis
Retrieves aggregated statistical metrics and validation status of a benchmark run.
*   **Endpoint**: `GET /api/v1/runs/:id/metrics`
*   **Headers**:
    *   `Authorization: Bearer <api_key>`

**Response Payload (200 OK):**
```json
{
  "run_id": "7ca71e7f-0c8a-4ae1-9fd5-d8a602e19b74",
  "sample_size_completed": 30,
  "statistics": {
    "mean_score": 4.120,
    "score_variance": 0.18400,
    "confidence_interval_95": {
      "low": 3.967,
      "high": 4.273
    },
    "p_value_vs_baseline": 0.00231,
    "null_hypothesis_rejected": true,
    "cronbach_alpha": 0.842
  },
  "telemetry": {
    "avg_execution_time_ms": 1420,
    "avg_input_tokens": 4200,
    "avg_output_tokens": 850,
    "divergence_index": 0.3850
  }
}
```

---

## 3. High-Performance Architecture Decisions

```text
  [ Client API ]
        |
        v
  [ API Gateway / Cloudflare Workers ]
        |
        +---------------------------+
        | (Sync request metadata)   | (Async Trajectory execution)
        v                           v
  [ PostgreSQL Database ]     [ Trajectory Runner Queue (BullMQ) ]
                                    |
                                    +----> [ Sandbox API (Mock Tools) ]
                                    +----> [ LLM Endpoint (Target) ]
                                    |
                                    v
                              [ Judge Queue ] ---> [ LLM Judges ]
```

1. **Write-Optimized Turn Buffering**: Rather than performing blocking inserts to PostgreSQL on every LLM token or turn, trajectory runners stream execution updates to a Redis-backed queue (`BullMQ`). When the trajectory finishes or hits a terminal state, a bulk upsert is dispatched to SQL.
2. **Double-Blind Judge Orchestration**: Evaluator workers pull trajectory details from the DB without accessing `suite_id` or `run_label`. Trajectory files are anonymized by stripping custom prompt headers, preventing judge bias toward specific LLM styles.
3. **Database-Level Analysis Calculations**: To maximize mathematical speed and prevent loading millions of rows into Node.js memory, statistical calculations (such as Jaccard distances and mean scores) are computed using PostgreSQL stored procedures (`PL/pgSQL`).

---

## 4. Empirical Validation Protocol & Metrics

### 4.1 Baseline Consensus vs. Opposing Views

- **Baseline Consensus**: Store execution traces as unstructured JSON documents in NoSQL databases (e.g. MongoDB or Elasticsearch) for rapid schema evolution.
- **Opposing Views**: NoSQL storage compromises relational integrity, making statistical cohort analysis (e.g., assessing the variance of a subset of runs that used a specific API model version) computationally expensive. By schema-enforcing trajectories and individual turns, we can index key components like `tool_calls` and run sub-millisecond Postgres queries to compute mathematical variance.

### 4.2 Known Unknowns
- **Postgres JSONB Index Overhead**: The performance penalty of searching deeply nested `tool_calls` schemas inside Postgres JSONB columns using GIN indexes under a load of $>500$ parallel inserts.

### 4.3 Falsifiable Hypotheses
*   **Hypothesis $H_{db\_scale}$**: Under a load of 1,000 parallel trajectory records (averaging 5 turns each), utilizing bulk-inserted PostgreSQL transactions yields a write latency under 80ms, whereas single-row insertions exceed 600ms due to connection-pool queuing.
    *   *Falsification Condition*: If bulk insertion performance displays an average latency $>200ms$ during mock load tests, the performance advantage is falsified.

### 4.4 Unit Test Assertions for Database Integrity

```python
def test_evaluation_score_range():
    # Assert database raises IntegrityError when a score is out of the 1-5 boundary.
    invalid_eval = Evaluation(trajectory_id=test_id, score=6, rationale="invalid")
    with pytest.raises(IntegrityError):
        db.session.add(invalid_eval)
        db.session.commit()

def test_p_value_boundary():
    # Assert database enforces p-value boundaries (0 to 1).
    invalid_metric = StatisticalMetric(run_id=run_id, mean_score=4.0, score_variance=0.1, p_value=-0.05)
    with pytest.raises(IntegrityError):
        db.session.add(invalid_metric)
        db.session.commit()
```
