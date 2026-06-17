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
    title: "The Situation",
    content: (
      <div className="slide-card">
        <p className="text-lg leading-relaxed">The AI industry is obsessed with making base models smarter. But our experimental data suggests something different: raw capability isn't the bottleneck anymore—workflow is. The industry treats system prompts as an afterthought instead of a distinct, powerful optimization layer.</p>
      </div>
    )
  },
  {
    title: "How We Tested",
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
    title: "Methodology Deep-Dive",
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
    title: "The Results & The Data",
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
          <p className="text-sm">The true discovery goes beyond the scores. We found that strategic frameworks and personality traits transfer across different models perfectly, but raw coding ability remains tied to the base model. The system prompt acts as a portable "Cognitive Layer" rather than a source of new intelligence.</p>
        </div>
      </div>
    )
  },
  {
    title: "Capability vs. Intelligence",
    content: (
      <div>
        <p className="text-lg mb-4">Beneath the prompt, the model is incredibly <strong className="text-accent">capable</strong>, but fundamentally <strong className="text-accent">inert</strong>.</p>
        <ul className="list-styled mb-6">
          <li className="mb-4"><strong>Capability (Hardware):</strong> All 4 variants successfully wrote complex Next.js applications using identical tech stacks. The base weights provide raw coding capability.</li>
          <li><strong>Intelligence (OS):</strong> But only the <code>innovating</code> prompt built a "B2B AI Resolution Engine" instead of a generic "Feedback Tool." The prompt dictates the strategic workflow.</li>
        </ul>
        <div className="slide-card border-accent p-4 bg-secondary-bg">
          <p className="font-bold text-sm">Prompt Diff Analysis:</p>
          <p className="text-sm">During tests, the agent literally printed out headers titled "Contrarian Research Assistant" to force itself to answer its own questions. It didn't become smarter; it just followed a superior workflow.</p>
        </div>
      </div>
    )
  },
  {
    title: "Surprising Failures",
    content: (
      <div className="grid-2">
        <div className="slide-card border-danger">
          <h4 className="text-accent-red mb-4">Compression Tradeoffs</h4>
          <p className="text-sm">The highly compressed prompt scored the lowest (70.35). Stripping out connective, human-like language caused the model to lose its conversational naturalness, making it feel robotic and untrustworthy.</p>
        </div>
        <div className="slide-card border-warning">
          <h4 className="text-accent-gold mb-4">Specialization Overfitting</h4>
          <p className="text-sm">The strategic innovating prompt overcomplicated simple tasks. When asked to fix a simple CSS bug, it tried to analyze the CSS for "hidden business leverage," annoying the user.</p>
        </div>
      </div>
    )
  },
  {
    title: "Experimental Limitations",
    content: (
      <div className="grid-2">
        <div className="slide-card">
          <h4 className="text-accent mb-2">Scope & Scale</h4>
          <ul className="list-styled text-sm">
            <li className="mb-2"><strong>Sample size limited</strong>: Conducted across 20 system architecture benchmarks and 2 end-to-end software builds.</li>
            <li className="mb-2"><strong>Generalizability</strong>: Evaluated specific structural constitutions on a constant baseline model; portability across fundamentally different model weight families remains hypothesized.</li>
          </ul>
        </div>
        <div className="slide-card">
          <h4 className="text-accent-green mb-2">Evaluation Rigor</h4>
          <ul className="list-styled text-sm">
            <li className="mb-2"><strong>LLM Judges</strong>: Quantitative scoring relies on LLM-based evaluators, which carry inherent stylistic preferences and biases.</li>
            <li className="mb-2"><strong>Exploratory Nature</strong>: Findings indicate strong portability trends but are exploratory rather than definitive.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "The Constitution Marketplace",
    subtitle: "System prompts serve as a \"Workflow Layer\" bridging the base model hardware and final applications.",
    content: (
      <div className="grid-3 mt-8">
        <div className="glass-panel p-4 text-center">
          <h4 className="mb-2 font-bold">Model Providers</h4>
          <p className="text-secondary text-sm">OpenAI, Anthropic, Google (Hardware)</p>
        </div>
        <div className="glass-panel p-4 text-center border-accent bg-blue-50/5">
          <h4 className="text-accent mb-2 font-bold">Workflow Layer</h4>
          <p className="text-secondary text-sm">Constitutions (Cognitive OS)</p>
        </div>
        <div className="glass-panel p-4 text-center">
          <h4 className="mb-2 font-bold">Applications</h4>
          <p className="text-secondary text-sm">Agents & Consumer Products</p>
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
