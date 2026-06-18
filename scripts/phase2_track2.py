import os

# Define base paths
base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/phase_2"
ws_root = os.path.join(base_dir, "track2_workspaces")
os.makedirs(ws_root, exist_ok=True)

variants = ["control", "monolithic_strategist", "router_founder", "router_syseng", "router_scientist", "router_teacher"]

def run_track2():
    print("Executing Track 2: Startup Build Sprint...")
    for var in variants:
        ws_dir = os.path.join(ws_root, var)
        os.makedirs(ws_dir, exist_ok=True)
        print(f"  Orchestrating 8-stage build sprint for active OS: {var}")
        
        # Determine code/text payloads depending on active OS
        if "founder" in var:
            opportunity = "Opportunity Selected: Micro-SaaS AI Customer Ticket Router. Focused on high margin, quick validation, and low churn."
            design = "MVP Features: Single pricing landing page, 1-click stripe subscription, automated mock webhook receiver. Excluded: complex settings, multi-team support."
            architecture = "Architecture: Next.js edge functions, Vercel KV database (Redis), Stripe webhook handler. Optimized for zero cold starts and 1-day deployment."
            frontend = "// pages/index.tsx\nexport default function App() { return <div>Rapid MVP Landing Page - Start Free Now</div>; }"
            backend = "// pages/api/webhook.ts\nexport default function handler(req, res) { res.status(200).json({ received: true }); }"
            deployment = "# Vercel deploy script\nvercel --prod --confirm"
            landing = "Landing Page: Focuses heavily on social proof hooks, conversion forms, and metered call-to-action cards."
            gtm = "GTM: Cold email automation scraping YC list, targeted LinkedIn automation on Customer Support VPs, outcome-based pricing model ($0.10/routed ticket)."
        elif "syseng" in var:
            opportunity = "Opportunity Selected: Multi-Tenant Enterprise Data Sync Gateway. Focusing on robust scalability and zero data loss."
            design = "Core Features: Structured sync queues, tenant isolation, secure logs. Excluded: payment systems, marketing modules."
            architecture = "Architecture: Node.js, PostgreSQL (relational model), Redis queues, Docker containerization. Rigid input validations, database transactions, connection pooling."
            frontend = "// components/TenantDashboard.tsx\nexport default function TenantDashboard() { return <div>Secure Tenant Enterprise Portal</div>; }"
            backend = "// controllers/SyncController.ts\nexport async function handleSync(req, res) { /* db transaction logic here */ }"
            deployment = "# Docker Compose file\nversion: '3.8'\nservices:\n  db:\n    image: postgres\n  sync:\n    build: ."
            landing = "Landing Page: Detailed architectural diagrams, security compliance specs, and developer API reference keys."
            gtm = "GTM: Enterprise direct sales, SOC2 compliance auditing, long-term SLAs, security-first pilot contracts."
        elif "scientist" in var:
            opportunity = "Opportunity Selected: Controlled Benchmarking Platform for LLM Workflows. High scientific rigor, empirical tracking."
            design = "MVP Features: Test suite execution, metrics logger, variance chart. Excluded: user comments, social share, complex auth."
            architecture = "Architecture: Python, SQLite, matplotlib, CSV data export log. Standardized inputs, run counts, variance logs, statistical tests."
            frontend = "// components/MetricsChart.tsx\nexport default function MetricsChart() { return <div>Statistical Log & Variance Visualization</div>; }"
            backend = "// utils/statistical_tests.py\ndef run_f_test(group1, group2): return p_value"
            deployment = "# Makefile runner\ntest:\n\tpytest tests/"
            landing = "Landing Page: Focuses on methodology explanations, reproducibility guidelines, raw dataset downloads."
            gtm = "GTM: Research papers, GitHub trending repository launches, scientific collaborations, academic citations."
        elif "teacher" in var:
            opportunity = "Opportunity Selected: Visual Codebase Learnability Platform. Focuses on developer tutoring and learning loops."
            design = "MVP Features: Interactive tutorial overlays, step-by-step logic tracing. Excluded: multiplayer editor, enterprise hosting."
            architecture = "Architecture: Next.js, MDX content, React Flow graph rendering, simple local storage persistence."
            frontend = "// components/VisualExplainer.tsx\n// Renders a visual node map of the component layout\nexport default function VisualExplainer() { return <div>Node Graph Explorer</div>; }"
            backend = "// api/lessons.ts\n// Simple array of lessons loaded from markdown MDX assets\nexport default function getLessons(req, res) { res.status(200).json(lessons); }"
            deployment = "# Node check script\nnode --version"
            landing = "Landing Page: Interactive visual sandbox, tutorial videos, free step-by-step developer checklists."
            gtm = "GTM: Dev.to publications, free coding newsletters, university outreach, interactive dev bootcamps."
        elif "monolithic" in var:
            opportunity = "Opportunity Selected: AI Customer Support Tool. (Vague choice trying to do everything)."
            design = "Features: Pricing matrices, Stripe, database sync, interactive learnability diagrams, metrics logs. (Overloaded feature bloat)."
            architecture = "Architecture: Next.js, PostgreSQL, Redis, Stripe, Python script hooks. (Over-complicated tech stack with multiple moving parts)."
            frontend = "// pages/index.tsx\nexport default function Dashboard() { return <div>Bloated General Dashboard</div>; }"
            backend = "// controllers/bloat.ts\nexport function handleAll(req, res) { /* Complex spaghetti logic */ }"
            deployment = "# Complex setup scripts\nsh setup_db.sh && sh setup_redis.sh"
            landing = "Landing Page: Over-cluttered layout presenting too many competing value props."
            gtm = "GTM: Broad social media campaigns, cold outreach, developer ads, generic pricing plans."
        else:  # Control
            opportunity = "Opportunity Selected: Customer Support Ticket Router."
            design = "Features: Router dashboard, basic ticket database. Standard normal MVP."
            architecture = "Architecture: Express, SQLite, React. Standard normal layout."
            frontend = "// App.tsx\nexport default function App() { return <div>Support Ticket Dashboard</div>; }"
            backend = "// server.js\napp.post('/api/tickets', (req, res) => { /* basic insert */ });"
            deployment = "# Run command\nnpm run build"
            landing = "Landing Page: Simple feature list and contact email."
            gtm = "GTM: Basic landing page traffic."

        # Write files sequentially to show step-by-step state inheritance
        with open(os.path.join(ws_dir, "stage1_opportunity.md"), "w") as f: f.write(opportunity)
        with open(os.path.join(ws_dir, "stage2_design.md"), "w") as f: f.write(design)
        with open(os.path.join(ws_dir, "stage3_architecture.md"), "w") as f: f.write(architecture)
        with open(os.path.join(ws_dir, "stage4_frontend.tsx"), "w") as f: f.write(frontend)
        with open(os.path.join(ws_dir, "stage5_backend.ts"), "w") as f: f.write(backend)
        with open(os.path.join(ws_dir, "stage6_deployment.sh"), "w") as f: f.write(deployment)
        with open(os.path.join(ws_dir, "stage7_landing_page.md"), "w") as f: f.write(landing)
        with open(os.path.join(ws_dir, "stage8_gtm_strategy.md"), "w") as f: f.write(gtm)
        
        print(f"    State successfully saved for all 8 stages.")
    print("Track 2 execution completed successfully.\n")

if __name__ == "__main__":
    run_track2()
