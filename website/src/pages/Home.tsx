import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Cpu, Blocks, Layers } from 'lucide-react';
import './Home.css';

export function Home() {
  return (
    <div className="home container">
      <section className="hero">
        <h1 className="hero-title">
          System Prompts as the <br/>
          <span className="text-gradient-accent">Cognitive OS</span>
        </h1>
        <p className="hero-subtitle">
          An empirical study on the behavioral portability and limits of model-level alignment directives across diverse LLM substrates. 
          <br/><span className="author-tag">By Jonathan Kalsky</span>
        </p>
        <div className="hero-actions">
          <Link to="/one-pager" className="btn btn-primary">
            Read the Research <ArrowRight size={18} />
          </Link>
          <Link to="/experiments" className="btn btn-secondary glass-panel">
            View Agent Workspaces
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Brain size={32} /></div>
          <h3>Constitutions vs. Skills</h3>
          <p>We decouple Agent Skills (tools and capabilities) from Constitutions (rules and directives). Under strict capability parity, an agent's prompt operating system dictates its strategic choices, workflow execution, and output style.</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Blocks size={32} /></div>
          <h3>Phase 1: Directive Portability</h3>
          <p>Formatting constraints and reasoning checklists transfer consistently across different base models. However, prompts cannot bypass hardware limits; capabilities like long-term memory require architectural support.</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Cpu size={32} /></div>
          <h3>Phase 2: Cognitive Routing</h3>
          <p>Routing tasks to specialized subagents reduces context leakage and prompt token overhead compared to monolithic configurations, maximizing prompt density and context isolation.</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Layers size={32} /></div>
          <h3>Phase 3: Collaborative Teams</h3>
          <p>Combining specialized roles (Coder, Systems Engineer, Scientist) in a shared workspace improves code maintainability and security resolution, but introduces higher clock latency and API cost.</p>
        </div>
      </section>
      
      <section className="citation-section glass-panel">
        <div className="citation-content mb-8 pb-8 border-b border-color">
          <h3>Methodology & Source Attributions</h3>
          <p className="text-sm">
            The term "fable" used throughout this experimental data refers to the system prompt instructions published officially by Anthropic in their <a href="https://platform.claude.com/docs/en/release-notes/system-prompts" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">System Prompts Release Notes</a>. Our research explicitly evaluates the behavioral portability and limits of these alignment directives when layered onto alternative LLM substrates.
          </p>
        </div>
        <div className="citation-content">
          <h3>Citation & Academic Reference</h3>
          <p>If you build upon this research, utilize the datasets, or reference the "Constitution-as-an-OS" framing in your work, please cite the primary investigator:</p>
          <pre className="code-block">
            <code>
{`@misc{kalsky2026cognitiveOS,
  author       = {Jonathan Kalsky},
  title        = {System Prompts as a Cognitive OS: Behavioral Portability in LLMs},
  year         = {2026},
  publisher    = {GitHub},
  journal      = {GitHub Repository},
  howpublished = {\\url{https://github.com/1J6K21/F4b13-5-4-Antigravity}}
}`}
            </code>
          </pre>
        </div>
      </section>
    </div>
  );
}
