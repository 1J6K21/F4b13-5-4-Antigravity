import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

# 1. Update community_presentation.html
pres_path = os.path.join(base_dir, "community_presentation.html")
if os.path.exists(pres_path):
    with open(pres_path, 'r') as f:
        content = f.read()

    # Fix Header
    content = content.replace(
        '<p style="font-size: 1.2rem; color: #00ffcc;">Lead Researcher & Architect: <strong>Jonathan Kalsky</strong></p>',
        '<p style="font-size: 1.2rem; color: #00ffcc; margin-top: 20px;">By Jonathan Kalsky</p>'
    )
    
    # Remove redundant quotes
    content = content.replace(
        '<p style="text-align: right; font-style: italic; color: #888;">— Jonathan Kalsky</p>',
        ''
    )
    
    # Remove the quotes around the text itself since it's an assertion, not a quote
    content = content.replace(
        '"Models are rapidly commoditizing into baseline <strong>Hardware</strong>. The true strategic differentiator is the <strong>Operating System</strong> layered on top via System Prompts. Capability comes from the weights; intelligence comes from the workflow."',
        'Models are rapidly commoditizing into baseline <strong>Hardware</strong>. The true strategic differentiator is the <strong>Operating System</strong> layered on top via System Prompts. Capability comes from the weights; intelligence comes from the workflow.'
    )

    with open(pres_path, 'w') as f:
        f.write(content)


# 2. Update research_recap_one_pager.html
one_path = os.path.join(base_dir, "research_recap_one_pager.html")
if os.path.exists(one_path):
    with open(one_path, 'r') as f:
        content = f.read()

    # Fix Header
    content = content.replace(
        '<h1>Deep Dive Research Report: Constitution Engineering</h1>',
        '<h1>Constitution Engineering</h1>'
    )
    content = content.replace(
        '<div style="margin-top: 15px; font-weight: bold; color: var(--accent);">Lead Researcher & Architect: Jonathan Kalsky</div>',
        '<div style="margin-top: 15px; font-weight: 600; color: #666;">By Jonathan Kalsky</div>'
    )
    
    # Remove redundant quotes
    content = content.replace(
        '<div class="author">— Jonathan Kalsky, Lead Researcher</div>',
        ''
    )
    
    # Remove the quotation marks around the assertion
    content = content.replace(
        '<strong>The "Hardware vs. OS" Paradigm:</strong> "Models are rapidly commoditizing into baseline Hardware. The true strategic differentiator is the Operating System layered on top via System Prompts. Capability comes from the weights; intelligence comes from the workflow."',
        '<strong>The Hardware vs. OS Paradigm:</strong> Models are rapidly commoditizing into baseline Hardware. The true strategic differentiator is the Operating System layered on top via System Prompts. Capability comes from the weights; intelligence comes from the workflow.'
    )
    
    # Remove quotation marks from the top quote box
    content = content.replace(
        '"Personality and workflow transfer. Underlying intelligence does not."',
        'Personality and workflow transfer. Underlying intelligence does not.'
    )

    with open(one_path, 'w') as f:
        f.write(content)

print("Headers simplified and redundant self-quotes removed.")
