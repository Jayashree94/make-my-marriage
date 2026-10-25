import { EmptyState } from '../components/common/EmptyState';
import type { DashboardSummary, StatCard, TableRow } from '../types';

const stats: StatCard[] = [
  { label: 'Budget status', value: '$18,400', trend: '+8%' },
  { label: 'Guests confirmed', value: '232', trend: '+14%' },
  { label: 'Vendors booked', value: '19', trend: '+3' },
  { label: 'Tasks to complete', value: '12', trend: '-2' },
];

const summary: DashboardSummary = {
  coupleName: 'Aarav & Meera',
  eventDate: '18 March 2027',
  month: 'March 2027',
  budget: 240000,
  guestCount: 250,
  vendorCount: 21,
};

const upcoming: TableRow[] = [
  { name: 'Venue walkthrough', status: 'Scheduled', detail: 'Friday · 10:00 AM · Rosewood Garden' },
  { name: 'Catering tasting', status: 'Pending', detail: 'Tuesday · 2:00 PM · Maison Dore' },
  { name: 'Floral moodboard review', status: 'In review', detail: 'Thursday · 5:30 PM · Bridal suite' },
];

export function DashboardPage() {
  return (
    <div className="dashboard-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow eyebrow-accent">Plan overview</p>
          <h2 className="hero-title">{summary.coupleName}</h2>
          <p className="hero-subcopy">
            {summary.eventDate} · {summary.month} · curated with a refined, elevated guest experience.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-button">
              Review itinerary
            </button>
            <button type="button" className="secondary-button">
              Open budget
            </button>
          </div>
        </div>

        <div className="hero-meta">
          <div className="hero-date">
            <span>Next milestone</span>
            <strong>{summary.eventDate}</strong>
          </div>
          <div className="hero-budget">
            <span>Overall budget</span>
            <strong>${summary.budget.toLocaleString()}</strong>
          </div>
          <div className="hero-progress">
            <span>Planning progress</span>
            <div className="progress-track" aria-label="Planning progress">
              <span style={{ width: '78%' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            {stat.trend ? <small className="trend-pill">{stat.trend}</small> : null}
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Itinerary</p>
              <h3>Upcoming milestones</h3>
            </div>
            <button type="button" className="secondary-button small-button">
              View all
            </button>
          </div>

          <div className="timeline-list">
            {upcoming.map((item) => (
              <div key={item.name} className="timeline-item">
                <span className="timeline-dot" aria-hidden="true" />
                <div className="timeline-copy">
                  <strong>{item.name}</strong>
                  <p>{item.detail}</p>
                </div>
                <span className="status-badge">{item.status}</span>
              </div>
            ))}
          </div>
        </article>

        <aside className="side-stack">
          <article className="panel">
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">Guest summary</p>
                <h3>Confirmed</h3>
              </div>
            </div>
            <div className="mini-stat-row">
              <strong>{summary.guestCount}</strong>
              <span>of 250 invited</span>
            </div>
            <div className="mini-progress" aria-label="Confirmed guests progress">
              <span style={{ width: '92%' }} />
            </div>
          </article>

          <article className="panel">
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">Suppliers</p>
                <h3>Booked vendors</h3>
              </div>
            </div>
            <div className="mini-stat-row">
              <strong>{summary.vendorCount}</strong>
              <span>design partners</span>
            </div>
            <EmptyState title="No open invitations" description="All invites are in a good state." />
          </article>
        </aside>
      </section>
    </div>
  );
}
