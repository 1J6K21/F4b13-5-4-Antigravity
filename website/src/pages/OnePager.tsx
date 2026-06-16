import scoresChart from '../assets/scores_chart.png';
import transferabilityChart from '../assets/transferability_chart.png';
import './OnePager.css';

export function OnePager() {
  return (
    <div className="one-pager container">
      <div className="report-header text-center">
        <h1 className="report-title">Deep Dive Research Report</h1>
        <div className="report-subtitle text-gradient-accent">System Prompts as the Cognitive OS</div>
        <div className="mt-4 text-secondary font-medium">Author: Jonathan Kalsky</div>
      </div>

      <div className="glass-panel content-section p-4 mb-6 border-accent bg-secondary-bg">
        <p className="text-sm text-secondary">
          <strong>*Disclaimer regarding "Fable":</strong> The term "fable" used throughout the experimental variants refers directly to the system prompt instructions published in the <a href="https://github.com/elder-plinius/CL4R1T4S/blob/main/ANTHROPIC/CLAUDE-FABLE-5.md" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">CL4R1T4S repository by elder-plinius</a>. This study investigates the behavioral portability of those specific alignment directives when applied across different architectures.
        </p>
      </div>

      <div className="glass-panel content-section">
        <h2>Executive Summary</h2>
        <p>Our experimentation provides evidence that behavioral scaffolding acts as a critical "Workflow Layer". Evaluating four prompt variants (<code>control(antigravity)</code>, <code>fable-prompted</code>, <code>fabled-prompted-compressed</code>, and <code>fable-prompted-innovating</code>) across 20 programmatic queries and fully built React applications indicated that constitutions appear to shape strategic behavior, while technical capabilities remain anchored to the base model.</p>
        
        <div className="quote-box">
          Constitutions appear capable of altering reasoning structure, workflow, planning style, and decision frameworks while leaving core model capabilities largely unchanged.
        </div>
      </div>

      <div className="glass-panel content-section highlight-box">
        <p className="highlight-text">"Models are rapidly commoditizing into baseline Hardware. A major strategic differentiator appears to be the behavioral framework layered on top via System Prompts. Capability comes from the weights; behavior and decision frameworks appear strongly influenced by workflow design."</p>
        <div className="highlight-author">— Jonathan Kalsky</div>
      </div>

      <div className="glass-panel content-section">
        <h2>What & How We Tested (Methodology Deep Dive)</h2>
        <p>To prove these claims, we architected a highly rigorous, programmatic testing environment. We did not rely on simple chat interfaces; we built an autonomous orchestration layer to push the models to their limits across two primary tracks:</p>
        
        <div className="track-grid">
          <div className="track-card">
            <h3 className="text-accent-cyan">Track 1: The 20-Query Architecture Benchmark</h3>
            <p>We spawned <strong>80 isolated subagents</strong> in parallel to answer 20 elite-level system architecture queries (e.g., GraphQL N+1 optimization, CI/CD Monorepo design). The results were evaluated programmatically by an LLM-as-a-judge system scoring strictly on Helpfulness, Actionability, and Tone Naturalness (1-100 scale).</p>
          </div>
          <div className="track-card">
            <h3 className="text-accent-cyan">Track 2: The Autonomous Startup MVPs</h3>
            <p>Subagents were placed in isolated local directories and tasked to ideate, scaffold, and compile fully functional "Apple/Palantir" style web apps. They autonomously wrote <strong>Next.js, Tailwind, and Three.js</strong> code. When they encountered <code>EADDRINUSE</code> port collisions, the agents wrote dynamic Node.js scripts to negotiate open ports and successfully spin up dev servers entirely unassisted.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel content-section">
        <h2>Capability vs. Intelligence</h2>
        <p>A key discovery was the distinction between hardware and software. Beneath the system prompt, the base model is incredibly <strong>capable</strong> (all 4 variants wrote compiling Next.js web applications using identical underlying architectures like Tailwind and SQLite). However, raw capability is inert. Real <strong>intelligence</strong>—the judgment to pick the right business problem and apply leverage—was injected entirely via the system prompt workflow.</p>
      </div>

      <div className="glass-panel content-section">
        <h2>Scores & Metrics</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value text-accent-green">76.38</div>
            <div className="stat-label">Innovating Variant Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-value text-accent-gray">71.27</div>
            <div className="stat-label">Control Variant Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-value text-accent">+5.11</div>
            <div className="stat-label">Point Preference Jump</div>
          </div>
        </div>
        <div className="chart-wrapper">
          <img src={scoresChart} alt="Scores Chart" className="data-chart" />
        </div>
      </div>

      <div className="glass-panel content-section">
        <h2>Prompt Diff Analysis: Cognitive Frameworks</h2>
        <p>By comparing prompts, we mapped cause to effect. The high scores of the <code>fable-prompted-innovating</code> variant were directly driven by three strict text insertions (Cognitive Frameworks):</p>
        
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
          <strong>The Effect:</strong> These insertions literally forced the agent to output a "Contrarian Research Assistant" section during strategic tasks, overriding generic default behaviors entirely. The model did not become more intelligent intrinsically; it simply executed the mandated workflow.
        </div>
      </div>

      <div className="glass-panel content-section">
        <h2>What Actually Transferred?</h2>
        <div className="chart-wrapper">
          <img src={transferabilityChart} alt="Transferability Chart" className="data-chart" />
        </div>
        
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Engineered Directive</th>
                <th>Compliance</th>
                <th>Fact-Checked Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tone & Formatting Constraints</td>
                <td><span className="badge badge-success">High</span></td>
                <td>Consistent adherence to the "do not use bullets" and "dry tone" instructions across tested substrates.</td>
              </tr>
              <tr>
                <td>Cognitive Workflows</td>
                <td><span className="badge badge-success">High</span></td>
                <td>Successfully applied injected "Founder Mode" and "Contrarian" algorithms during task execution.</td>
              </tr>
              <tr>
                <td>Tool Autonomy Habits</td>
                <td><span className="badge badge-warning">Partial</span></td>
                <td>Directives to search eagerly for leverage transferred partially but remained inconsistent without explicit nudges.</td>
              </tr>
              <tr>
                <td>Recursive Self-Improvement</td>
                <td><span className="badge badge-danger">Failed</span></td>
                <td>The directive to "continuously rewrite an internal constitution" completely failed due to the lack of a cross-session memory architecture. Memory is hardware.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="glass-panel content-section">
        <h2>Surprising Failures & The Multi-Agent Solution</h2>
        <p>We discovered two major failures during evaluation:</p>
        <ul className="list-styled mb-4 ml-4">
          <li><strong>Compression Degradation:</strong> The compressed prompt scored lowest (70.35), proving extreme brevity destroys conversational naturalness and creates robotic, rigid interactions.</li>
          <li><strong>Specialization Overfitting:</strong> The innovating variant overcomplicated simple queries. If asked to fix a simple CSS bug, it attempted to unnecessarily analyze business leverage, annoying the user.</li>
        </ul>
        
        <div className="solution-box mt-6 p-6 border-l-4 border-accent bg-secondary-bg">
          <h3 className="text-accent mb-2 font-bold">The Solution: Multi-Agent Architecture</h3>
          <p>To solve overfitting, the architecture must evolve beyond a single monolithic prompt. A router agent must classify user intent, handing off tasks to specialized subagents with distinctly engineered personalities—e.g., a "Founder" agent for strategy, and a "Coder" agent for pure syntax. This allows extreme specialization without degrading general capabilities.</p>
        </div>
      </div>
      
      <div className="glass-panel content-section text-center">
        <h2 className="text-2xl font-bold mb-4">STAR Conclusion: The True Result</h2>
        <p className="text-lg text-secondary">The most valuable contribution is the emerging evidence that behavioral traits may transfer across models more readily than reasoning capabilities, suggesting constitutions function as a partially portable cognitive layer rather than a source of intelligence.</p>
      </div>
    </div>
  );
}
