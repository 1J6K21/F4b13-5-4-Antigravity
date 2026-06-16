import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

# 1. Update community_presentation.html
pres_path = os.path.join(base_dir, "community_presentation.html")
if os.path.exists(pres_path):
    with open(pres_path, 'r') as f:
        content = f.read()

    # Update Title & Subtitle
    content = content.replace(
        '<h1>Constitution <span class="highlight">Engineering.</span></h1>\n            <h3>A New Competitive Layer in AI</h3>',
        '<h1>The Model is <span class="highlight">Just Hardware.</span></h1>\n            <h3>System Prompts as the Cognitive OS</h3>'
    )
    
    with open(pres_path, 'w') as f:
        f.write(content)

# 2. Update research_recap_one_pager.html
one_path = os.path.join(base_dir, "research_recap_one_pager.html")
if os.path.exists(one_path):
    with open(one_path, 'r') as f:
        content = f.read()

    # Update Title & Subtitle
    content = content.replace(
        '<h1>Constitution Engineering</h1>\n        <div class="subtitle">Evidence for System Prompts as a Workflow Optimization Layer</div>',
        '<h1>The Model is Just Hardware</h1>\n        <div class="subtitle">System Prompts as the Cognitive OS: Evidence from Constitution Engineering</div>'
    )
    
    with open(one_path, 'w') as f:
        f.write(content)

# 3. Update 1_Executive_Summary.md title
exec_path = os.path.join(base_dir, "1_Executive_Summary.md")
if os.path.exists(exec_path):
    with open(exec_path, 'r') as f:
        content = f.read()
    
    content = content.replace('# Executive Summary', '# Executive Summary: The Model is Just Hardware')
    with open(exec_path, 'w') as f:
        f.write(content)

print("Titles updated to be much catchier.")
