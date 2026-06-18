# Stage 2 System Architecture Blueprint

## Database Schema Design
The database schema consists of four primary relations implemented in a relational engine. The organizations table contains unique identifiers, names, and billing subscription levels. The repositories table maps codebases to organizations, holding GitHub repository identifiers, access tokens, and baseline performance metrics. The scans table logs individual optimization executions, recording timestamps, target branches, and audit results. The optimizations table tracks specific recommended modifications, storing file paths, line ranges, target content, suggested replacement content, and the current status of the corresponding pull request.

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subscription_tier VARCHAR(50) NOT NULL DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  github_id BIGINT UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  baseline_lcp_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  branch VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  lcp_score_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  start_line INTEGER NOT NULL,
  end_line INTEGER NOT NULL,
  original_code TEXT NOT NULL,
  suggested_code TEXT NOT NULL,
  pull_request_url TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'suggested',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## API Contracts and Operations
The RESTful application interface defines endpoints to manage code analysis and pull requests. A client initiates a repository scan by executing a POST request to the scans endpoint with a payload containing the repository identifier and target branch name. The server responds with a JSON payload containing a unique scan identifier and initial processing status. A client retrieves optimization recommendations by executing a GET request to the optimizations endpoint with a scan identifier, receiving a JSON array containing proposed file modifications, anticipated LCP score reductions, and related pull request URLs.

```json
POST /api/scans
Request Header: Authorization: Bearer <token>
Request Body:
{
  "repository_id": "8f2d65a2-8e7c-4a3d-9b1b-7a5f6e8d2c1a",
  "branch": "main"
}

Response Body (202 Accepted):
{
  "scan_id": "3c9d8a1f-4b6e-4c2d-9a8b-1e5f7d6c8b9a",
  "status": "pending",
  "created_at": "2026-06-18T01:48:00Z"
}

GET /api/scans/3c9d8a1f-4b6e-4c2d-9a8b-1e5f7d6c8b9a/optimizations
Request Header: Authorization: Bearer <token>

Response Body (200 OK):
[
  {
    "optimization_id": "d4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9",
    "file_path": "src/components/Hero.tsx",
    "start_line": 12,
    "end_line": 15,
    "original_code": "<img src=\"/hero.png\" />",
    "suggested_code": "<img src=\"/hero.png\" fetchpriority=\"high\" decoding=\"async\" alt=\"Hero Banner\" />",
    "anticipated_lcp_reduction_ms": 350,
    "status": "suggested"
  }
]
```

## Business Opportunity and Leverage Loop
The business opportunity in this architecture is the creation of a standardized, cacheable repository of public-domain performance fixes. By compiling performance metadata across thousands of open-source projects, we can train a proprietary, low-latency scoring model. This allows us to offer instant performance assessments without running expensive code parsing jobs, creating an efficient database query leverage loop that minimizes infrastructure overhead.

## Launch, Monetization, and Scaling
We will launch the API layer with a public developer portal offering documentation and self-serve API keys. Monetization will be structured around API rate limits and webhook throughput, charging enterprise customers for real-time webhooks and priority queue processing. Scaling will be achieved by using distributed database replicas at the network edge to ensure minimal response times for global development teams.

## Contrarian Analysis
The consensus view suggests that utilizing a traditional centralized relational database is the most reliable approach for managing application state and audit logs. The strongest opposing view states that a decentralized event-sourced ledger is superior for tracking changes across multiple repositories and PR lifetimes because it prevents data synchronization conflicts. We believe a relational database with strict constraint validation is optimal since application consistency is critical for billing and security. Our mind would change if the operational complexity of event sourcing was reduced through automated cloud services that manage schema migrations natively.
