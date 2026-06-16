import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Presentation, Beaker } from 'lucide-react';
import './Toolbar.css';

export function Toolbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Research Hub', icon: <Home size={18} /> },
    { path: '/one-pager', label: 'One Pager', icon: <FileText size={18} /> },
    { path: '/slideshow', label: 'Slideshow', icon: <Presentation size={18} /> },
    { path: '/experiments', label: 'Live Experiments', icon: <Beaker size={18} /> },
  ];

  return (
    <header className="toolbar glass-panel">
      <div className="toolbar-container">
        <div className="logo">
          <Link to="/">
            <span className="logo-icon">∆</span>
            <span className="logo-text text-gradient">Antigravity</span>
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
        <div className="github-link">
          <a href="https://github.com/1J6K21/F4b13-5-4-Antigravity" target="_blank" rel="noopener noreferrer" className="nav-item">
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
