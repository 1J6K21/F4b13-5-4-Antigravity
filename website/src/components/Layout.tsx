import type { ReactNode } from 'react';
import { Toolbar } from './Toolbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Toolbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <div className="container">
          <p>© 2026 Jonathan Kalsky (@1J6K21) | Antigravity Research</p>
        </div>
      </footer>
    </div>
  );
}
