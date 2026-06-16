import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Slideshow.css';

const slides = [
  {
    title: "System Prompts as the Cognitive OS",
    subtitle: "Evidence from a Constitution Engineering Experiment",
    content: (
      <div className="text-center">
        <p className="text-xl text-accent mb-4">Author: <strong>Jonathan Kalsky</strong></p>
        <p className="text-secondary text-lg">A Data-Driven Investigation</p>
      </div>
    )
  },
  {
    title: "Situation",
    content: (
      <div className="slide-card">
        <p className="text-lg leading-relaxed">The experimental data suggests that behavioral scaffolding contributes substantially to perceived output quality and strategic alignment. The industry treats system prompts as an afterthought instead of a distinct optimization layer.</p>
      </div>
    )
  },
  {
    title: "Task: Experimental Setup",
    content: (
      <div>
        <p className="mb-4">We engineered 4 strict variants to evaluate this dynamic:</p>
        <ul className="list-styled">
          <li><code>control(antigravity)</code> - Baseline behavior</li>
          <li><code>fable-prompted</code> - Strict formatting and prose rules</li>
          <li><code>fabled-prompted-compressed</code> - Extreme token brevity</li>
          <li><code>fable-prompted-innovating</code> - Injected with strategic cognitive frameworks</li>
        </ul>
        <div className="def-box mt-6">
          <strong>Definitions (Injected into Innovating Variant):</strong><br/><br/>
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
          <h4 className="text-accent mb-4">Test 1: Architecture Benchmark</h4>
          <ul className="list-styled text-sm">
            <li>80 autonomous subagents launched in parallel.</li>
            <li>Evaluated on 20 elite-level system architecture and React coding queries.</li>
            <li>Scored via localized LLM-as-a-judge system (1-100 scale).</li>
          </ul>
        </div>
        <div className="glass-panel p-6">
          <h4 className="text-accent-green mb-4">Test 2: Autonomous Startup MVPs</h4>
          <ul className="list-styled text-sm">
            <li>Subagents isolated in separate directory workspaces.</li>
            <li>Tasked to ideate, scaffold, and compile fully functional <strong>Next.js + Tailwind</strong> web apps unassisted.</li>
            <li>Agents autonomously patched node port collisions.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "Result: The Data & Discovery",
    content: (
      <div>
        <div className="stats-grid mb-6">
          <div className="stat-card glass-panel">
            <div className="stat-value text-accent-green">76.38</div>
            <div className="stat-label">fable-innovating</div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-value text-accent-gray">71.27</div>
            <div className="stat-label">control(baseline)</div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-value text-accent">+5.11 pts</div>
            <div className="stat-label">Preference Jump</div>
          </div>
        </div>
        <div className="def-box">
          <p className="text-sm">The true Result goes far beyond higher quality answers. We arrived at a fundamental conclusion: behavioral traits may transfer across models more readily than reasoning capabilities, suggesting constitutions function as a partially portable cognitive layer rather than a source of intelligence.</p>
        </div>
      </div>
    )
  },
  {
    title: "Capability vs. Intelligence",
    content: (
      <div>
        <p className="text-lg mb-4">Beneath the prompt, the model is merely <strong className="text-accent">capable</strong>, not <strong className="text-accent">intelligent</strong>.</p>
        <ul className="list-styled mb-6">
          <li className="mb-4"><strong>Capability (Hardware):</strong> All 4 variants successfully wrote complex, compiling Next.js + Tailwind React applications. The base weights provide raw coding ability.</li>
          <li><strong>Intelligence (OS):</strong> Only the <code>innovating</code> prompt identified high-leverage business opportunities and contrarian angles. The OS provides the strategic workflow.</li>
        </ul>
        <div className="slide-card border-accent p-4 bg-secondary-bg">
          <p className="font-bold text-sm">Prompt Diff Analysis:</p>
          <p className="text-sm">The agent explicitly outputted "Contrarian Research Assistant" headers during the Startup Benchmark, forcing a superior decision workflow exactly mapping to its prompt injection.</p>
        </div>
      </div>
    )
  },
  {
    title: "Surprising Failures",
    content: (
      <div className="grid-2">
        <div className="slide-card border-danger">
          <h4 className="text-accent-red mb-4">Compression Degradation</h4>
          <p className="text-sm"><code>fabled-prompted-compressed</code> scored the lowest (70.35), demonstrating that extreme prompt compression destroys conversational naturalness and trust.</p>
        </div>
        <div className="slide-card border-warning">
          <h4 className="text-accent-gold mb-4">Specialization Overfitting</h4>
          <p className="text-sm"><code>fable-prompted-innovating</code> overcomplicated simple queries by injecting unnecessary business leverage analysis into straightforward bug fixes.</p>
        </div>
      </div>
    )
  },
  {
    title: "The Constitution Marketplace",
    subtitle: "Constitution Engineering serves as a \"Workflow Layer\" bridging hardware and applications.",
    content: (
      <div className="grid-3 mt-8">
        <div className="glass-panel p-4 text-center">
          <h4 className="mb-2 font-bold">Model Providers</h4>
          <p className="text-secondary text-sm">OpenAI, Anthropic, Google</p>
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
