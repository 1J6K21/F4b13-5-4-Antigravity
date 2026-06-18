import matplotlib.pyplot as plt
import os

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity"
assets_dir = os.path.join(base_dir, "website/src/assets")
os.makedirs(assets_dir, exist_ok=True)

# Set custom styling parameters
plt.rcParams['figure.facecolor'] = '#121214'
plt.rcParams['axes.facecolor'] = '#1a1a1f'
plt.rcParams['text.color'] = '#e2e2e7'
plt.rcParams['axes.labelcolor'] = '#e2e2e7'
plt.rcParams['xtick.color'] = '#a1a1aa'
plt.rcParams['ytick.color'] = '#a1a1aa'
plt.rcParams['grid.color'] = '#27272a'

# 1. Overfitting Rate Bar Chart
labels = ['Control', 'Monolithic', 'Founder OS', 'Systems Eng', 'Scientist OS', 'Teacher OS']
overfitting_rates = [0.0, 100.0, 0.0, 0.0, 0.0, 0.0]
colors = ['#2ecc71', '#e74c3c', '#2ecc71', '#2ecc71', '#2ecc71', '#2ecc71']

fig, ax = plt.subplots(figsize=(10, 5))
bars = ax.bar(labels, overfitting_rates, color=colors, edgecolor='#27272a', width=0.6)

ax.set_ylabel('Heuristic Overfitting Rate (%)', fontsize=12, weight='bold', labelpad=10)
ax.set_title('Context Poisoning & Overfitting on Operational Coding Tasks', fontsize=14, weight='bold', pad=15)
ax.set_ylim(0, 110)
ax.grid(axis='y', linestyle='--', alpha=0.5)

# Add values on top of bars
for bar in bars:
    yval = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2.0, yval + 2.0, f'{yval}%', ha='center', va='bottom', fontsize=11, weight='bold')

plt.tight_layout()
plt.savefig(os.path.join(assets_dir, 'phase2_overfitting_chart.png'), dpi=300, facecolor='#121214')
plt.close()

# 2. Decision Divergence Index Bar Chart
categories = ['Founder OS', 'Systems Eng', 'Scientist OS', 'Teacher OS', 'Monolithic']
divergence_indices = [84.6, 89.3, 90.3, 89.3, 88.6]
colors_div = ['#3498db', '#9b59b6', '#1abc9c', '#f1c40f', '#95a5a6']

fig, ax = plt.subplots(figsize=(10, 5))
bars = ax.bar(categories, divergence_indices, color=colors_div, edgecolor='#27272a', width=0.5)

ax.set_ylabel('Divergence Index (Jaccard Distance %)', fontsize=12, weight='bold', labelpad=10)
ax.set_title('Decision-Making Divergence relative to Control Baseline', fontsize=14, weight='bold', pad=15)
ax.set_ylim(0, 110)
ax.grid(axis='y', linestyle='--', alpha=0.5)

# Add values on top of bars
for bar in bars:
    yval = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2.0, yval + 2.0, f'{yval}%', ha='center', va='bottom', fontsize=11, weight='bold')

plt.tight_layout()
plt.savefig(os.path.join(assets_dir, 'phase2_divergence_chart.png'), dpi=300, facecolor='#121214')
plt.close()

print("Phase 2 charts generated successfully in website/src/assets/")
