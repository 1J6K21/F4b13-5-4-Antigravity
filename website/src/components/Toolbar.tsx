import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Presentation, Beaker } from 'lucide-react';
import './Toolbar.css';

export function Toolbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Research Hub', icon: <Home size={18} /> },
    { path: '/one-pager', label: 'One Pager', icon: <FileText size={18} /> },
    { path: '/slideshow', label: 'Slideshow', icon: <Presentation size={18} /> },
    { path: '/experiments', label: 'Agent Workspaces', icon: <Beaker size={18} /> },
  ];

  return (
    <header className="toolbar">
      <div className="toolbar-container glass-panel-nav">
        <div className="logo">
          <Link to="/">
            <div className="logo-icon text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                <path d="M9 13a4.5 4.5 0 0 0 3-4" />
                <path d="M6 10.5a1.5 1.5 0 0 1 3-1.5" />
                <path d="M12 5v13" />
                <path d="M12 7h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7" />
                <path d="M12 11h5" />
                <path d="M12 15h5" />
              </svg>
            </div>
            <span className="logo-text">Constitution Engineering</span>
          </Link>
        </div>
        <nav className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="external-links">
          <a href="https://github.com/1J6K21/F4b13-5-4-Antigravity" target="_blank" rel="noopener noreferrer" className="nav-item border-link">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/jonathan-kalsky" target="_blank" rel="noopener noreferrer" className="nav-item border-link">
            LinkedIn
          </a>
        </div>
      </div>
    </header>
  );
}
