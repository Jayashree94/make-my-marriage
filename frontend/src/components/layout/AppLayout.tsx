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
          <Link to="/dashboard" className="brand-mark-wrap">
            <span className="brand-logo" aria-hidden="true">MM</span>
            <span className="brand-copy">
              <span className="brand-mark">{brand}</span>
              <span className="brand-subtitle">Crafting your forever story</span>
            </span>
          </Link>
        </div>

        <div className="sidebar-card">
          <span className="mini-label">Celebration</span>
          <strong>Autumn soirée</strong>
          <small>18 March 2027</small>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <div key={item.to} className="nav-item">
              {item.component({ isActive: false })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <span className="avatar">AE</span>
            <div>
              <strong>Event lead</strong>
              <small>Priya Sharma</small>
            </div>
          </div>
        </div>
      </aside>

      <div className="content-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Wedding planning dashboard</p>
            <h1>Planner overview</h1>
          </div>
          <div className="topbar-actions">
            <button className="secondary-button" type="button">
              Quick view
            </button>
            <button className="primary-button" type="button">
              New checklist item
            </button>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
