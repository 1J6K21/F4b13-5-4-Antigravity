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
          An empirical study on the behavioral portability and limits of model-level alignment directives across diverse LLM substrates. By Jonathan Kalsky (@1J6K21).
        </p>
        <div className="hero-actions">
          <Link to="/one-pager" className="btn btn-primary">
            Read the Research <ArrowRight size={18} />
          </Link>
          <Link to="/experiments" className="btn btn-secondary glass-panel">
            View Live Experiments
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Brain size={32} /></div>
          <h3>Intelligence vs Capability</h3>
          <p>Beneath the prompt, the model is merely capable, not intelligent. The base weights provide raw coding ability, but the OS provides the strategic workflow.</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Blocks size={32} /></div>
          <h3>100% Transferability</h3>
          <p>Tone, formatting constraints, and cognitive workflows (like "Founder Mode") transfer perfectly across different architectures and models.</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Cpu size={32} /></div>
          <h3>Hardware Limitations</h3>
          <p>System prompts cannot magically grant capabilities that require fundamental architectural support, such as long-term recursive memory tracking.</p>
        </div>
      </section>
      
      <section className="citation-section glass-panel">
        <div className="citation-content">
          <h3>Citation & Academic Reference</h3>
          <p>If you build upon this research, utilize the datasets, or reference the "Constitution-as-an-OS" framing in your work, please cite the primary investigator:</p>
          <pre className="code-block">
            <code>
{`@misc{kalsky2026antigravity,
  author       = {Jonathan Kalsky},
  title        = {Antigravity: The Constitution Layer as an Agentic Operating System},
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
