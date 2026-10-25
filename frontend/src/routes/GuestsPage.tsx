const guests = [
  { name: 'Nisha & Arjun', type: 'Family', status: 'Confirmed', note: 'Table 7' },
  { name: 'Riya Mehta', type: 'Friend', status: 'Pending', note: 'Need dietary update' },
  { name: 'Aditi Shah', type: 'Vendor + guest', status: 'Confirmed', note: 'VIP seating' },
  { name: 'Karan Joshi', type: 'Family', status: 'Awaiting', note: 'Flight details pending' },
];

export function GuestsPage() {
  return (
    <div className="page-grid">
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Guest relations</p>
          <h2>Guest list</h2>
        </div>
        <button type="button" className="primary-button">Invite guest</button>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Confirmed</span>
          <strong>232</strong>
          <small>+14% this month</small>
        </article>
        <article className="stat-card">
          <span>Pending</span>
          <strong>27</strong>
          <small>Needs follow-up</small>
        </article>
        <article className="stat-card">
          <span>Table plan</span>
          <strong>16</strong>
          <small>Assigned</small>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>RSVP overview</h3>
          </div>
          <div className="table-list">
            {guests.map((guest) => (
              <div key={guest.name} className="row-item">
                <div>
                  <strong>{guest.name}</strong>
                  <p>{guest.type}</p>
                </div>
                <div className="mini-meta">
                  <span className="status-badge subtle">{guest.status}</span>
                  <small>{guest.note}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Seating notes</h3>
          </div>
          <div className="feature-list">
            <div className="feature-card">
              <span className="section-tag">VIP</span>
              <h4>Parents table</h4>
              <p>Front-row view with a dedicated escort route and champagne welcome.</p>
            </div>
            <div className="feature-card">
              <span className="section-tag">Family</span>
              <h4>Extended clusters</h4>
              <p>Grouped by age, language and relationship to the couple for comfort.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
