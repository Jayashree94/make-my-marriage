import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type AppLayoutProps = {
  brand: string;
  navItems: Array<{
    label: string;
    to: string;
    component: (props: { isActive: boolean }) => ReactNode;
  }>;
  children: ReactNode;
};

export function AppLayout({ brand, navItems, children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/dashboard" className="brand-mark">
            {brand}
          </Link>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <div key={item.to} className="nav-item">
              {item.component({ isActive: false })}
            </div>
          ))}
        </nav>
      </aside>

      <div className="content-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Wedding planning dashboard</p>
            <h1>Planner overview</h1>
          </div>
          <button className="primary-button" type="button">
            New checklist item
          </button>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
