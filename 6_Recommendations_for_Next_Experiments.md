# Recommendations for Next Experiments

### Supported Claims
- Behavioral scaffolding (tone, structure, explicit frameworks) transfers flawlessly via system prompts.
- Specialization (injecting specific cognitive frameworks) significantly outperforms generalized helpfulness for complex, strategic queries.

### Weakly Supported Claims
- "Constitution = Operating System". The evidence supports this only if we define an OS as a "Workflow Layer". It does not hold up if we define an OS as something that fundamentally upgrades the hardware's capabilities.

### Disproven Claims
- Compression retains 90% of behavioral transfer. The evidence shows that highly compressed prompts degrade conversational naturalness and score lower than the control.

### Most Important Discovery
**The "Workflow Layer" Threshold**: The most important finding is that injecting explicit, step-by-step cognitive algorithms (like the Contrarian Research Assistant) into the system prompt reliably forces the model to execute that algorithm before answering. This proves that you can program a model's *workflow* via prompt, even if you cannot upgrade its raw *intelligence*.

### Next Steps
1. **Dynamic Constitutions**: Test a system that dynamically hot-swaps constitutions based on the user's query (e.g., switching from "Founder Mode" to "Standard Helpful" to avoid the specialization failure mode).
2. **Technical Constraints**: Conduct an experiment forcing the model to use obscure or novel tech stacks to see if a strict constitution can break the emergent homogeneity observed in the code generation tasks.
