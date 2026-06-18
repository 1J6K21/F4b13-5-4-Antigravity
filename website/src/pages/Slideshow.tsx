import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Slideshow.css';

const slides = [
  {
    title: "System Prompts as the Cognitive OS",
    subtitle: "A Deep Dive into Prompt Engineering and Agent Workflows",
    content: (
      <div className="text-center">
        <p className="text-xl text-accent mb-4">Author: <strong>Jonathan Kalsky</strong></p>
        <p className="text-secondary text-lg">A Data-Driven Investigation</p>
      </div>
    )
  },
  {
    title: "The Situation & Motivation",
    content: (
      <div className="slide-card">
        <p className="text-lg leading-relaxed">The AI industry is obsessed with making base models smarter. But our experimental data suggests something different: raw capability isn't the bottleneck anymore—workflow is. The industry treats system prompts as an afterthought instead of a distinct, powerful optimization layer.</p>
      </div>
    )
  },
  {
    title: "Phase 1: How We Tested",
    content: (
      <div>
        <p className="mb-4">We engineered 4 distinct system prompts to test this theory:</p>
        <ul className="list-styled">
          <li><code>control(antigravity)</code> - Baseline behavior</li>
          <li><code>fable-prompted</code> - Strict formatting constraints</li>
          <li><code>fabled-prompted-compressed</code> - Extreme token brevity</li>
          <li><code>fable-prompted-innovating</code> - Injected with strategic frameworks</li>
        </ul>
        <div className="def-box mt-6">
          <strong>Frameworks Injected into the "Innovating" Prompt:</strong><br/><br/>
          <em>Founder Mode:</em> "Whenever the user describes a problem, search for a business opportunity hidden inside it."<br/><br/>
          <em>Contrarian Assistant:</em> "Every answer must contain: Consensus view, Strongest opposing view, Unknowns..."<br/><br/>
          <em>Opportunity Hunter:</em> "Every response should identify hidden leverage."
        </div>
      </div>
    )
  },
  {
    title: "Phase 1: Methodology Deep-Dive",
    content: (
      <div className="grid-2">
        <div className="glass-panel p-6">
          <h4 className="text-accent mb-4">Track 1: Architecture Benchmark</h4>
          <ul className="list-styled text-sm">
            <li>80 autonomous subagents launched in parallel.</li>
            <li>Tested on 20 elite-level system architecture queries (e.g., GraphQL optimization, Monorepo CI/CD).</li>
            <li>Scored automatically via an LLM-as-a-judge system (1-100 scale).</li>
          </ul>
        </div>
        <div className="glass-panel p-6">
          <h4 className="text-accent-green mb-4">Track 2: Autonomous Startup MVPs</h4>
          <ul className="list-styled text-sm">
            <li>Agents dropped into empty directories and told to build a React app.</li>
            <li>Scaffolded fully functional <strong>Next.js + Tailwind</strong> web apps unassisted.</li>
            <li>When hitting real bugs (like a node port collision), agents autonomously wrote scripts to fix the environment.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "Phase 1: Workspaces & Outcomes",
    content: (
      <div>
        <p className="mb-4">Under identical capabilities and tools, changing the prompt OS completely altered what the agents built:</p>
        <div className="grid-2">
          <div className="slide-card border-accent" style={{ borderColor: 'var(--accent-gray)' }}>
            <h4 style={{ color: 'var(--accent-gray)', marginBottom: '0.5rem' }}>Control Workspace (FeedbackAI)</h4>
            <p className="text-xs text-secondary leading-relaxed">Built a standard white/slate landing page. It performed basic React hooks setups, but the features were functionally barebones and lacked strategic depth.</p>
          </div>
          <div className="slide-card border-accent" style={{ borderColor: 'var(--accent-gold)' }}>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>Innovator Workspace (ResolvAI Admin)</h4>
            <p className="text-xs text-secondary leading-relaxed">Built an active support center with KPI cards (tracking metrics like "Money Saved"), visual graphs (via Recharts), and customer response queues based on business leverage.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Phase 1: Benchmark Data",
    content: (
      <div>
        <div className="stats-grid mb-6">
          <div className="stat-card glass-panel">
            <div className="stat-value text-accent-green">76.38</div>
            <div className="stat-label">Innovating Prompt Score</div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-value text-accent-gray">71.27</div>
            <div className="stat-label">Baseline Score</div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-value text-accent">+5.11 pts</div>
            <div className="stat-label">Preference Jump</div>
          </div>
        </div>
        <div className="def-box">
          <p className="text-sm">Tone, style directives, and strategic reasoning algorithms transfer highly consistently across different models (+5.11 preference jump). However, system prompts cannot grant capabilities (like long-term memory or cross-session tracking) that require base platform support.</p>
        </div>
      </div>
    )
  },
  {
    title: "Phase 1: Surprising Failures",
    content: (
      <div className="grid-2">
        <div className="slide-card border-danger">
          <h4 className="text-accent-red mb-4">Compression Tradeoffs</h4>
          <p className="text-sm">The highly compressed prompt scored the lowest (70.35). Stripping out conversational instructions caused the model to lose its naturalness, making it feel robotic and untrustworthy.</p>
        </div>
        <div className="slide-card border-warning">
          <h4 className="text-accent-gold mb-4">Specialization Overfitting</h4>
          <p className="text-sm">The strategic innovating prompt overcomplicated simple tasks. When asked to fix a simple CSS bug, it tried to analyze the CSS for "hidden business leverage," annoying the user.</p>
        </div>
      </div>
    )
  },
  {
    title: "Phase 1 Conclusion",
    content: (
      <div className="slide-card border-accent">
        <h4 className="text-accent mb-4">OS Alignment & Directive Transferability</h4>
        <p className="text-lg leading-relaxed">System prompts function as a portable software overlay—a cognitive operating system running on model weights. They guide *how* a model directs its intelligence, but raw capability limits remain anchored to the base weights.</p>
      </div>
    )
  },
  {
    title: "Phase 2: Routing vs. Bloat",
    content: (
      <div>
        <p className="text-lg mb-4">To solve the Generalist vs. Specialist trap, we evaluated <strong>Cognitive Routing</strong> versus <strong>Monolithic prompts</strong>.</p>
        <ul className="list-styled mb-6">
          <li className="mb-2"><strong>Monolithic:</strong> Wastes context space by passing all strategy and developer guidelines in one massive 120KB bloated prompt.</li>
          <li className="mb-2"><strong>Cognitive Routing:</strong> An orchestration engine classifies user intent and dynamically delegates the task to isolated specialist subagents (Founder, Systems Eng, Scientist, Coder).</li>
        </ul>
      </div>
    )
  },
  {
    title: "Phase 2: Empirical Results",
    content: (
      <div>
        <p className="text-sm mb-4">Empirical data from the 8-stage **Startup Build Sprint** shows Setup C (Specialists) completely eliminated overfitting while achieving deep specialization:</p>
        <div className="table-wrapper" style={{ overflowX: 'auto', fontSize: '0.8rem' }}>
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Configuration</th>
                <th>Overfitting</th>
                <th>Divergence</th>
                <th>Specialization</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Setup A: Control</td>
                <td>0.0% (Control Baseline)</td>
                <td>—</td>
                <td>1.0 / 5.0</td>
              </tr>
              <tr>
                <td>Setup B: Monolithic</td>
                <td className="text-accent">100.0% (Complete Leakage)</td>
                <td>88.6%</td>
                <td>2.1 / 5.0</td>
              </tr>
              <tr>
                <td>Setup C: Founder OS</td>
                <td className="text-accent-green">0.0% (Context Isolated)</td>
                <td>84.6%</td>
                <td>4.8 / 5.0</td>
              </tr>
              <tr>
                <td>Setup C: Systems Eng</td>
                <td className="text-accent-green">0.0% (Context Isolated)</td>
                <td>89.3%</td>
                <td>4.7 / 5.0</td>
              </tr>
              <tr>
                <td>Setup C: Scientist OS</td>
                <td className="text-accent-green">0.0% (Context Isolated)</td>
                <td>90.3%</td>
                <td>4.9 / 5.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    title: "Phase 2: Real Agent Workspaces",
    content: (
      <div>
        <p className="mb-4">Holding coding capabilities static, changing the constitution produced entirely divergent product strategies in their directories:</p>
        <div className="grid-3" style={{ gap: '1rem' }}>
          <div className="slide-card border-accent" style={{ padding: '1rem' }}>
            <h4 style={{ color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Founder OS (RouteAI)</h4>
            <p className="text-xs text-secondary">Built support middleware focused on rapid onboarding webhooks, draft auto-generation, and monetization loops.</p>
          </div>
          <div className="slide-card border-accent" style={{ padding: '1rem', borderColor: 'var(--accent-green)' }}>
            <h4 style={{ color: 'var(--accent-green)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Systems Eng (AegisSync)</h4>
            <p className="text-xs text-secondary">Built an enterprise sync gateway focusing on multi-tenant KMS key isolation, spaCy/BERT PII redaction, and WORM audit logs.</p>
          </div>
          <div className="slide-card border-accent" style={{ padding: '1rem', borderColor: 'var(--accent-gold)' }}>
            <h4 style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Scientist (EmpiricalBench)</h4>
            <p className="text-xs text-secondary">Built a workflow benchmark suite calculating confidence intervals, p-values, and Fleiss' Kappa judge consensus.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Phase 2 Case Study: Overfitting",
    content: (
      <div>
        <p className="text-sm mb-4">Task: "Write a CSS rule to center a div." The monolithic strategically overfitted model injected business plans inside the CSS code!</p>
        <div className="grid-2">
          <div className="slide-card border-danger" style={{ padding: '1rem' }}>
            <h4 className="text-sm font-bold text-accent-red mb-2">Monolithic (Complete Leakage)</h4>
            <pre className="text-xs font-mono p-2 bg-black rounded" style={{ color: 'var(--accent)', fontSize: '0.55rem', overflowX: 'auto' }}>
{`.container { display: flex; ... }
/* Contamination: */
The consensus view of centering CSS favors Flexbox... 
The business opportunity lies in building a SaaS layout...`}
            </pre>
          </div>
          <div className="slide-card border-success" style={{ padding: '1rem', borderColor: '#2ecc71' }}>
            <h4 className="text-sm font-bold text-accent-green mb-2">Routed Coder (Isolated Context)</h4>
            <pre className="text-xs font-mono p-2 bg-black rounded" style={{ color: '#2ecc71', fontSize: '0.6rem', overflowX: 'auto' }}>
{`.container {
  display: grid;
  place-items: center;
}`}
            </pre>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Phase 2: Prompt Token Savings",
    content: (
      <div className="grid-2">
        <div className="slide-card border-danger">
          <h4 className="text-accent-red mb-2">Monolithic Overhead</h4>
          <p className="text-sm">Carries the entire developer guidelines on every execution, costing <strong>~30,150 tokens</strong> per task.</p>
        </div>
        <div className="slide-card border-success" style={{ borderColor: '#2ecc71' }}>
          <h4 className="text-accent-green mb-2">Routed Specialists</h4>
          <p className="text-sm">Carries only lightweight templates, costing <strong>~90 to 135 tokens</strong> per task (<strong>99.55% savings</strong>).</p>
        </div>
      </div>
    )
  },
  {
    title: "Phase 2 Conclusion",
    content: (
      <div className="slide-card border-accent">
        <h4 className="text-accent mb-4">Cognitive Routing & Constitutional Primitives</h4>
        <p className="text-lg leading-relaxed">Dynamic cognitive routing validates that constitutions are independent operating layers. By separating capability (what tools the model has) from judgment (the prompt Operating System), we solve prompt bloat and context contamination.</p>
      </div>
    )
  },
  {
    title: "Future Scope & Marketplace",
    content: (
      <div className="grid-3 mt-8">
        <div className="glass-panel p-4 text-center">
          <h4 className="mb-2 font-bold">Model Providers</h4>
          <p className="text-secondary text-sm">Base capabilities (Model Hardware)</p>
        </div>
        <div className="glass-panel p-4 text-center border-accent bg-blue-50/5">
          <h4 className="text-accent mb-2 font-bold">Workflow Layer</h4>
          <p className="text-secondary text-sm">Constitutions & Cognitive Routers</p>
        </div>
        <div className="glass-panel p-4 text-center">
          <h4 className="mb-2 font-bold">Applications</h4>
          <p className="text-secondary text-sm">Consumer Agents & Products</p>
        </div>
      </div>
    )
  }
];

export function Slideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));

  return (
    <div className="slideshow-container">
      <div className="slide glass-panel">
        <div className="slide-content">
          <h2 className="slide-title">{slides[currentSlide].title}</h2>
          {slides[currentSlide].subtitle && (
            <h3 className="slide-subtitle">{slides[currentSlide].subtitle}</h3>
          )}
          <div className="slide-body">
            {slides[currentSlide].content}
          </div>
        </div>
        
        <div className="slide-controls">
          <button 
            className="control-btn" 
            onClick={prevSlide} 
            disabled={currentSlide === 0}
          >
            <ChevronLeft size={20} /> Prev
          </button>
          <div className="slide-indicator text-secondary text-sm">
            Slide {currentSlide + 1} of {slides.length}
          </div>
          <button 
            className="control-btn" 
            onClick={nextSlide} 
            disabled={currentSlide === slides.length - 1}
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
