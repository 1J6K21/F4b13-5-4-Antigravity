import matplotlib.pyplot as plt
import numpy as np
import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"

# 1. Bar chart for overall scores
labels = ['fabled-compressed', 'control', 'fable-prompted', 'fable-innovating']
scores = [70.35, 71.27, 72.22, 76.38]
colors = ['#4e4e50', '#6b6b6b', '#9a8478', '#c3073f']

fig, ax = plt.subplots(figsize=(10, 6))
bars = ax.bar(labels, scores, color=colors)
ax.set_ylabel('Avg Score (1-100)', fontsize=12, weight='bold')
ax.set_title('Overall Performance on 20-Query Architecture Benchmark', fontsize=14, weight='bold')
ax.set_ylim(65, 80)

for bar in bars:
    yval = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2, yval + 0.2, f'{yval}', ha='center', va='bottom', fontsize=12, weight='bold')

plt.tight_layout()
plt.savefig(os.path.join(base_dir, 'scores_chart.png'), dpi=300)
plt.close()

# 2. Refactored Transferability Chart based on ACTUAL Prompt Directives
categories = ['Tone & Formatting', 'Cognitive Workflows', 'Tool Autonomy', 'Recursive Self-Improvement']
transfer_levels = [100, 100, 60, 0] # 100=High, 60=Medium, 0=None
colors_transfer = ['#2ecc71', '#2ecc71', '#f39c12', '#e74c3c']

fig, ax = plt.subplots(figsize=(9, 5))
bars = ax.barh(categories, transfer_levels, color=colors_transfer)

ax.set_xlabel('Compliance / Transferability (%)', fontsize=12, weight='bold')
ax.set_title('Compliance Rates for Injected Directives', fontsize=14, weight='bold')
ax.set_xlim(0, 110)
ax.set_xticks([0, 60, 100])
ax.set_xticklabels(['Failed (0%)', 'Partial (60%)', 'Perfect (100%)'])

plt.tight_layout()
plt.savefig(os.path.join(base_dir, 'transferability_chart.png'), dpi=300)
plt.close()

print("Refactored charts generated successfully.")
