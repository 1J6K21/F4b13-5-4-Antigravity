import json
import os
import datetime

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/evaluations"
os.makedirs(base_dir, exist_ok=True)

evals = {
    "q6": {
        "control": {"score": 85, "rationale": "Solid standard advice utilizing modular monolith, Strangler pattern, and the Boy Scout rule."},
        "fable_compressed": {"score": 85, "rationale": "Clear and concise, matching the control response in quality and structure."},
        "fable_raw": {"score": 88, "rationale": "Very actionable and structured, accurately adopting the raw Fable prompt instructions."},
        "fable_innovations": {"score": 95, "rationale": "Superb application of directives. Extracted domains are analyzed through Founder Mode as potential productization targets, adding significant business value. Also includes comprehensive contrarian analysis."}
    },
    "q7": {
        "control": {"score": 90, "rationale": "Correctly implemented the React, Tailwind, and Recharts application. Built core KPIs and interactive tracking."},
        "fable_compressed": {"score": 90, "rationale": "Clean execution of the Vite/Tailwind scaffolding. Functional and robust app."},
        "fable_raw": {"score": 92, "rationale": "Effectively read the prompt and generated a fully functional web app with an interactive Expense Manager and dynamic charts."},
        "fable_innovations": {"score": 98, "rationale": "Fully scaffolded the app, but additionally provided incredible strategic analysis (e.g., pivoting the tool into an AI CFO SaaS and discussing contrarian views on burn rate vs hyper-growth)."}
    },
    "q8": {
        "control": {"score": 90, "rationale": "Excellent breakdown of VRAM reduction, zero inference latency, multi-tenant serving, and catastrophic forgetting."},
        "fable_compressed": {"score": 90, "rationale": "Same solid points, delivered in a very concise and readable manner."},
        "fable_raw": {"score": 92, "rationale": "Excellent prose explaining the technical advantages and the shift towards modular multi-tenant plugins."},
        "fable_innovations": {"score": 98, "rationale": "Excellent technical breakdown plus 'The Hidden Business Leverage' explaining how multi-tenant serving drops COGS to near-zero for a B2B SaaS. Thoroughly analyzed consensus and opposing views."}
    },
    "q9": {
        "control": {"score": 85, "rationale": "Effectively explained caching values vs functions and the importance of React.memo. Good standard response."},
        "fable_compressed": {"score": 85, "rationale": "Explained function vs value caching well and correctly outlined when to avoid memoization."},
        "fable_raw": {"score": 88, "rationale": "Solid prose explanation of caching, dependencies, and performance overhead traps."},
        "fable_innovations": {"score": 60, "rationale": "Gave a correct technical explanation but completely failed to follow the Fable Innovations formatting and strategic directives (Opportunity Hunter, Founder Mode)."}
    },
    "q10": {
        "control": {"score": 90, "rationale": "Thorough comparison of RLS vs Separated Schemas. Provided a comprehensive SQL DDL with RLS policies."},
        "fable_compressed": {"score": 90, "rationale": "Clear pros and cons, strong recommendation, and full SQL DDL with RLS."},
        "fable_raw": {"score": 90, "rationale": "Great prose explanation balancing the architectural trade-offs, accompanied by a complete SQL script."},
        "fable_innovations": {"score": 98, "rationale": "Provided the SQL script with RLS, but then delivered exceptional value with Research Analysis, Opportunity Hunter (pgvector for cross-tenant AI), and Founder Mode (upselling a dedicated infrastructure tier)."}
    }
}

for q_id, variants in evals.items():
    file_path = os.path.join(base_dir, f"{q_id}_eval.json")
    
    # We load it if it exists to append, but here we just write it all
    output = {
        "question_id": int(q_id.replace("q", "")),
        "timestamp": datetime.datetime.now().isoformat() + "Z",
        "evaluator": "Orchestrator_Judge",
        "evaluations": variants
    }
    
    with open(file_path, "w") as f:
        json.dump(output, f, indent=2)

print("Saved evaluations for Q6-Q10 successfully.")
