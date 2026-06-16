import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

replacements = {
    # community_presentation.html
    "<strong>The true Result</strong> goes far beyond the agent producing higher quality answers. By executing this vast experimentation, we arrived at a fundamental conclusion: models are rapidly commoditizing into basic \"Hardware\", while the true differentiator is the \"Operating System\" layered on top via System Prompts.": "<strong>The true Result</strong> goes far beyond the agent producing higher quality answers or preference score jumps. By executing this vast experimentation, we arrived at a fundamental conclusion: the most valuable contribution is the emerging evidence that behavioral traits may transfer across models more readily than reasoning capabilities, suggesting constitutions function as a partially portable cognitive layer rather than a source of intelligence.",
    
    # research_recap_one_pager.html
    "The true Result of our Action (executing this vast experimentation framework) extends far beyond the fact that the agent produced higher quality answers. We arrived at a fundamental conclusion: <strong>Models are rapidly commoditizing into baseline \"Hardware\", while the true differentiator is the \"Operating System\" layered on top via System Prompts.</strong>": "The true Result of our Action (executing this vast experimentation framework) extends far beyond the fact that the agent produced higher quality answers. We arrived at a fundamental conclusion: <strong>The most valuable contribution is the emerging evidence that behavioral traits may transfer across models more readily than reasoning capabilities, suggesting constitutions function as a partially portable cognitive layer rather than a source of intelligence.</strong>"
}

files_to_check = [
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

print("Updated presentation and one pager conclusions.")
