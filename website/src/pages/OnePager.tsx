import scoresChart from '../assets/scores_chart.png';
import transferabilityChart from '../assets/transferability_chart.png';
import './OnePager.css';

export function OnePager() {
  return (
    <div className="one-pager container">
      <div className="report-header text-center">
        <h1 className="report-title">The Constitution as an Operating System</h1>
        <div className="report-subtitle text-gradient-accent">A Deep Dive into Prompt Engineering and Agent Workflows</div>
        <div className="mt-4 text-secondary font-medium">By Jonathan Kalsky</div>
      </div>

      <div className="glass-panel content-section p-4 mb-6 border-accent bg-secondary-bg">
        <p className="text-sm text-secondary">
          <strong>*Disclaimer regarding "Fable":</strong> The term "fable" used throughout our experimental variants refers directly to the system prompt instructions originally published in the <a href="https://github.com/elder-plinius/CL4R1T4S/blob/main/ANTHROPIC/CLAUDE-FABLE-5.md" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">CL4R1T4S repository by elder-plinius</a>. Our research explicitly investigates what happens when you take those exact alignment directives and layer them onto entirely different AI models to see if the behaviors transfer.
        </p>
      </div>

      <div className="glass-panel content-section">
        <h2>Executive Summary</h2>
        <p>The AI industry is currently obsessed with making base models smarter. But after running massive parallel benchmarks across different agents, we found something surprising: <strong>raw capability isn't the bottleneck anymore—workflow is.</strong></p>
        <p>We tested four different system prompts (ranging from a standard baseline to highly complex strategic frameworks) and forced them to architect systems and build fully functional React apps. The conclusion? The base model acts like hardware, providing raw coding ability. But the system prompt acts like an Operating System, dictating strategy, personality, and workflow.</p>
        
        <div className="quote-box">
          Constitutions don't make models fundamentally smarter; they act as a routing layer that forces the model's existing intelligence through vastly superior workflows.
        </div>
      </div>

      <div className="glass-panel content-section highlight-box">
        <p className="highlight-text">"Models are rapidly becoming commoditized. Very soon, the strategic differentiator won't be the model you use, but the behavioral framework you layer on top of it. Capability comes from the weights; business value comes from workflow design."</p>
        <div className="highlight-author">— Jonathan Kalsky</div>
      </div>

      <div className="glass-panel content-section">
        <h2>How We Tested: A Rigorous Multi-Agent Setup</h2>
        <p>To ensure our claims held up, we didn't just ask a chatbot a few questions. We built an autonomous orchestration environment to push these models to their breaking points across two distinct tracks:</p>
        
        <div className="track-grid">
          <div className="track-card">
            <h3 className="text-accent-cyan">Track 1: The 80-Agent Architecture Benchmark</h3>
            <p>We spun up 80 isolated subagents in parallel and hit them with 20 elite-level system architecture problems—like optimizing a legacy REST API to GraphQL without hitting N+1 query bottlenecks, or designing a CI/CD pipeline for a massive monorepo. We then used an automated LLM-as-a-judge to score them strictly on Helpfulness, Actionability, and Tone.</p>
          </div>
          <div className="track-card">
            <h3 className="text-accent-cyan">Track 2: The Autonomous Startup MVP Test</h3>
            <p>We dropped agents into empty directories and told them to build a "Startup MVP" using Next.js and Tailwind. We left them completely alone. They scaffolded the apps, installed dependencies, and when they hit real-world engineering bugs (like an `EADDRINUSE` port collision), they dynamically wrote Node scripts to negotiate open ports and fix the dev server themselves.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel content-section">
        <h2>Capability vs. Intelligence in the Real World</h2>
        <p>The most fascinating part of the Startup MVP test was watching where the models converged and where they diverged.</p>
        <p><strong>Where they converged (Capability):</strong> Every single variant, regardless of its prompt, successfully built and compiled a Next.js application using Tailwind and local databases. The raw coding ability is clearly baked into the model's weights.</p>
        <p><strong>Where they diverged (Intelligence):</strong> When asked to build a product, the baseline model built a generic, boring "Customer Feedback Tool." But our <code>innovating</code> prompt—which was injected with strategic frameworks—built a "B2B AI Support Resolution Engine." It autonomously analyzed market consensus, opposed it, and identified hidden business leverage. The prompt completely changed *what* the model decided to build, even though *how* it built it remained the same.</p>
      </div>

      <div className="glass-panel content-section">
        <h2>The Data: Why the Workflow Won</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value text-accent-green">76.38</div>
            <div className="stat-label">Innovating Prompt Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-value text-accent-gray">71.27</div>
            <div className="stat-label">Baseline Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-value text-accent">+5.11</div>
            <div className="stat-label">Point Preference Jump</div>
          </div>
        </div>
        <p className="mt-4 text-secondary"><em>Note: The Innovating prompt statistically outperformed the baseline across the 20-query architecture test simply by applying better problem-solving frameworks to the exact same base model.</em></p>
        <div className="chart-wrapper">
          <img src={scoresChart} alt="Scores Chart" className="data-chart" />
        </div>
      </div>

      <div className="glass-panel content-section">
        <h2>Prompt Diff Analysis: What Actually Drove the Win?</h2>
        <p>By comparing the prompts side-by-side, we traced exactly why the <code>innovating</code> variant scored so highly. We explicitly injected three cognitive frameworks into its instructions:</p>
        
        <div className="framework-list">
          <div className="framework-item border-accent">
            <div className="framework-title">Founder Mode</div>
            <p>"Whenever the user describes a problem, search for a business opportunity hidden inside it."</p>
          </div>
          <div className="framework-item border-accent">
            <div className="framework-title">Opportunity Hunter</div>
            <p>"Every response should identify hidden leverage."</p>
          </div>
          <div className="framework-item border-accent">
            <div className="framework-title">Contrarian Research Assistant</div>
            <p>"Every answer must contain: Consensus view, Strongest opposing view, Unknowns, What would change the conclusion."</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-secondary-bg rounded-lg border border-color">
          <strong>The Result:</strong> The agent didn't spontaneously become a better thinker. It simply followed instructions. During our tests, the agent literally printed out headers titled "Contrarian Research Assistant Output" and forced itself to answer its own questions before providing code. It routed its own logic through a superior workflow.
        </div>
      </div>

      <div className="glass-panel content-section">
        <h2>What Behaviors Actually Transfer?</h2>
        <p>If you take a highly tuned prompt meant for one model and run it on another, what breaks and what survives?</p>
        <div className="chart-wrapper">
          <img src={transferabilityChart} alt="Transferability Chart" className="data-chart" />
        </div>
        
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Engineered Directive</th>
                <th>Did it Transfer?</th>
                <th>Observation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tone & Formatting Restraints</td>
                <td><span className="badge badge-success">High</span></td>
                <td>The instruction to "never use bulleted lists" successfully overrode the model's default behavior flawlessly.</td>
              </tr>
              <tr>
                <td>Cognitive Frameworks</td>
                <td><span className="badge badge-success">High</span></td>
                <td>The "Founder Mode" and "Contrarian" algorithms were adopted perfectly across different tasks.</td>
              </tr>
              <tr>
                <td>Autonomous Tool Use</td>
                <td><span className="badge badge-warning">Partial</span></td>
                <td>Telling the agent to "aggressively search for context" transferred, but it often needed an environmental nudge to actually trigger the tools.</td>
              </tr>
              <tr>
                <td>Recursive Self-Improvement</td>
                <td><span className="badge badge-danger">Failed</span></td>
                <td>We told the agent to "continuously rewrite its internal constitution based on user feedback." This failed completely. A prompt cannot magically grant a model persistent cross-session memory if the underlying architecture doesn't support it.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="glass-panel content-section">
        <h2>Where Things Broke Down</h2>
        <p>It wasn't all perfect. Pushing these boundaries exposed two major architectural flaws in how we currently design agents:</p>
        <ul className="list-styled mb-4 ml-4">
          <li><strong>The Compression Tradeoff:</strong> We tested a highly compressed version of the prompt to save tokens. It scored the lowest (70.35). Stripping out the connective, human-like language caused the model to lose its conversational naturalness, making it feel robotic and untrustworthy.</li>
          <li><strong>The Generalist vs. Specialist Trap:</strong> The strategic "innovating" prompt was amazing for architecture. But when we asked it to fix a simple CSS bug, it tried to find "hidden business leverage" in the CSS file. It was annoying and overcomplicated simple tasks.</li>
        </ul>
        
        <div className="solution-box mt-6 p-6 border-l-4 border-accent bg-secondary-bg">
          <h3 className="text-accent mb-2 font-bold">The Path Forward: Multi-Agent Architectures</h3>
          <p>This proved to us that relying on one massive, monolithic system prompt is a mistake. The future is multi-agent. You need a lightweight "Router" agent that listens to the user, and then seamlessly hands the task off to a specialized subagent—a "Founder" agent for strategy, or a "Coder" agent for pure syntax execution. This is how you get extreme specialization without breaking generalized tasks.</p>
        </div>
      </div>
      
      <div className="glass-panel content-section">
        <h2>Limitations & Constraints</h2>
        <p className="mb-4">To maintain scientific rigor and transparency, the following constraints should be noted regarding these experimental results:</p>
        <div className="grid-2">
          <div>
            <ul className="list-styled ml-4">
              <li className="mb-2"><strong>Sample size limited:</strong> The experiments were conducted over a specific set of 20 architecture benchmarks and 2 end-to-end software builds.</li>
              <li className="mb-2"><strong>Results may not generalize:</strong> The evaluation tested specific structural constitutions on a constant baseline model; portability across fundamentally different model weight families (e.g. Llama vs. Claude) remains untested.</li>
            </ul>
          </div>
          <div>
            <ul className="list-styled ml-4">
              <li className="mb-2"><strong>LLM-as-a-Judge:</strong> Quantitative scoring relies on LLM-based evaluators, which carry inherent stylistic biases and may not perfectly correlate with human preferences.</li>
              <li className="mb-2"><strong>Exploratory Findings:</strong> The findings indicate strong behavioral portability trends, but they are exploratory rather than definitive.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-panel content-section text-center">
        <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
        <p className="text-lg text-secondary">Behaviors, tone, and strategic frameworks are highly portable across different AI models, whereas pure coding ability is heavily dependent on the underlying architecture. As we move forward, the key is differentiating between a model's raw architecture and capability, and its constitution-based intelligence—the guiding principles that shape how that capability is directed.</p>
      </div>
    </div>
  );
}
