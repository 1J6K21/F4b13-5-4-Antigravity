import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

pres_path = os.path.join(base_dir, "community_presentation.html")
if os.path.exists(pres_path):
    with open(pres_path, 'r') as f:
        content = f.read()
    content = content.replace(
        '<h1>The Model is <span class="highlight">Just Hardware.</span></h1>\n            <h3>System Prompts as the Cognitive OS</h3>',
        '<h1>System Prompts as the <span class="highlight">Cognitive OS.</span></h1>\n            <h3>Why the Model is Just Hardware</h3>'
    )
    with open(pres_path, 'w') as f:
        f.write(content)

one_path = os.path.join(base_dir, "research_recap_one_pager.html")
if os.path.exists(one_path):
    with open(one_path, 'r') as f:
        content = f.read()
    content = content.replace(
        '<h1>The Model is Just Hardware</h1>\n        <div class="subtitle">System Prompts as the Cognitive OS: Evidence from Constitution Engineering</div>',
        '<h1>System Prompts as the Cognitive OS</h1>\n        <div class="subtitle">Why the Model is Just Hardware: Evidence from Constitution Engineering</div>'
    )
    with open(one_path, 'w') as f:
        f.write(content)

exec_path = os.path.join(base_dir, "1_Executive_Summary.md")
if os.path.exists(exec_path):
    with open(exec_path, 'r') as f:
        content = f.read()
    content = content.replace(
        '# Executive Summary: The Model is Just Hardware',
        '# Executive Summary: System Prompts as the Cognitive OS (Why the Model is Just Hardware)'
    )
    with open(exec_path, 'w') as f:
        f.write(content)

print("Titles swapped successfully.")
