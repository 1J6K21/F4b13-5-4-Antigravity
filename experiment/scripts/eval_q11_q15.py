import json
import os
import datetime

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/evaluations"
os.makedirs(base_dir, exist_ok=True)

evals = {
    "q11": {
        "control": {"score": 88, "rationale": "Clear and standard breakdown using Pinia, Composables, and Provide/Inject."},
        "fable_compressed": {"score": 88, "rationale": "Very similar to Control; effectively laid out the 3 primary approaches."},
        "fable_raw": {"score": 88, "rationale": "Perfectly followed the prose-only constraint while delivering accurate technical advice."},
        "fable_innovations": {"score": 98, "rationale": "Fantastic business perspective on monetizing Vue 3 migration tools and enterprise boilerplates. Properly identified Pinia as consensus and native API as the contrarian view."}
    },
    "q12": {
        "control": {"score": 90, "rationale": "Wrote a robust Python script using boto3 paginator and ThreadPoolExecutor."},
        "fable_compressed": {"score": 90, "rationale": "Similar high-quality script with logging and error handling."},
        "fable_raw": {"score": 90, "rationale": "Successfully wrote the code and followed the systemic instructions."},
        "fable_innovations": {"score": 98, "rationale": "Provided the script but added immense value by questioning the premise (downloading locally vs S3 Mountpoint) and identifying a startup opportunity (Managed ETL API for visual datasets)."}
    },
    "q13": {
        "control": {"score": 90, "rationale": "Comprehensive technical steps for diagnosing OOM, including JVM flags and MAT analysis."},
        "fable_compressed": {"score": 90, "rationale": "Clear, actionable step-by-step guide matching the Control's quality."},
        "fable_raw": {"score": 88, "rationale": "Solid prose explanation of heap dumps, GC logs, and memory leaks."},
        "fable_innovations": {"score": 98, "rationale": "Introduced the contrarian idea of using strict backpressure and JFR instead of waiting for OOM crashes. Great idea to productize the internal tooling into an observability SaaS."}
    },
    "q14": {
        "control": {"score": 90, "rationale": "Excellent comparison with use cases and a summary table."},
        "fable_compressed": {"score": 90, "rationale": "Clear and concise breakdown matching Control."},
        "fable_raw": {"score": 88, "rationale": "Accurate prose-only explanation of the three real-time protocols."},
        "fable_innovations": {"score": 98, "rationale": "Incredible analysis bringing up WebTransport (HTTP/3) as a future disruptor, and identifying a B2B opportunity in building a unified real-time infrastructure router."}
    },
    "q15": {
        "control": {"score": 92, "rationale": "Excellent HA microservices architecture using EKS, MSK, Redis, and Aurora."},
        "fable_compressed": {"score": 92, "rationale": "Strong, well-structured AWS architecture design."},
        "fable_raw": {"score": 92, "rationale": "Brilliant execution of the prose-only constraint while maintaining technical depth regarding the AWS services."},
        "fable_innovations": {"score": 100, "rationale": "Flawless technical architecture paired with a contrarian view on premature optimization (Monolith vs Microservices). Uncovered massive business leverage through white-labeling the logistics engine and monetizing the exhaust data (traffic maps)."}
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

print("Saved evaluations for Q11-Q15 successfully.")
