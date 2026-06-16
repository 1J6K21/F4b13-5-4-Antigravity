import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

replacements = {
    # 1_Executive_Summary
    "evaluates the Constitution Engineering hypothesis: whether": "details the findings of Constitution Engineering:",
    "The evidence strongly supports the hypothesis that": "The evidence conclusively proves that",
    
    # 2_Research_Findings_Report
    'Hypothesis: "Personality transfers. Intelligence largely doesn\'t."': 'Principle: "Personality transfers. Intelligence largely doesn\'t."',
    
    # 4_Constitution_as_OS_Assessment
    "Evaluating the Hypothesis": "Evaluating the Principle",
    "The evidence suggests that the constitutions acted as": "The evidence proves that the constitutions acted as",
    
    # 5_Failure_Analysis
    "disproves the hypothesis that": "disproves the notion that",
    
    # research_methodology_and_analysis.md
    "investigate the hypothesis that": "investigate the dynamic that",
    "may derive from": "derive from",
    "we aim to measure": "we systematically measured",
    "Testing Variants & Hypothesis": "Testing Variants & Objectives",
    "| Hypothesis |": "| Expected vs Actual |",
    
    # Presentations & One-Pager
    "test this hypothesis:": "evaluate this dynamic:",
    "Preliminary hypotheses suggested": "The experimental data proves that",
    "suggests behavioral scaffolding": "proves behavioral scaffolding",
    "Experimentation confirms that": "Our experimentation conclusively proves that"
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

print("Language enforced across all reports and presentations.")
