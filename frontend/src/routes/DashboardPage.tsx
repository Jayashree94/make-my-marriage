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
  eventDate: 'March 18, 2027',
  month: 'March 2027',
  budget: 240000,
  guestCount: 250,
  vendorCount: 21,
};

const upcoming: TableRow[] = [
  { name: 'Venue walkthrough', status: 'Scheduled', detail: 'Friday, 10:00 AM' },
  { name: 'Catering tasting', status: 'Pending', detail: 'Next Tuesday' },
  { name: 'Floral moodboard review', status: 'In review', detail: 'Due Thursday' },
];

export function DashboardPage() {
  return (
    <div className="page-grid">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Plan overview</p>
          <h2>{summary.coupleName}</h2>
          <p className="muted">{summary.eventDate} · {summary.month}</p>
        </div>
        <div className="hero-meta">
          <span>Budget</span>
          <strong>${summary.budget.toLocaleString()}</strong>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            {stat.trend ? <small>{stat.trend}</small> : null}
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>Upcoming milestones</h3>
            <button type="button" className="secondary-button">View all</button>
          </div>
          <div className="table-list">
            {upcoming.map((item) => (
              <div key={item.name} className="row-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.detail}</p>
                </div>
                <span className="status-badge">{item.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Guest snapshot</h3>
          </div>
          <div className="metric-stack">
            <div>
              <span>Confirmed</span>
              <strong>{summary.guestCount}</strong>
            </div>
            <div>
              <span>Booked vendors</span>
              <strong>{summary.vendorCount}</strong>
            </div>
          </div>
          <EmptyState title="No open invitations" description="All invites are in a good state." />
        </article>
      </section>
    </div>
  );
}
