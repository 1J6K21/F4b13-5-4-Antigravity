# Failure Analysis

## Where Specialization Hurt
The `fable-prompted-innovating` variant, while excelling at strategic tasks, exhibited overfitting. Operating constantly in "Founder Mode" or "Opportunity Hunter" mode caused it to overcomplicate simple queries. For basic syntax questions, injecting business leverage or contrarian analysis is distracting and degrades the user experience.

**The Solution: Multi-Agent Architecture**
To solve this specialization overfitting, the architecture must evolve beyond a single monolithic prompt. A router agent should classify the user's intent, and then hand off the task to specialized subagents with distinctly engineered personalities—e.g., a 'Founder' agent for strategic analysis, a 'Coder' agent for raw syntax, and a 'Financer' agent for budgeting. This allows extreme specialization without degrading general capability.

## The Compression Trade-off
The `fabled-prompted-compressed` variant scored the lowest overall (70.35). While it retained basic instruction following, it suffered a noticeable degradation in conversational naturalness. Compression removed the necessary "connective tissue" of the prompt, resulting in a robotic tone.

## Emergent Homogeneity in Code
Despite drastically different system prompts, the actual code generated across all workspaces was largely homogeneous. This dissuggests the notion that a constitution can radically alter a model's technical architecture choices. The models remain heavily anchored to their pre-training data distributions (e.g., Next.js, Tailwind, React).
