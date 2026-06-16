import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Cpu, Blocks } from 'lucide-react';
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
          <h3>Intelligence vs Capability</h3>
          <p>Beneath the prompt, the model is remarkably capable, but strategically inert. The base weights provide raw coding ability, but the Cognitive OS supplies the strategic workflow and judgment framework.</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Blocks size={32} /></div>
          <h3>High Transferability</h3>
          <p>Tone, formatting constraints, and cognitive workflows (like "Founder Mode") transfer highly consistently across different architectures and foundational models.</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Cpu size={32} /></div>
          <h3>Hardware Limitations</h3>
          <p>System prompts cannot magically grant capabilities that require fundamental architectural support, such as long-term recursive memory tracking. Memory is hardware.</p>
        </div>
      </section>
      
      <section className="citation-section glass-panel">
        <div className="citation-content mb-8 pb-8 border-b border-color">
          <h3>*Disclaimer: "Fable" Methodology</h3>
          <p className="text-sm">
            The term "fable" used throughout this experimental data refers directly to the system prompt instructions published in the <a href="https://github.com/elder-plinius/CL4R1T4S/blob/main/ANTHROPIC/CLAUDE-FABLE-5.md" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">CL4R1T4S repository by elder-plinius</a>. Our research explicitly evaluates the behavioral portability and limits of those exact alignment directives when layered onto alternative LLM substrates.
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
