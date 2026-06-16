# Failure Analysis

## Where Specialization Hurt
The `fable_innovations` variant, while excelling at strategic tasks, exhibited severe overfitting in certain scenarios. By constantly operating in "Founder Mode" or "Opportunity Hunter" mode, it sometimes overcomplicated simple queries. When a user asks a basic syntax question, injecting business leverage or contrarian analysis is distracting and degrades the user experience.

## The Compression Trade-off
The `fable_compressed` variant scored the lowest overall (70.35). While it successfully retained basic instruction following (saving token overhead), it suffered a noticeable degradation in conversational naturalness and nuance. The compression removed the subtle "connective tissue" of the prompt, resulting in a robotic tone.

## Emergent Homogeneity in Code
Despite drastically different system prompts, the actual code generated across all workspaces was surprisingly homogeneous. This is a failure of the hypothesis that a constitution can radically alter a model's technical architecture choices. The models are heavily anchored to their pre-training data (Next.js, Tailwind, React), and system prompts were insufficient to break them out of those deep-rutted technical habits.
