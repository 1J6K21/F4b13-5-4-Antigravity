import './OnePager.css';

export function OnePager() {
  return (
    <div className="one-pager container">
      <div className="report-header text-center">
        <h1 className="report-title">Deep Dive Research Report</h1>
        <div className="report-subtitle text-gradient-accent">System Prompts as the Cognitive OS</div>
      </div>

      <div className="glass-panel content-section">
        <h2>Executive Summary</h2>
        <p>Our experimentation provides evidence that behavioral scaffolding acts as a critical "Workflow Layer". Evaluating four prompt variants (<code>control(antigravity)</code>, <code>fable-prompted</code>, <code>fabled-prompted-compressed</code>, and <code>fable-prompted-innovating</code>) across 20 programmatic queries and fully built React applications proved that constitutions appear to shape strategic behavior, while technical capabilities remain anchored to the base model.</p>
        
        <div className="quote-box">
          Constitutions appear capable of altering reasoning structure, workflow, planning style, and decision frameworks while leaving core model capabilities largely unchanged.
        </div>
      </div>

      <div className="glass-panel content-section">
        <h2>What & How We Tested</h2>
        <p>To prove these claims, we architected a highly rigorous, programmatic testing environment using autonomous orchestration.</p>
        
        <div className="track-grid">
          <div className="track-card">
            <h3 className="text-accent">Track 1: The 20-Query Benchmark</h3>
            <p>We spawned <strong>80 isolated subagents</strong> in parallel to answer 20 elite-level system architecture queries (e.g., GraphQL N+1 optimization, CI/CD Monorepo design). Evaluated programmatically by an LLM-as-a-judge system on Helpfulness, Actionability, and Tone Naturalness (1-100).</p>
          </div>
          <div className="track-card">
            <h3 className="text-accent">Track 2: The Autonomous Startup MVPs</h3>
            <p>Subagents were placed in isolated local directories and tasked to ideate, scaffold, and compile fully functional "Apple/Palantir" style web apps. They autonomously wrote <strong>Next.js, Tailwind, and Three.js</strong> code, and even patched <code>EADDRINUSE</code> port collisions entirely unassisted.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel content-section highlight-box">
        <p className="highlight-text">"Models are rapidly commoditizing into baseline Hardware. A major strategic differentiator appears to be the behavioral framework layered on top via System Prompts. Capability comes from the weights; behavior and decision frameworks appear strongly influenced by workflow design."</p>
        <div className="highlight-author">— Jonathan Kalsky</div>
      </div>

      <div className="glass-panel content-section">
        <h2>Scores & Metrics</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">76.38</div>
            <div className="stat-label">Innovating Variant Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">71.27</div>
            <div className="stat-label">Control Variant Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-value text-accent">+5.11</div>
            <div className="stat-label">Point Preference Jump</div>
          </div>
        </div>
        <div className="chart-wrapper">
          <img src="/scores_chart.png" alt="Scores Chart" className="data-chart" />
        </div>
      </div>

      <div className="glass-panel content-section">
        <h2>Prompt Diff Analysis: Cognitive Frameworks</h2>
        <p>The high scores of the <code>fable-prompted-innovating</code> variant were directly driven by three strict text insertions:</p>
        
        <div className="framework-list">
          <div className="framework-item">
            <div className="framework-title">Founder Mode</div>
            <p>"Whenever the user describes a problem, search for a business opportunity hidden inside it."</p>
          </div>
          <div className="framework-item">
            <div className="framework-title">Opportunity Hunter</div>
            <p>"Every response should identify hidden leverage."</p>
          </div>
          <div className="framework-item">
            <div className="framework-title">Contrarian Research Assistant</div>
            <p>"Every answer must contain: Consensus view, Strongest opposing view, Unknowns, What would change the conclusion."</p>
          </div>
        </div>
      </div>

      <div className="glass-panel content-section">
        <h2>What Actually Transferred?</h2>
        <div className="chart-wrapper">
          <img src="/transferability_chart.png" alt="Transferability Chart" className="data-chart" />
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
                <td><span className="badge success">100%</span></td>
                <td>Perfect adherence to the "do not use bullets" and "dry tone" instructions.</td>
              </tr>
              <tr>
                <td>Cognitive Workflows</td>
                <td><span className="badge success">100%</span></td>
                <td>Successfully applied injected "Founder Mode" and "Contrarian" algorithms.</td>
              </tr>
              <tr>
                <td>Tool Autonomy Habits</td>
                <td><span className="badge warning">60%</span></td>
                <td>Directives to search eagerly for leverage transferred partially but inconsistently.</td>
              </tr>
              <tr>
                <td>Recursive Self-Improvement</td>
                <td><span className="badge danger">0%</span></td>
                <td>Completely failed due to the lack of a cross-session memory architecture.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="glass-panel content-section accent-border">
        <h2>Surprising Failures & The Multi-Agent Solution</h2>
        <p>We discovered two major failures: <strong>Compression Degradation</strong> (extreme brevity destroys conversational naturalness) and <strong>Specialization Overfitting</strong> (the innovating variant overcomplicated simple queries with unnecessary business leverage analysis).</p>
        
        <div className="solution-box mt-4">
          <h3 className="text-accent">The Solution: Multi-Agent Architecture</h3>
          <p>To solve overfitting, the architecture must evolve beyond a single monolithic prompt. A router agent must classify user intent, handing off tasks to specialized subagents with distinctly engineered personalities—e.g., a "Founder" agent for strategy, and a "Coder" agent for pure syntax. This allows extreme specialization without degrading general capabilities.</p>
        </div>
      </div>
    </div>
  );
}
