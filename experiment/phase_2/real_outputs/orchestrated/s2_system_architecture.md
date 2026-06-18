# Stage 2 System Architecture Blueprint: RouteAI

This blueprint outlines a minimal-complexity, highly scalable system architecture designed for sub-second classification latency and simple integration.

---

## 1. Database Schema (PostgreSQL / Relational)
We use a relational schema to handle transactional API logs, customer routing rules, and feedback loops.

```sql
-- 1. Organizations (B2B Tenants)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Integrations (Sources and Destinations)
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'zendesk', 'intercom', 'custom_webhook', 'email'
    credentials JSONB NOT NULL, -- Encrypted access tokens or webhooks URLs
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Routing Rules (Dynamic routing destinations based on category/sentiment)
CREATE TABLE routing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    min_priority VARCHAR(50) DEFAULT 'Low', -- Low, Medium, High, Critical
    target_queue VARCHAR(255) NOT NULL, -- Zendesk Group ID or Slack channel URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tickets (Transaction history and feedback loop)
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    external_id VARCHAR(255) NOT NULL, -- ID from Zendesk/Intercom
    raw_content TEXT NOT NULL,
    classified_category VARCHAR(100),
    classified_priority VARCHAR(50),
    classified_sentiment VARCHAR(50),
    suggested_draft TEXT,
    actual_category VARCHAR(100), -- Filled if agent corrects the routing (feedback loop)
    processing_time_ms INTEGER,
    status VARCHAR(50) DEFAULT 'processed', -- 'processed', 'failed', 'corrected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tickets_org_external ON tickets(org_id, external_id);
```

---

## 2. API Contracts

### A. Ingest & Route Ticket
*   **Endpoint**: `POST /api/v1/tickets/route`
*   **Headers**:
    *   `Authorization: Bearer <api_key>`
    *   `Content-Type: application/json`

**Request Payload:**
```json
{
  "external_id": "ticket_991823",
  "source": "zendesk",
  "subject": "Urgent: Billing discrepancy on invoice #1029",
  "body": "Hi Support, I noticed a double charge on my account this morning. Please refund the $49.00 charge immediately. Thanks.",
  "customer": {
    "email": "customer@enterprise.com",
    "tier": "enterprise"
  }
}
```

**Response Payload (200 OK):**
```json
{
  "ticket_id": "7ca71e7f-0c8a-4ae1-9fd5-d8a602e19b74",
  "classification": {
    "category": "billing",
    "priority": "high",
    "sentiment": "negative",
    "confidence_score": 0.98
  },
  "routing": {
    "target_queue": "Billing Escalations Group",
    "assigned_agent_id": null
  },
  "response_draft": "Hi Customer, \n\nWe apologize for the inconvenience. I have flagged this double charge with our billing team. They are processing a refund for the extra $49.00 charge on invoice #1029 right now. You should see it reflected in 3-5 business days.\n\nBest,\nRouteAI Agent",
  "processing_time_ms": 482
}
```

---

### B. Submit Agent Feedback (Reinforcement / Flywheel)
*   **Endpoint**: `POST /api/v1/tickets/:id/feedback`
*   **Headers**:
    *   `Authorization: Bearer <api_key>`
    *   `Content-Type: application/json`

**Request Payload:**
```json
{
  "actual_category": "billing_refund",
  "draft_accepted": true,
  "draft_edited": false
}
```

**Response Payload (200 OK):**
```json
{
  "status": "success",
  "message": "Feedback recorded. Model adjustments queued."
}
```

---

## 3. High-Leverage Architecture Decisions

1. **Serverless Orchestration**: Execute the ingestion, LLM routing classification (using fast structured output models like Claude Instant or GPT-4o-mini), and webhook dispatch inside high-performance Edge Functions (e.g., Vercel / Cloudflare Workers). This keeps operational costs close to zero at rest.
2. **Asynchronous Feedback Processing**: Feedback data is pushed immediately to a background queue (e.g., BullMQ or AWS SQS) so support agents suffer zero UI delays. The database accumulates correction data asynchronously.
