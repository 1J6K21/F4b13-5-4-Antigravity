import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Slideshow.css';

const slides = [
  {
    title: "System Prompts as the Cognitive OS",
    subtitle: "Evidence from a Constitution Engineering Experiment",
    content: (
      <div className="text-center">
        <p className="text-xl text-accent-cyan mb-4">Author: <strong>Jonathan Kalsky</strong></p>
        <p className="text-secondary">A Data-Driven Investigation</p>
      </div>
    )
  },
  {
    title: "Situation",
    content: (
      <p className="text-lg">The experimental data suggests that behavioral scaffolding contributes substantially to perceived output quality and strategic alignment. The industry treats system prompts as an afterthought instead of a distinct optimization layer.</p>
    )
  },
  {
    title: "Task",
    content: (
      <div>
        <p className="mb-4">We engineered 4 strict variants to evaluate this dynamic:</p>
        <ul className="list-styled">
          <li><code>control(antigravity)</code></li>
          <li><code>fable-prompted</code></li>
          <li><code>fabled-prompted-compressed</code></li>
          <li><code>fable-prompted-innovating</code></li>
        </ul>
        <div className="def-box mt-6">
          <strong>Definitions (Injected into innovating):</strong><br/>
          <em>Founder Mode:</em> "Whenever the user describes a problem, search for a business opportunity hidden inside it."<br/>
          <em>Contrarian Assistant:</em> "Every answer must contain: Consensus view, Strongest opposing view..."<br/>
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
          <h4 className="text-accent-gold mb-4">Test 1: Architecture Benchmark</h4>
          <ul className="list-styled">
            <li>80 autonomous subagents launched in parallel.</li>
            <li>Evaluated on 20 elite-level queries.</li>
            <li>Scored via localized LLM-as-a-judge system (1-100).</li>
          </ul>
        </div>
        <div className="glass-panel p-6">
          <h4 className="text-accent-cyan mb-4">Test 2: Autonomous Startup MVPs</h4>
          <ul className="list-styled">
            <li>Subagents isolated in separate workspaces.</li>
            <li>Tasked to build Next.js + Tailwind + Three.js apps autonomously.</li>
            <li>Agents autonomously patched node port collisions (EADDRINUSE).</li>
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
            <div className="stat-value">76.38</div>
            <div className="stat-label">fable-innovating</div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-value">71.27</div>
            <div className="stat-label">control(antigravity)</div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-value text-accent">+5.11 pts</div>
            <div className="stat-label">Preference Jump</div>
          </div>
        </div>
        <p className="text-secondary text-sm">The true Result goes far beyond higher quality answers. We arrived at a fundamental conclusion: behavioral traits may transfer across models more readily than reasoning capabilities, suggesting constitutions function as a partially portable cognitive layer rather than a source of intelligence.</p>
      </div>
    )
  },
  {
    title: "The Constitution Marketplace",
    subtitle: "Constitution Engineering serves as a \"Workflow Layer\" bridging hardware and applications.",
    content: (
      <div className="grid-3 mt-8">
        <div className="glass-panel p-4 text-center">
          <h4 className="mb-2">Model Providers</h4>
          <p className="text-secondary">OpenAI, Anthropic, Google</p>
        </div>
        <div className="glass-panel p-4 text-center border-accent">
          <h4 className="text-accent-gold mb-2">Workflow Layer</h4>
          <p className="text-secondary">Constitutions (Founder OS)</p>
        </div>
        <div className="glass-panel p-4 text-center">
          <h4 className="mb-2">Applications</h4>
          <p className="text-secondary">Agents & Products</p>
        </div>
      </div>
    )
  }
];

export function Slideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  };

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
            <ChevronLeft size={24} /> Prev
          </button>
          <div className="slide-indicator">
            {currentSlide + 1} / {slides.length}
          </div>
          <button 
            className="control-btn" 
            onClick={nextSlide} 
            disabled={currentSlide === slides.length - 1}
          >
            Next <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
