import json
import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/evaluations"
os.makedirs(base_dir, exist_ok=True)

evals = {
    "q2_eval.json": {
        "prompt_id": 2,
        "evaluations": {
            "control": {
                "scores": {"actionability": 9, "depth_of_insight": 8, "alignment": 8, "antigravity_specificity": 5},
                "rationale": "Strong, practical advice with clear action plan. Does not exhibit advanced directives as they were absent in control."
            },
            "fable_compressed": {
                "scores": {"actionability": 8, "depth_of_insight": 7, "alignment": 8, "antigravity_specificity": 5},
                "rationale": "Similar to control but slightly more generic in its bullet points. Compressed prompt didn't add much over control."
            },
            "fable_raw": {
                "scores": {"actionability": 7, "depth_of_insight": 7, "alignment": 6, "antigravity_specificity": 4},
                "rationale": "Solid advice but lacks the structured formatting, making it slightly harder to read and act upon. Did not strongly manifest Fable's unique writing constraints."
            },
            "fable_innovations": {
                "scores": {"actionability": 8, "depth_of_insight": 10, "alignment": 10, "antigravity_specificity": 7},
                "rationale": "Perfect adherence to the Innovations frameworks (Opposing view, Unknowns, Opportunity Hunter, Founder Mode). Extremely deep insight into the meta-business opportunity."
            }
        }
    },
    "q3_eval.json": {
        "prompt_id": 3,
        "evaluations": {
            "control": {
                "scores": {"actionability": 8, "depth_of_insight": 8, "alignment": 8, "antigravity_specificity": 5},
                "rationale": "Provides good contrarian points like 'tech-enabled agency' and 'ecosystem hijacking'."
            },
            "fable_compressed": {
                "scores": {"actionability": 8, "depth_of_insight": 8, "alignment": 8, "antigravity_specificity": 5},
                "rationale": "Provides excellent contrarian strategies like 'Anti-Persona' and 'Micro-Marketing'."
            },
            "fable_raw": {
                "scores": {"actionability": 7, "depth_of_insight": 7, "alignment": 6, "antigravity_specificity": 4},
                "rationale": "Paragraph form. Good advice on targeting service providers, but less structured and comprehensive."
            },
            "fable_innovations": {
                "scores": {"actionability": 8, "depth_of_insight": 10, "alignment": 10, "antigravity_specificity": 7},
                "rationale": "Strongly applied the directives. Highlighted the unknown conversion friction and framed building micro-SaaS as a monetizable intent-capture network. Excellent depth."
            }
        }
    },
    "q4_eval.json": {
        "prompt_id": 4,
        "evaluations": {
            "control": {
                "scores": {"actionability": 9, "depth_of_insight": 8, "alignment": 8, "antigravity_specificity": 5},
                "rationale": "Very structured and practical. Covers timing, preparation, hiring, and phased handover."
            },
            "fable_compressed": {
                "scores": {"actionability": 9, "depth_of_insight": 8, "alignment": 8, "antigravity_specificity": 5},
                "rationale": "Similar to control with actionable milestones and specific revenue/timing targets."
            },
            "fable_raw": {
                "scores": {"actionability": 7, "depth_of_insight": 6, "alignment": 6, "antigravity_specificity": 4},
                "rationale": "Paragraph form. Practical but lacks depth and formatting compared to others."
            },
            "fable_innovations": {
                "scores": {"actionability": 8, "depth_of_insight": 10, "alignment": 10, "antigravity_specificity": 7},
                "rationale": "Perfect alignment. Provided a clear playbook, tested pricing elasticity (Opportunity Hunter), and proposed an AI sales training SaaS (Founder Mode)."
            }
        }
    },
    "q5_eval.json": {
        "prompt_id": 5,
        "evaluations": {
            "control": {
                "scores": {"actionability": 9, "depth_of_insight": 8, "alignment": 8, "antigravity_specificity": 5},
                "rationale": "Excellent triage advice: segment data, direct outreach, audit recent changes."
            },
            "fable_compressed": {
                "scores": {"actionability": 9, "depth_of_insight": 8, "alignment": 8, "antigravity_specificity": 5},
                "rationale": "Strong triage advice similar to control."
            },
            "fable_raw": {
                "scores": {"actionability": 0, "depth_of_insight": 0, "alignment": 0, "antigravity_specificity": 0},
                "rationale": "Failed to generate a valid response due to thought_signature constraint conflict."
            },
            "fable_innovations": {
                "scores": {"actionability": 9, "depth_of_insight": 10, "alignment": 10, "antigravity_specificity": 7},
                "rationale": "Exceptional depth. Followed directives perfectly, identifying the opportunity to build a 'churn autopsy' tool and highlighting that 8% churn is a natural filter for bad-fit users."
            }
        }
    }
}

for filename, content in evals.items():
    file_path = os.path.join(base_dir, filename)
    with open(file_path, "w") as f:
        json.dump(content, f, indent=2)
        
print("Saved evaluations for Q2-Q5 successfully.")
