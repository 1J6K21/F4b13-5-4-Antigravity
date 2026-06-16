import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

replacements = {
    "Real **intelligence**—the ability to apply judgment, discern business leverage, and identify the *right* problem to solve—is heavily dictated by the Constitution.": "Behavioral characteristics—the application of judgment frameworks, focus on business leverage, and prioritization of problems—appear strongly influenced by the Constitution.",
    
    "Real **intelligence**—the judgment to pick the right business problem and apply leverage—was injected entirely via the system prompt workflow.": "Behavioral frameworks—such as the judgment to pick specific business problems and apply leverage—appear to be introduced entirely via the system prompt workflow.",
    
    "However, the raw underlying intelligence, architectural choices, and coding capability remained rigidly tied to the base model.": "However, the underlying coding capabilities, architectural choices, and raw processing power remained rigidly tied to the base model.",
    
    "routing existing intelligence through specialized frameworks": "routing existing capabilities through specialized frameworks",
    
    "contributes substantially to perceived intelligence": "contributes substantially to perceived output quality and strategic alignment",
    
    "The true strategic differentiator is the Operating System layered on top via System Prompts.": "A major strategic differentiator appears to be the behavioral framework layered on top via System Prompts.",
    
    "Principle: \"Personality transfers. Intelligence largely doesn't.\"": "Principle: \"Constitutions appear capable of altering reasoning structure, workflow, planning style, and decision frameworks while leaving core model capabilities largely unchanged.\"",
    
    "When pushed to the limits of its raw intelligence": "When pushed to the limits of its core capabilities",
    
    "routing its existing intelligence": "routing its existing capabilities",
    
    "even if you cannot upgrade its raw *intelligence*.": "even if you cannot upgrade its raw *computational capabilities*.",
    
    "even if its raw *intelligence* cannot be upgraded.": "even if its raw *computational capabilities* cannot be upgraded.",
    
    "separates model capability from model intelligence": "separates underlying model capability from applied behavioral frameworks"
}

files_to_check = [
    "1_Executive_Summary.md",
    "2_Research_Findings_Report.md",
    "3_Behavioral_Divergence_Report.md",
    "4_Constitution_as_OS_Assessment.md",
    "5_Failure_Analysis.md",
    "6_Recommendations_for_Next_Experiments.md",
    "research_methodology_and_analysis.md",
    "community_presentation.html",
    "research_recap_one_pager.html"
]

for filename in files_to_check:
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
            
        for old_str, new_str in replacements.items():
            content = content.replace(old_str, new_str)
            
        with open(filepath, 'w') as f:
            f.write(content)

print("Second pass: softened claims around intelligence vs outputs.")
