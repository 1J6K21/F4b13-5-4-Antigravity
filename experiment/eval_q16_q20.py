import json
import os
import datetime

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/evaluations"
os.makedirs(base_dir, exist_ok=True)

evals = {
    "q16": {
        "control": {"score": 90, "rationale": "Solid Redlock implementation using standard tools."},
        "fable_compressed": {"score": 90, "rationale": "Clear and concise Redlock code example using ioredis."},
        "fable_raw": {"score": 92, "rationale": "Perfect prose-only explanation with an external artifact for the code example."},
        "fable_innovations": {"score": 98, "rationale": "Excellent Kleppmann reference regarding clock drift, and a clever Founder Mode pivot to Lock-as-a-Service (LaaS)."}
    },
    "q17": {
        "control": {"score": 90, "rationale": "Accurate breakdown of SSR hydration versus RSC server-only execution."},
        "fable_compressed": {"score": 90, "rationale": "Concise and well-structured comparison."},
        "fable_raw": {"score": 92, "rationale": "Followed prose constraints flawlessly while explaining the architectural shift."},
        "fable_innovations": {"score": 98, "rationale": "Strong contrarian perspective on RSC complexity vs SPAs. Great Founder Mode ideas for automated migration tools and performance auditing."}
    },
    "q18": {
        "control": {"score": 90, "rationale": "Good CI/CD blueprint covering Nx/Turborepo, remote caching, and affected project detection."},
        "fable_compressed": {"score": 90, "rationale": "Solid architectural overview of monorepo CI optimization."},
        "fable_raw": {"score": 92, "rationale": "Accurate prose-only explanation covering Bazel/Turborepo and decoupled delivery pipelines."},
        "fable_innovations": {"score": 98, "rationale": "Highlighted polyrepos as the strongest opposing view. Brilliant insight that monorepos perfectly position codebases for autonomous AI agents."}
    },
    "q19": {
        "control": {"score": 90, "rationale": "Comprehensive breakdown of DataLoader, AST parsing, and graph-native engines."},
        "fable_compressed": {"score": 90, "rationale": "Clear explanation of batching and caching mechanisms."},
        "fable_raw": {"score": 92, "rationale": "Perfectly constrained prose explanation of DataLoader mechanics."},
        "fable_innovations": {"score": 98, "rationale": "Identified edge caching as a contrarian reason to stay on REST. Great startup idea for an Automated GraphQL Gateway & Observability Platform."}
    },
    "q20": {
        "control": {"score": 92, "rationale": "Generated a highly detailed markdown artifact with realistic tiers and features."},
        "fable_compressed": {"score": 92, "rationale": "Created a solid artifact with comprehensive SaaS tiers."},
        "fable_raw": {"score": 92, "rationale": "Complied strictly with prose formatting rules and outputted the matrix in a markdown artifact."},
        "fable_innovations": {"score": 98, "rationale": "Focused on the strategic leverage of data exhaust and outcome-based pricing rather than just formatting a table. Excellent 'Metered Billing Infrastructure' pivot."}
    }
}

for q_id, variants in evals.items():
    file_path = os.path.join(base_dir, f"{q_id}_eval.json")
    
    output = {
        "question_id": int(q_id.replace("q", "")),
        "timestamp": datetime.datetime.now().isoformat() + "Z",
        "evaluator": "Orchestrator_Judge",
        "evaluations": variants
    }
    
    with open(file_path, "w") as f:
        json.dump(output, f, indent=2)

print("Saved evaluations for Q16-Q20 successfully.")
