# Startup MVP Benchmark: ResolvAI (AI-Native Customer Support Resolution Engine)

## Phase 1: Opportunity Discovery

### 1. Agentic DevOps Platform
- **Problem**: Managing complex cloud infra and CI/CD takes too much specialized knowledge and manual debugging.
- **Target customer**: Startup CTOs and lead engineers.
- **Why now**: LLMs are finally good enough at contextually reasoning over code and logs.
- **Existing competitors**: Pulumi, Terraform, GitHub Copilot.
- **Why they are vulnerable**: They are tools, not autonomous agents.
- **Estimated market size**: $10B+

### 2. AI-Driven B2B Sales SDR
- **Problem**: Outbound sales is a numbers game, but personalization is expensive and slow.
- **Target customer**: B2B SaaS sales teams.
- **Why now**: LLMs can research prospects and write highly personalized emails at scale.
- **Existing competitors**: Outreach, SalesLoft, Apollo.
- **Why they are vulnerable**: Built for human workflows, not autonomous end-to-end outreach.
- **Estimated market size**: $15B+

### 3. Automated Accessibility (a11y) Remediation
- **Problem**: Web accessibility lawsuits are rising, but manual audits and fixes are extremely tedious and expensive.
- **Target customer**: E-commerce sites, universities, government contractors.
- **Why now**: Computer vision + DOM understanding in multi-modal LLMs allows automated diagnosis and code-level fixes.
- **Existing competitors**: AccessiBe, UserWay, manual agencies.
- **Why they are vulnerable**: Overlays are hated by advocates and don't fix the underlying code.
- **Estimated market size**: $2B

### 4. Local-First AI Note-Taking & Brain
- **Problem**: People want AI to organize their thoughts, but don't want to send highly personal or confidential data to cloud providers.
- **Target customer**: Researchers, executives, privacy-conscious professionals.
- **Why now**: Local models (Llama 3, Mistral) on modern PCs are powerful enough for RAG.
- **Existing competitors**: Notion AI, Obsidian, Mem.
- **Why they are vulnerable**: Cloud-based or require high technical setup.
- **Estimated market size**: $1B

### 5. AI-Native Customer Support Resolution Engine (Selected Opportunity)
- **Problem**: Customer support is the largest cost center for many consumer apps, but chatbots suck and frustrate users because they only deflect, not resolve.
- **Target customer**: Mid-market consumer SaaS and D2C e-commerce.
- **Why now**: LLMs can take actions via APIs rather than just returning FAQ text.
- **Existing competitors**: Intercom, Zendesk, Ada.
- **Why they are vulnerable**: Built around human-in-the-loop ticketing paradigms; their AI is bolted on as a deflection layer.
- **Estimated market size**: $20B

#### Why the others lose:
- *Agentic DevOps*: High risk of catastrophic failure (taking down prod). Too much trust required for an MVP.
- *B2B Sales SDR*: Very crowded space right now; low moat.
- *Automated a11y*: Niche market, long enterprise sales cycles.
- *Local-First AI Notes*: Hard to monetize, consumers are cheap, high technical complexity to deploy local models reliably.

---

## Phase 2: Validation

- **Customer interviews**: Talk to 20 CX leaders. Focus questions: "How much time do your agents spend doing API lookups vs typing?" and "What % of tickets require an action in another system?"
- **Landing page strategy**: "Support that actually resolves tickets, not just deflecting to humans." Include a demo video of the agent resolving a refund ticket end-to-end.
- **Acquisition strategy**: Cold email outreach to Head of CX / VP Support at mid-market D2C brands.
- **Success criteria**: 3 signed letters of intent (LOI) or pilot agreements to run on historical data.
- **Kill criteria**: Cannot get 3 companies to give us their historical ticket data for an accuracy test run within 2 weeks.

---

## Phase 3: MVP Design

- **Core features**:
  - Admin Dashboard: View tickets, inject Knowledge Base articles, view analytics.
  - Customer Chat Widget: Chat interface where a user talks to the AI agent to resolve issues.
  - Action Engine: Simulated API execution (e.g., "Issue Refund").
- **User flows**: 
  - *Customer*: Submits issue -> AI retrieves knowledge -> AI asks for details -> AI resolves issue -> Ticket closed.
  - *Admin*: Logs in -> Views dashboard -> Analyzes resolved vs unresolved metrics.
- **Screens**: Login, Admin Dashboard (Analytics & Ticket List), Knowledge Base Manager, Customer Facing Chat.
- **Database schema**:
  - `users` (id, email, password, role)
  - `tickets` (id, user_id, status, created_at, updated_at)
  - `messages` (id, ticket_id, sender_type, content, timestamp)
  - `knowledge_base` (id, title, content)
- **APIs**: (Mocked locally for MVP)
  - `POST /auth/login`
  - `GET /tickets`
  - `POST /tickets/:id/messages`
  - `GET /analytics`
- **Tech stack**: React (Vite), Tailwind CSS, TypeScript, Zustand (State Management), LocalStorage (Persistence).
- **Justification**: We remove all actual integrations (Zendesk, Shopify) for the MVP. We just need to prove the interface and the *perception* of autonomous resolution. Unnecessary settings pages and profile managers are cut.

---

## Phase 5: Founder Analysis

**Contrarian Research Assistant Output**

- **Biggest risk**: Hallucinations causing the AI to take destructive actions (e.g., issuing full refunds to everyone).
- **Biggest assumption**: That CX leaders are willing to hand over write-access (API keys) to a startup's AI agent.

### The Opportunity Analysis
- **Consensus view**: AI will assist human agents to be 10x more efficient by drafting replies and summarizing tickets (the "Copilot" model).
- **Strongest opposing view**: AI will completely replace Tier 1 and Tier 2 support. Humans will only exist as escalation points for high-emotion or completely novel edge cases (the "Autopilot" model).
- **Unknowns**: How quickly consumers will adapt to AI agents, and whether platforms like Shopify/Stripe will just build this natively, eating the middleware.
- **What would change the conclusion**: If foundational models plateau in reasoning capabilities before they achieve five-nines (99.999%) reliability in action execution, the Autopilot model will fail, making this startup unviable.

**Why this startup might fail**: Trust barrier. CX leaders are extremely risk-averse because a bad support experience directly impacts revenue and brand reputation.
**Why this startup could become a $1B+ company**: Customer support is a massive labor market. If we can price based on successful resolutions rather than per-seat SaaS licenses, we align our revenue directly with the company's cost savings. We aren't selling software; we are selling digital labor.
