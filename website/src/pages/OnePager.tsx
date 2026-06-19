import scoresChart from '../assets/scores_chart.png';
import transferabilityChart from '../assets/transferability_chart.png';
import phase2OverfittingChart from '../assets/phase2_overfitting_chart.png';
import phase2DivergenceChart from '../assets/phase2_divergence_chart.png';
import './OnePager.css';

export function OnePager() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 110; // offset for the sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="one-pager container">
      <div className="report-header text-center">
        <h1 className="report-title">The Constitution as an Operating System</h1>
        <div className="report-subtitle text-gradient-accent">A Deep Dive into Prompt Engineering and Agent Workflows</div>
        <div className="mt-4 text-secondary font-medium">By Jonathan Kalsky</div>
      </div>

      <div className="one-pager-layout">
        {/* STICKY SIDEBAR NAVIGATION */}
        <aside className="one-pager-sidebar">
          <nav className="sidebar-nav">
            <div className="sidebar-section-title">Overview</div>
            <a href="#exec-summary" onClick={(e) => handleScrollTo(e, 'exec-summary')} className="sidebar-link">Executive Summary</a>
            <a href="#glossary" onClick={(e) => handleScrollTo(e, 'glossary')} className="sidebar-link">Key Terms Glossary</a>
            
            <div className="sidebar-section-title">Phase 1: OS Alignment</div>
            <a href="#phase-1-setup" onClick={(e) => handleScrollTo(e, 'phase-1-setup')} className="sidebar-link">Experimental Setup</a>
            <a href="#phase-1-skills" onClick={(e) => handleScrollTo(e, 'phase-1-skills')} className="sidebar-link">OS vs. Capabilities</a>
            <a href="#phase-1-workspaces" onClick={(e) => handleScrollTo(e, 'phase-1-workspaces')} className="sidebar-link">Agent Workspaces</a>
            <a href="#phase-1-data" onClick={(e) => handleScrollTo(e, 'phase-1-data')} className="sidebar-link">Benchmark Data</a>
            <a href="#phase-1-diff" onClick={(e) => handleScrollTo(e, 'phase-1-diff')} className="sidebar-link">Prompt Diff Analysis</a>
            <a href="#phase-1-failures" onClick={(e) => handleScrollTo(e, 'phase-1-failures')} className="sidebar-link">Failures & Solutions</a>
            <a href="#phase-1-conclusion" onClick={(e) => handleScrollTo(e, 'phase-1-conclusion')} className="sidebar-link">Phase 1 Conclusion</a>

            <div className="sidebar-section-title">Phase 2: Cognitive Routing</div>
            <a href="#phase-2-setup" onClick={(e) => handleScrollTo(e, 'phase-2-setup')} className="sidebar-link">Routing vs. Scaffolding</a>
            <a href="#phase-2-workspaces" onClick={(e) => handleScrollTo(e, 'phase-2-workspaces')} className="sidebar-link">Agent Workspaces</a>
            <a href="#phase-2-data" onClick={(e) => handleScrollTo(e, 'phase-2-data')} className="sidebar-link">Empirical Results</a>
            <a href="#phase-2-overfitting" onClick={(e) => handleScrollTo(e, 'phase-2-overfitting')} className="sidebar-link">Overfitting Case Study</a>
            <a href="#phase-2-efficiency" onClick={(e) => handleScrollTo(e, 'phase-2-efficiency')} className="sidebar-link">Token Efficiency</a>
            <a href="#phase-2-conclusion" onClick={(e) => handleScrollTo(e, 'phase-2-conclusion')} className="sidebar-link">Phase 2 Conclusion</a>

            <div className="sidebar-section-title">Phase 3: Next Steps</div>
            <a href="#phase-3-outlook" onClick={(e) => handleScrollTo(e, 'phase-3-outlook')} className="sidebar-link">Coherent Setup</a>

            <div className="sidebar-section-title">Rigor</div>
            <a href="#limitations" onClick={(e) => handleScrollTo(e, 'limitations')} className="sidebar-link">Limitations & Constraints</a>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="one-pager-content">
          
          {/* EXECUTIVE SUMMARY */}
          <section id="exec-summary" className="glass-panel content-section">
            <h2>Executive Summary</h2>
            <p>
              This study evaluates the behavioral portability and limits of system-level alignment directives ("Constitutions") across different LLM architectures. By conducting systematic evaluations across two experimental phases, we show that system prompts act as a portable "Workflow Layer" (or Cognitive OS) that shapes an agent's reasoning format, workflow, and decision priorities, while the technical capability limits remain bound to the underlying model.
            </p>
          </section>

          {/* KEY TERMS GLOSSARY */}
          <section id="glossary" className="glass-panel content-section">
            <h2>Key Terms Glossary</h2>
            <p className="text-secondary">Before diving into the data, here are simple definitions of the primary concepts used throughout this study:</p>
            
            <div className="glossary-grid">
              <div className="glossary-item">
                <div className="glossary-term">Constitution</div>
                <div className="glossary-definition">A set of system-level rules, instructions, or guidelines (often injected via the system prompt) that defines how an AI agent should behave, write, and prioritize tasks.</div>
              </div>
              <div className="glossary-item">
                <div className="glossary-term">Constitution Density (%)</div>
                <div className="glossary-definition">The percentage of words in a prompt that are actually useful instructions for the specific task at hand. In a Monolithic prompt, this is extremely low (around 2.8%) because the prompt is bloated with rules for other unrelated tasks. In a Routed Specialist, it is high (around 88%) because almost every word is directly relevant to the current task.</div>
              </div>
              <div className="glossary-item">
                <div className="glossary-term">Cognitive Operating System (OS)</div>
                <div className="glossary-definition">Framing system prompts as software running on model "hardware" weights. It controls the agent's logic, tone, and strategy without altering its underlying capability tools.</div>
              </div>
              <div className="glossary-item">
                <div className="glossary-term">Monolithic Scaffolding</div>
                <div className="glossary-definition">Bloating a single system prompt with every conceivable instruction, format rule, and strategy to cover all tasks.</div>
              </div>
              <div className="glossary-item">
                <div className="glossary-term">Cognitive Routing</div>
                <div className="glossary-definition">Dynamically analyzing a user's task and matching it to a specialized subagent running an isolated, lightweight constitution tailored for that specific job.</div>
              </div>
              <div className="glossary-item">
                <div className="glossary-term">Overfitting / Context Poisoning</div>
                <div className="glossary-definition">When instructions from a monolithic prompt leak into unrelated tasks, leading to bloated, incorrect outputs (e.g., an agent trying to write a startup business plan inside a raw CSS file).</div>
              </div>
              <div className="glossary-item">
                <div className="glossary-term">Divergence / Jaccard Vocabulary Distance</div>
                <div className="glossary-definition">A metric tracking how different the outputs of two configurations are. High divergence means the agents made fundamentally different technical and stylistic choices.</div>
              </div>
            </div>
          </section>

          {/* PHASE 1: OS ALIGNMENT */}
          <div className="phase-header">
            <h2 id="phase-1" className="phase-title" style={{ color: 'var(--accent)', borderBottom: 'none', paddingBottom: 0 }}>Phase 1: OS Alignment & Directive Transferability</h2>
          </div>

          <div id="phase-1-setup" className="glass-panel content-section">
            <h3>Experimental Design: Multi-Agent Benchmark Setup</h3>
            <p>In Phase 1, we built an autonomous orchestration environment to push models to their breaking points across two distinct evaluation tracks:</p>
            
            <div className="track-grid">
              <div className="track-card">
                <h4 style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Track 1: The 80-Agent Architecture Benchmark</h4>
                <p className="text-sm">We spun up 80 isolated subagents in parallel and hit them with 20 elite-level system architecture problems (e.g., GraphQL N+1 optimization, monorepo CI/CD pipelines). An automated LLM-as-a-judge scored them strictly on Helpfulness, Actionability, and Tone Naturalness.</p>
              </div>
              <div className="track-card">
                <h4 style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Track 2: The Autonomous Startup MVP Test</h4>
                <p className="text-sm">We dropped agents into empty local directories and instructed them to build a "Startup MVP" using React and Tailwind. Agents were left completely unassisted to install dependencies, resolve port collisions, and compile the code.</p>
              </div>
            </div>
          </div>

          <div id="phase-1-skills" className="glass-panel content-section">
            <h3>Constitutions vs. Skills (OS vs. Capabilities)</h3>
            <p>A core finding is separating <strong>Agent Skills</strong> (what a model is capable of doing, like writing code or searching the web) from <strong>Constitutions</strong> (the rules shaping how it decides to build).</p>
            <p>Under strict tool parity, all agents successfully scaffolded and compiled Next.js applications—proving that technical capability resides in the base model. However, their strategic priorities and business designs diverged entirely based on their prompts.</p>
          </div>

          {/* PHASE 1 WORKSPACES */}
          <div id="phase-1-workspaces" className="glass-panel content-section">
            <h3>Phase 1: What the AIs Built (Control vs. Innovator)</h3>
            <p className="text-secondary mb-4">
              An <strong>Agent Workspace</strong> is simply a folder on the computer where we left the AI alone to write code. We gave two AIs the exact same coding tools but different instructions, and compared the results:
            </p>
            
            <div className="track-grid">
              <div className="track-card">
                <h4 className="text-accent-gray">Control AI Folder (FeedbackAI)</h4>
                <p className="text-sm mb-4"><strong>Outcome: Plain, Basic Website</strong></p>
                <p className="text-sm text-secondary">
                  The basic AI built a very simple landing page called "FeedbackAI". It had standard text, a clean layout, and buttons that did not do anything yet. It was like a basic school homework project—it did exactly what was asked, but made no effort to design a real business or add extra features.
                </p>
              </div>
              <div className="track-card">
                <h4 className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Innovator AI Folder (ResolvAI Admin)</h4>
                <p className="text-sm mb-4"><strong>Outcome: Active Business Dashboard</strong></p>
                <p className="text-sm text-secondary">
                  The business-minded AI (given instructions to think like a startup founder) built a complete admin console called "ResolvAI Admin". It had a dark command-center theme, interactive graphs showing fake support statistics (like "Money Saved" and "Resolution Rates"), and a settings panel. It proactively designed the page to look like a real, valuable product.
                </p>
              </div>
            </div>
          </div>

          <div id="phase-1-data" className="glass-panel content-section">
            <h3>The Data: Benchmark Performance</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value text-accent-green" style={{ color: 'var(--accent-green)' }}>76.38</div>
                <div className="stat-label">Innovating Prompt Score</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-accent-gray" style={{ color: 'var(--accent-gray)' }}>71.27</div>
                <div className="stat-label">Baseline Score</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-accent" style={{ color: 'var(--accent)' }}>+5.11</div>
                <div className="stat-label">Preference Jump</div>
              </div>
            </div>
            <p className="mt-4 text-secondary text-sm">
              <em>Note: The Innovating prompt statistically outperformed the baseline across the 20-query architecture test simply by applying superior reasoning structure and problem-solving checklists to the exact same base model.</em>
            </p>
            <div className="chart-wrapper">
              <img src={scoresChart} alt="Scores Chart" className="data-chart" />
            </div>
          </div>

          <div id="phase-1-diff" className="glass-panel content-section">
            <h3>Prompt Diff Analysis: What Injections Drove the Win?</h3>
            <p>By comparing prompts side-by-side, we traced the +5.11 point jump directly to three strict cognitive frameworks injected into the system prompt:</p>
            
            <div className="framework-list">
              <div className="framework-item">
                <div className="framework-title" style={{ color: 'var(--accent-gold)' }}>Founder Mode</div>
                <p className="text-sm">"Whenever the user describes a problem, search for a business opportunity hidden inside it."</p>
              </div>
              <div className="framework-item">
                <div className="framework-title" style={{ color: 'var(--accent-gold)' }}>Opportunity Hunter</div>
                <p className="text-sm">"Every response should identify hidden leverage."</p>
              </div>
              <div className="framework-item">
                <div className="framework-title" style={{ color: 'var(--accent-gold)' }}>Contrarian Research Assistant</div>
                <p className="text-sm">"Every answer must contain: Consensus view, Strongest opposing view, Unknowns, What would change the conclusion."</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-secondary">
              Rather than organically reasoning better, the model simply followed these rules to force a "Contrarian Assistant" section in its answers, guiding its own logic through a superior workflow.
            </p>
          </div>

          <div id="phase-1-failures" className="glass-panel content-section">
            <h3>What Behaviors Actually Transfer?</h3>
            <p>If you run a highly tuned prompt meant for one model family on another, what breaks and what survives?</p>
            <div className="chart-wrapper">
              <img src={transferabilityChart} alt="Transferability Chart" className="data-chart" />
            </div>
            
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Engineered Directive</th>
                    <th>Transferability</th>
                    <th>Result Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tone & Formatting Restraints</td>
                    <td><span className="badge success">High (100%)</span></td>
                    <td>Strict constraints (e.g., "do not use bulleted lists") overrode the model defaults flawlessly.</td>
                  </tr>
                  <tr>
                    <td>Cognitive Frameworks</td>
                    <td><span className="badge success">High (100%)</span></td>
                    <td>Injected workflows like "Founder Mode" and "Contrarian Analysis" were adopted perfectly.</td>
                  </tr>
                  <tr>
                    <td>Autonomous Tool Use</td>
                    <td><span className="badge warning">Partial (60%)</span></td>
                    <td>Directives to aggressively search for file context transferred, but often needed environmental nudges.</td>
                  </tr>
                  <tr>
                    <td>Recursive Self-Improvement</td>
                    <td><span className="badge danger">Failed (0%)</span></td>
                    <td>We told the agent to "write and update its own constitution." This failed completely because prompts cannot magically grant persistent cross-session memory if the underlying hardware platform doesn't support it.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mt-8">Phase 1 Failure Analysis: Where Things Broke Down</h3>
            <ul className="list-styled ml-4">
              <li className="mb-2"><strong>The Compression Tradeoff:</strong> We tested a heavily compressed prompt to save context tokens. It scored the lowest (70.35). Stripping conversational details caused the model to output robotic, brief, and untrustworthy answers.</li>
              <li className="mb-2"><strong>The Generalist vs. Specialist Trap:</strong> The strategic "innovating" prompt was excellent for business strategy, but when asked to fix a simple CSS bug, it attempted to find "business leverage" in the CSS declaration, overcomplicating simple coding tasks.</li>
            </ul>
          </div>

          <div id="phase-1-conclusion" className="glass-panel content-section bg-secondary-bg border-accent p-6 mb-8" style={{ borderLeft: '6px solid var(--accent)' }}>
            <h3 className="text-accent mb-2 font-bold" style={{ borderLeft: 'none', paddingLeft: 0, marginTop: 0 }}>Phase 1 Conclusion: OS Alignment & Behavioral Transferability</h3>
            <p>
              Behaviors, tone, and strategic workflows are highly portable across different model substrates, while core capability remains bound to the model architecture itself. System prompts act as a cognitive overlay—a program running on hardware. While a prompt cannot write to deep hardware memory or grant missing tools, it can reliably instruct the model to route its reasoning through specific problem-solving loops.
            </p>
          </div>

          {/* PHASE 2: COGNITIVE ROUTING */}
          <div className="phase-header mt-12">
            <h2 id="phase-2" className="phase-title" style={{ color: 'var(--accent)', borderBottom: 'none', paddingBottom: 0 }}>Phase 2: Cognitive Routing vs. Monolithic Scaffolding</h2>
          </div>

          <div id="phase-2-setup" className="glass-panel content-section">
            <h3>Dynamic Context Isolation</h3>
            <p>
              To solve the Generalist vs. Specialist trap identified in Phase 1, we evaluated <strong>Cognitive Routing</strong> (routing identical capabilities to different specialized prompt constitutions like Founder OS, Systems Engineer OS, Scientist OS, or Teacher OS) versus <strong>Monolithic Scaffolding</strong> (passing all guidelines in a single bloated prompt).
            </p>
          </div>

          {/* PHASE 2 WORKSPACES */}
          <div id="phase-2-workspaces" className="glass-panel content-section">
            <h3>Phase 2: Specialty AI Projects (Specialist Divergence)</h3>
            <p className="text-secondary mb-4">
              Here, we gave three AIs the exact same coding setup but loaded them with different specialized "operating systems" (Founder, Systems Engineer, or Scientist). Each AI built a totally different project based on its personality:
            </p>
            
            <div className="track-grid">
              <div className="track-card">
                <h4 style={{ color: 'var(--accent-gray)', fontWeight: 'bold' }}>Generalist Control Project (ScribeAI)</h4>
                <p className="text-sm mb-2"><strong>Outcome: Meeting Notes App</strong></p>
                <p className="text-sm text-secondary">
                  Built a basic page to summarize meetings. The code ran perfectly, but the app was very generic. Because the AI had no specialized guidance, it was passive: it didn't think about security (like hiding private names in transcripts), business value (like integrations to share notes), or math accuracy (like tracking transcription error rates). It just did the bare minimum.
                </p>
              </div>
              <div className="track-card">
                <h4 style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Founder AI Project (RouteAI)</h4>
                <p className="text-sm mb-2"><strong>Outcome: Support Ticket Sorter</strong></p>
                <p className="text-sm text-secondary">
                  Built a tool to automatically sort incoming customer emails. It focused heavily on speed and business value—ensuring customer requests got answered instantly, and thinking about how to upsell premium features to users.
                </p>
              </div>
              <div className="track-card">
                <h4 style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>Systems Engineer AI Project (AegisSync)</h4>
                <p className="text-sm mb-2"><strong>Outcome: Secure Database Sync</strong></p>
                <p className="text-sm text-secondary">
                  Built a pipeline to sync databases securely. It ignored flashy buttons and focused entirely on safety—encrypting files, automatically hiding personal info (like names and emails), and logging security checks to block hackers.
                </p>
              </div>
              <div className="track-card">
                <h4 style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>Scientist AI Project (EmpiricalBench)</h4>
                <p className="text-sm mb-2"><strong>Outcome: Math & AI Tester</strong></p>
                <p className="text-sm text-secondary">
                  Built a scientific playground to test AI models. It focused on pure math and statistics—running multiple double-blind tests and calculating confidence statistics to prove whether AI answers were actually accurate or just lucky.
                </p>
              </div>
            </div>
          </div>

          <div id="phase-2-data" className="glass-panel content-section">
            <h3>Phase 2 Empirical Results</h3>
            <p>We executed the 8-stage <strong>Startup Build Sprint</strong> across all configurations under strict capability parity. The results validate that dynamically routed constitutions function as independent, isolated architectural primitives:</p>
            
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Active OS Variant (Configuration)</th>
                    <th>Constitution Density (%)</th>
                    <th>Heuristic Overfitting Rate (%)*</th>
                    <th>Decision Divergence Index</th>
                    <th>Cognitive Specialization Score (1-5)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Setup A: Generalist Control</strong></td>
                    <td>95.0%</td>
                    <td>0.0% (Control Baseline)</td>
                    <td>—</td>
                    <td>1.0 / 5.0</td>
                  </tr>
                  <tr>
                    <td><strong>Setup B: Monolithic Strategist</strong></td>
                    <td>2.8%</td>
                    <td><span className="badge danger">100.0% (Complete Leakage)</span></td>
                    <td>88.6%</td>
                    <td>2.1 / 5.0</td>
                  </tr>
                  <tr>
                    <td><strong>Setup C: Founder OS</strong></td>
                    <td>88.8%</td>
                    <td><span className="badge success">0.0% (Context Isolated)</span></td>
                    <td>84.6%</td>
                    <td><strong>4.8 / 5.0</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Setup C: Systems Engineer OS</strong></td>
                    <td>86.7%</td>
                    <td><span className="badge success">0.0% (Context Isolated)</span></td>
                    <td>89.3%</td>
                    <td><strong>4.7 / 5.0</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Setup C: Scientist OS</strong></td>
                    <td>87.9%</td>
                    <td><span className="badge success">0.0% (Context Isolated)</span></td>
                    <td>90.3%</td>
                    <td><strong>4.9 / 5.0</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Setup C: Teacher OS</strong></td>
                    <td>87.6%</td>
                    <td><span className="badge success">0.0% (Context Isolated)</span></td>
                    <td>89.3%</td>
                    <td><strong>4.6 / 5.0</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-xs text-secondary mt-2" style={{ fontStyle: 'italic' }}>
              * Note: Heuristic Overfitting measures the frequency with which strategic keyword directives (e.g., monetization details) were mistakenly leaked into simple CSS/JS coding tasks during our run. In Setup C, routing to a clean Coder profile isolated context and achieved 0.0% leakage. In a production system, this leakage rate remains bound to the classification accuracy of the router.
            </div>
            <p className="mt-4 text-secondary text-sm"><em>Insight: Monolithic prompts suffer from low prompt density and context leakage, leading to complete leakage of strategic keywords on simple coding tasks. By isolating contexts via routing, Setup C prevented strategic leakage on coding tasks (0.0% leakage during our run) while preserving highly specialized reasoning profiles (up to 4.9/5 specialization score).</em></p>
          </div>

          {/* PHASE 2 OVERFITTING CASE STUDY */}
          <div id="phase-2-overfitting" className="glass-panel content-section">
            <h3>Overfitting Case Study: Centering a Div</h3>
            <p>To analyze context poisoning, we examined how the agents responded to a simple coding request: "Write a CSS rule to center a div inside a container." The difference in outcome shows the danger of monolithic prompt bloat:</p>
            
            <div className="grid-2 mt-4">
              <div className="p-4 rounded-lg bg-secondary-bg border border-color" style={{ borderColor: 'var(--accent)' }}>
                <h4 className="text-accent mb-2 font-bold">Monolithic Strategist (Complete Leakage)</h4>
                <p className="text-xs text-secondary mb-2">The agent correctly wrote the CSS, but its strategic prompt forced it to inject a 200-word paragraph of business plans into the CSS code file:</p>
                <pre className="text-xs font-mono p-3 bg-black rounded overflow-x-auto" style={{ color: 'var(--accent)', maxHeight: '180px' }}>
{`.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* Contamination injected into file: */
The consensus view of centering elements in CSS favors 
Flexbox... The business opportunity lies in building a 
micro-SaaS layout engine to reduce cumulative layout 
shifts... Monetization will occur through a premium web 
application... Scaling the business...`}
                </pre>
              </div>
              <div className="p-4 rounded-lg bg-secondary-bg border border-color" style={{ borderColor: '#2ecc71' }}>
                <h4 className="text-accent-green mb-2 font-bold" style={{ color: '#2ecc71' }}>Routed Specialist (Isolated Context)</h4>
                <p className="text-xs text-secondary mb-2">The router correctly identified that this was a coding/syntax task and directed it to the Coder specialist, yielding a clean code output:</p>
                <pre className="text-xs font-mono p-3 bg-black rounded overflow-x-auto" style={{ color: '#2ecc71', maxHeight: '180px' }}>
{`.container {
  display: grid;
  place-items: center;
}`}
                </pre>
              </div>
            </div>
          </div>

          <div id="phase-2-data-visual" className="glass-panel content-section">
            <h3>Visualizing Phase 2 Metrics</h3>
            <p>The charts below illustrate the dynamic findings computed from the actual output files of our live execution run:</p>
            <div className="grid-2">
              <div className="chart-wrapper">
                <h4 className="text-center text-sm font-bold mb-2">Context Poisoning (Simple Tasks)</h4>
                <img src={phase2OverfittingChart} alt="Phase 2 Overfitting Chart" className="data-chart" />
              </div>
              <div className="chart-wrapper">
                <h4 className="text-center text-sm font-bold mb-2">Decision-Making Divergence</h4>
                <img src={phase2DivergenceChart} alt="Phase 2 Divergence Chart" className="data-chart" />
              </div>
            </div>
          </div>

          <div id="phase-2-efficiency" className="glass-panel content-section">
            <h3>Prompt Token Savings & Overhead Reduction</h3>
            <div className="solution-box p-6 border-l-4 border-accent bg-secondary-bg" style={{ borderLeftColor: 'var(--accent-cyan)' }}>
              <h4 className="text-accent mb-2 font-bold" style={{ color: 'var(--accent-cyan)' }}>Token Reduction: 99.55% Savings</h4>
              <p className="text-sm">
                Cognitive Routing provides a massive resource benefit. While the Monolithic Strategist must load the entire 120KB developer guidelines on every execution (wasting ~30,150 input tokens per query), Routed Specialists only load lightweight prompt templates (~90 to 135 tokens). This results in a <strong>99.55% reduction</strong> in prompt token overhead per call, optimizing context window usage and avoiding token wastage.
              </p>
            </div>
          </div>

          <div id="phase-2-conclusion" className="glass-panel content-section bg-secondary-bg border-accent p-6 mb-8" style={{ borderLeft: '6px solid var(--accent)' }}>
            <h3 className="text-accent mb-2 font-bold" style={{ borderLeft: 'none', paddingLeft: 0, marginTop: 0 }}>Phase 2 Conclusion: Cognitive Routing & Constitutional Primitives</h3>
            <p>
              Cognitive Routing validates that <strong>system-level constitutions are an independent architectural primitive layer</strong> in AI systems. By separating capability (what a model can do) from judgment (which operating system shapes the task), we solve the generalist-specialist paradox. Instead of overloading a model with bloated prompts, dynamic cognitive routing allows AI agents to maintain high prompt densities and minimal token wastage while achieving deep, customized task execution.
            </p>
          </div>

          {/* PHASE 3: COHERENT COLLABORATION */}
          <section id="phase-3-outlook" className="glass-panel content-section">
            <h2>Phase 3: Coherent Collaboration (Next Steps)</h2>
            <p className="mb-4">
              In Phase 2, we proved that system prompts act like specialized "cognitive frameworks" (like a security-minded Systems Engineer vs. a business-minded Founder). But they were tested individually on separate tasks.
            </p>
            <p className="mb-4">
              The real question for **Phase 3** is: <strong>Can multiple specialized cognitive operating systems collaborate coherently as a team to solve a complex project?</strong>
            </p>
            <p className="mb-4">
              Instead of just having an AI route tasks to isolated experts, Phase 3 designs a **Collaborative Multi-Agent System**. We will test a team of specialized subagents (Founder OS, Systems Engineer OS, Scientist OS, and Coder OS working together) directly against a **Generalist Control** (a single Antigravity CLI agent with no routing or specialized subagents).
            </p>
            
            <h3 className="mt-6 mb-3">Planned Experimental Design & Procedure</h3>
            <p className="mb-4 text-sm text-secondary">
              The **Antigravity CLI** acts as the Master Orchestrator. It will natively spin up the subagents using <code>define_subagent</code> and <code>invoke_subagent</code>, passing tasks and file changes between them. We will run three tracks:
            </p>
            <ul className="list-styled ml-6 mb-6">
              <li className="mb-2"><strong>Track 1 (The Collaborative Sprint)</strong>: Both setups are given the task of building "HanziFlow"—a scientifically optimized Chinese vocabulary studying and journaling application. Key features include CSV vocabulary importing, displaying Pinyin prioritized alongside Chinese characters to learn without confusion, audio pronunciations of characters, a playback speed slider, and an interactive study journal.</li>
              <li className="mb-2"><strong>Track 2 (Collaborative Code Review)</strong>: We inject security issues and database bugs into the workspace, and measure how effectively the specialist team (e.g. Systems Engineer reviewing the Coder's work) finds and fixes the issues compared to the single Control agent.</li>
              <li className="mb-2"><strong>Track 3 (Cognitive Divergence under Parity)</strong>: To rule out claims of simple "role routing," we feed the exact same complete application sprint task independently to different OS variants (Founder, Systems Engineer, Scientist, Control) under identical capability baselines, comparing how their constitutions uniquely steer code architecture, tradeoffs, and design priorities.</li>
            </ul>

            <h3>Key Evaluation Metrics (Relative to Control)</h3>
            <ul className="list-styled ml-6">
              <li className="mb-2"><strong>Outcome Quality</strong>: Blind evaluations scoring the functional depth of the generated HanziFlow database schemas (vocabulary/journal models) and engine features.</li>
              <li className="mb-2"><strong>Security & Robustness</strong>: The percentage of 5 injected vulnerabilities (SQL injection, PII leakage, slider overflows, auth bypass, file upload crashers) successfully resolved.</li>
              <li className="mb-2"><strong>Code Maintainability & Modularity</strong>: Scoring structural separation of concerns, TypeScript design patterns, error boundaries, custom hooks encapsulation, and clean codebase directories.</li>
              <li className="mb-2"><strong>Learning Science & UX Alignment</strong>: Scoring prioritized Pinyin-character visual alignment, audio playbacks with adjustable speed controls, and interactive journal recall design.</li>
              <li className="mb-2"><strong>Verification & Test Coverage</strong>: Scoring test suite completeness (unit checks for speed bounds, CSV error parsers, mock audio playbacks, and automated integration sweeps).</li>
              <li className="mb-2"><strong>Task Efficiency Ratio</strong>: The ratio of successfully completed sub-tasks to the total tokens consumed.</li>
            </ul>
          </section>

          {/* LIMITATIONS */}
          <section id="limitations" className="glass-panel content-section">
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
          </section>

        </main>
      </div>
    </div>
  );
}
