import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

replacements = {
    # Main harsh phrases to soften
    "conclusively proves": "provides evidence that",
    "intelligence comes from the workflow": "behavior and decision frameworks appear strongly influenced by workflow design",
    "constitutions dictate strategic intelligence": "constitutions appear to shape strategic behavior",
    "Personality and workflow transfer. Underlying intelligence does not.": "Constitutions appear capable of altering reasoning structure, workflow, planning style, and decision frameworks while leaving core model capabilities largely unchanged.",
    "The experimental data proves that": "The experimental data suggests that",
    "proves behavioral scaffolding": "suggests behavioral scaffolding",
    "The evidence proves that the constitutions acted as": "The evidence suggests that the constitutions acted as",
    
    # Titles to soften
    "Why the Model is Just Hardware": "Evidence from a Constitution Engineering Experiment",
    "Why the Underlying Model is Just Hardware": "Evidence from a Constitution Engineering Experiment",
    
    # Catch any remaining harsh 'proves'
    "The data proves that": "The data provides evidence that",
    "conclusively proves that": "provides evidence that",
    "proves that constitutions": "provides evidence that constitutions",
    "The evidence conclusively proves": "The evidence provides evidence", # We replaced 'conclusively proves' already, but wait, 'evidence conclusively proves' -> 'evidence provides evidence' sounds bad.
    "The evidence provides evidence that": "The evidence suggests that", # Cleanup in case the previous rule created this
}

# Add cleanup rule for double replace
replacements["The evidence provides evidence that"] = "The evidence suggests that"

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

print("Dialed back certainty across all reports and presentations.")
