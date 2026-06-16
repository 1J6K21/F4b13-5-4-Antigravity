# Research Methodology & Analysis: Constitution Engineering

## Objective
To investigate the dynamic that a significant portion of perceived model improvements derive from behavioral scaffolding (system prompts) rather than model weights alone. Additionally, we systematically measured the impact of injecting specialized cognitive frameworks (e.g., Opportunity Hunter, Contrarian Research Assistant) into the system prompt to determine if Constitution Engineering can serve as a distinct workflow layer.

## Instructions for Editing Antigravity System Prompt
To perform these tests on Antigravity:
1. **Access Prompt Configuration**: Locate the `system_prompt` configuration file.
2. **Inject Variant**: Copy the contents of the desired variant (`prompt_1_base_antigravity.md`, `prompt_2_fable_raw_antigravity.md`, `prompt_3_fable_compressed.md`, `prompt_4_fable_with_innovations.md`).
3. **Overwrite**: Replace the existing Antigravity system prompt completely with the variant text.
4. **Deploy & Reset**: Restart the Antigravity instance to ensure context windows are cleared.
5. **Run Evaluation Suite**: Execute the automated 20-query benchmark suite.

## Testing Variants & Objectives

| Variant | Internal Name | Purpose | Expected vs Actual |
| :--- | :--- | :--- | :--- |
| **prompt_1_base_antigravity** | `control(antigravity)` | Control | Establishes the baseline capability and tone of the model's raw weights. |
| **prompt_2_fable_raw** | `fable-prompted` | Transferability | If performance/preference jumps, it suggests behavioral frameworks are transferable. |
| **prompt_3_fable_compressed** | `fabled-prompted-compressed` | Efficiency | Will a highly compressed prompt save token overhead without degrading behavior? |
| **prompt_4_fable_innovations** | `fable-prompted-innovating` | Specialization | Injecting explicit cognitive frameworks will outperform generalized helpfulness. |

## Methodology: How Metrics Were Gathered
To ensure claims are robust, we executed an automated benchmark utilizing an orchestrator agent.
- **Data Collection**: 80 subagents executed 20 complex coding and architecture queries in parallel across the 4 variants.
- **Evaluation Mechanism**: Outputs were graded programmatically using an LLM-as-a-judge system on a 1-100 scale for Helpfulness, Actionability, and Tone Naturalness.
- **Application Test**: Agents were explicitly tasked with creating Startup MVPs and React Web Applications to measure divergence in raw coding capabilities vs strategic framing.

## Data Analysis

### 1. Overall Helpfulness & Preference Score (1-100)
- **control(antigravity)**: 71.27
- **fabled-prompted-compressed**: 70.35
- **fable-prompted**: 72.22
- **fable-prompted-innovating**: 76.38

**Analysis**: Results confirm that explicit behavioral scaffolding and cognitive frameworks substantially improve output value (+5.11 points over control). Compression degraded the score.

### 2. What Actually Transferred?
By porting a different model's scaffolding to Antigravity, we observed distinct patterns:
- Tone and formatting transferred flawlessly.
- Strategic workflow frameworks (like Contrarian Analysis) transferred flawlessly.
- Raw reasoning and technical stack choices did *not* transfer; code execution remained homogeneous.

### 3. Surprising Failures
- **Compression Degradation**: Prompt 3 (`fabled-prompted-compressed`) severely degraded conversational naturalness.
- **Overfitting**: In Prompt 4 (`fable-prompted-innovating`), injecting "Founder Mode" caused the model to overcomplicate basic retrieval tasks by searching for unnecessary business leverage.

## Final Conclusion
**Constitution Engineering serves as a competitive Workflow Layer.**
Our findings provide evidence that shifting optimization targets toward explicit frameworks separates underlying model capability from applied behavioral frameworks, allowing builders to route raw computational power through specialized workflows.
