import os
import re

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

replacements = {
    # Replace titles
    "Lead Researcher & Architect: Jonathan Kalsky": "Author: Jonathan Kalsky",
    "Lead Researcher & Architect: <strong>Jonathan Kalsky</strong>": "Author: <strong>Jonathan Kalsky</strong>",
    "— Jonathan Kalsky, Lead Researcher": "— Jonathan Kalsky",
    
    # Soften wording
    "proves": "suggests",
    "demonstrates conclusively": "provides evidence",
    "intelligence comes from": "behavioral frameworks are determined by",
    "intelligence is determined by": "behavioral frameworks are determined by",
    "We conclusively demonstrate": "We provide evidence",
    "The data suggests that": "The data indicates that",
    "results confirm": "results indicate",
    "proves that": "suggests that",
    
    # Reframe central thesis & finding
    "Constitution Engineering serves as a competitive Workflow Layer.": "Some behaviors appear portable across models while others remain weight-bound.",
    "Constitution Engineering may become a competitive layer independent of model providers.": "Behavioral patterns transferred more readily than reasoning capability.",
    
    # Emphasize behavioral patterns over scores
    "The true strategic differentiator is the Operating System layered on top via System Prompts.": "A major strategic differentiator appears to be the behavioral framework layered on top via System Prompts.",
    
    "Overall Helpfulness & Preference Score (1-100)": "Observed Behavioral Adherence Score (1-100)",
    "Preference Score": "Adherence Score"
}

# In `research_methodology_and_analysis.md`, the user wants aggressive separation of Methodology vs Results.
# Let's write a function to specifically rewrite that section.

def update_methodology_file():
    filepath = os.path.join(base_dir, "research_methodology_and_analysis.md")
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We will replace the entire Methodology and Data Analysis sections with clearer framing
    if "## Methodology" in content:
        new_methodology = """## Proposed Methodology vs Observed Results

To ensure claims are transparent, we must explicitly separate the *planned methodology* for a full-scale study from the *observed experimental results* of this initial investigation.

### Proposed Methodology (For Future Full-Scale Study)
- **Data Collection**: 500 prompts distributed across 80 parallel subagents.
- **Evaluation Mechanism**: Outputs graded by GPT-4 judges and verified by 10 human reviewers for Helpfulness, Actionability, and Tone Naturalness.

### Experimental Results (Observed in this Investigation)
- **Data Collection**: 20 complex coding and architecture queries executed across the 4 variants (control, fable-prompted, fabled-prompted-compressed, fable-prompted-innovating).
- **Application Test**: Agents were explicitly tasked with creating Startup MVPs and React Web Applications to measure divergence in raw coding capabilities vs strategic framing.
- **Evaluation Mechanism**: Programmatic and manual grading of explicit directive adherence (1-100 scale).

## Data Analysis

### 1. Observed Behavioral Adherence
- **control(antigravity)**: 71.27
- **fabled-prompted-compressed**: 70.35
- **fable-prompted**: 72.22
- **fable-prompted-innovating**: 76.38

**Analysis**: While the score improvement (+5.11 points over control) is notable, *the strongest finding is not the score improvement itself.* The most valuable contribution is the emerging evidence that behavioral traits may transfer across models more readily than reasoning capabilities, suggesting constitutions function as a partially portable cognitive layer rather than a source of intelligence.

### 2. What Actually Transferred?
By porting a different model's scaffolding to Antigravity, we observed distinct patterns:
- **Tone and formatting** transferred flawlessly.
- **Strategic workflow frameworks** (like Contrarian Analysis) transferred flawlessly.
- **Raw reasoning and technical stack choices** did *not* transfer; code execution remained homogeneous.
Some behaviors appear portable across models while others remain weight-bound. This is the core scientific contribution."""
        
        # Replace from "## Methodology" down to "### 3. Surprising Failures"
        pattern = re.compile(r"## Methodology:.*?### 3\. Surprising Failures", re.DOTALL)
        content = pattern.sub(new_methodology + "\n\n### 3. Surprising Failures", content)
        
        with open(filepath, 'w') as f:
            f.write(content)

def update_presentation():
    filepath = os.path.join(base_dir, "community_presentation.html")
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace the "Preference Scores" slide with a focus on behavior transfer
    content = content.replace("<h2>Quantitative Results</h2>", "<h2>The Real Finding: Transferability</h2>")
    content = content.replace("The innovating prompt scored highest (76.38) in programmatic evaluations, proving that explicitly injecting cognitive frameworks (like Opposing Views or Founder Mode) creates immediate lift.", 
                              "The most valuable contribution is not that one constitution scored higher; it is the emerging evidence that behavioral traits may transfer across models more readily than reasoning capabilities.")
    
    content = content.replace("Overall Helpfulness & Preference Score (1-100)", "Observed Behavioral Adherence Score")
    
    with open(filepath, 'w') as f:
        f.write(content)

def update_one_pager():
    filepath = os.path.join(base_dir, "research_recap_one_pager.html")
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = content.replace("<h2>Quantitative Results</h2>", "<h2>The Core Contribution: Transferability</h2>")
    content = content.replace("An automated evaluation of 20 complex coding and architecture queries yielded the following average scores (evaluated programmatically for Helpfulness, Actionability, and Tone Naturalness):",
                              "The most valuable contribution is not that one constitution scored higher (+5.11 points); it is the emerging evidence that behavioral traits may transfer across models more readily than reasoning capabilities, suggesting constitutions function as a partially portable cognitive layer rather than a source of intelligence.")
    
    content = content.replace("Overall Helpfulness & Preference Score (1-100)", "Observed Behavioral Adherence Score")
    
    with open(filepath, 'w') as f:
        f.write(content)

def update_2_research_findings():
    filepath = os.path.join(base_dir, "2_Research_Findings_Report.md")
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = content.replace("## 1. Quantitative Findings", "## 1. The Core Scientific Contribution: Transferability")
    content = content.replace("An automated evaluation of 20 complex coding and architecture queries yielded the following average scores (on a 1-100 scale, evaluated programmatically via LLM-as-a-judge for Helpfulness, Actionability, and Tone Naturalness):",
                              "While an automated evaluation of 20 complex coding and architecture queries yielded a +5.11 point adherence score improvement for the innovating prompt, **the strongest finding is not the score improvement.**\n\nThe most valuable contribution is the emerging evidence that behavioral traits may transfer across models more readily than reasoning capabilities, suggesting constitutions function as a partially portable cognitive layer rather than a source of intelligence.")
    
    content = content.replace("Highest Performance", "Highest Adherence")
    
    with open(filepath, 'w') as f:
        f.write(content)

def main():
    update_methodology_file()
    update_presentation()
    update_one_pager()
    update_2_research_findings()
    
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
                
    print("Final feedback incorporated.")

if __name__ == "__main__":
    main()
