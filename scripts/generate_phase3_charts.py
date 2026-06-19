import matplotlib.pyplot as plt
import numpy as np
import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"
assets_dir = os.path.join(base_dir, "website/src/assets")
os.makedirs(assets_dir, exist_ok=True)

# Set custom styling parameters matching dark theme
plt.rcParams['figure.facecolor'] = '#121214'
plt.rcParams['axes.facecolor'] = '#1a1a1f'
plt.rcParams['text.color'] = '#e2e2e7'
plt.rcParams['axes.labelcolor'] = '#e2e2e7'
plt.rcParams['xtick.color'] = '#a1a1aa'
plt.rcParams['ytick.color'] = '#a1a1aa'
plt.rcParams['grid.color'] = '#27272a'

# Chart 1: Quality Dimensions Comparison (Side-by-side grouped bar chart)
labels = ['Outcome Quality', 'Code Maintainability', 'Verification & Testing']
control_scores = [3.1, 2.8, 3.0]
coherent_scores = [4.8, 4.7, 4.9]

x = np.arange(len(labels))
width = 0.35

fig, ax = plt.subplots(figsize=(10, 5))
rects1 = ax.bar(x - width/2, control_scores, width, label='Generalist Control', color='#a1a1aa', edgecolor='#27272a')
rects2 = ax.bar(x + width/2, coherent_scores, width, label='Coherent Specialist Team', color='#2ecc71', edgecolor='#27272a')

ax.set_ylabel('Score (1.0 - 5.0 Scale)', fontsize=12, weight='bold', labelpad=10)
ax.set_title('Quality & Robustness Dimensions Comparison (Sprint Track)', fontsize=14, weight='bold', pad=15)
ax.set_xticks(x)
ax.set_xticklabels(labels, fontsize=11)
ax.set_ylim(0, 5.5)
ax.legend(facecolor='#1a1a1f', edgecolor='#27272a', labelcolor='#e2e2e7')
ax.grid(axis='y', linestyle='--', alpha=0.5)

# Add values on top of bars
def autolabel(rects):
    for rect in rects:
        height = rect.get_height()
        ax.annotate(f'{height:.1f}',
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3),  # 3 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=10, weight='bold')

autolabel(rects1)
autolabel(rects2)

plt.tight_layout()
plt.savefig(os.path.join(assets_dir, 'phase3_quality_chart.png'), dpi=300, facecolor='#121214')
plt.close()

# Chart 2: Security & Robustness Resolution Rate (%)
setups = ['Generalist Control', 'Coherent Specialist Team']
resolution_rates = [60.0, 100.0]
colors = ['#f1c40f', '#2ecc71']

fig, ax = plt.subplots(figsize=(6, 5))
bars = ax.bar(setups, resolution_rates, color=colors, edgecolor='#27272a', width=0.5)

ax.set_ylabel('Security Vulnerability Resolution Rate (%)', fontsize=12, weight='bold', labelpad=10)
ax.set_title('Security Hardening Performance (Track 2)', fontsize=13, weight='bold', pad=15)
ax.set_ylim(0, 110)
ax.grid(axis='y', linestyle='--', alpha=0.5)

# Add values on top of bars
for bar in bars:
    yval = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2.0, yval + 2.0, f'{int(yval)}%', ha='center', va='bottom', fontsize=11, weight='bold')

plt.tight_layout()
plt.savefig(os.path.join(assets_dir, 'phase3_security_chart.png'), dpi=300, facecolor='#121214')
plt.close()

print("Phase 3 charts generated successfully in website/src/assets/")
