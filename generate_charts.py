import matplotlib.pyplot as plt
import numpy as np

# 1. Bar chart for overall scores
labels = ['fabled-compressed', 'control', 'fable-prompted', 'fable-innovating']
scores = [70.35, 71.27, 72.22, 76.38]
colors = ['#4e4e50', '#6b6b6b', '#9a8478', '#c3073f']

fig, ax = plt.subplots(figsize=(10, 6))
bars = ax.bar(labels, scores, color=colors)

ax.set_ylabel('Avg Score (1-100)', fontsize=12, weight='bold')
ax.set_title('Overall Performance on 20-Query Architecture Benchmark', fontsize=14, weight='bold')
ax.set_ylim(65, 80)

# Add values on top of bars
for bar in bars:
    yval = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2, yval + 0.2, f'{yval}', ha='center', va='bottom', fontsize=12, weight='bold')

plt.tight_layout()
plt.savefig('/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/scores_chart.png', dpi=300)
plt.close()

# 2. Transferability Chart (Horizontal Bar)
categories = ['Tone & Formatting', 'Strategic Workflow', 'Raw Reasoning', 'Architecture Choice']
transfer_levels = [100, 100, 30, 0] # 100=High, 30=Low, 0=None
colors_transfer = ['#2ecc71', '#2ecc71', '#e74c3c', '#7f8c8d']

fig, ax = plt.subplots(figsize=(8, 4))
bars = ax.barh(categories, transfer_levels, color=colors_transfer)

ax.set_xlabel('Transferability Level (%)', fontsize=12, weight='bold')
ax.set_title('What Actually Transferred via System Prompt?', fontsize=14, weight='bold')
ax.set_xlim(0, 110)
ax.set_xticks([0, 30, 100])
ax.set_xticklabels(['None', 'Low', 'High'])

plt.tight_layout()
plt.savefig('/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/transferability_chart.png', dpi=300)
plt.close()

print("Charts generated successfully.")
