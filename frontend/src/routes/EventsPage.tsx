const eventTimeline = [
  { title: 'Venue walkthrough', detail: 'Friday · 10:00 AM · Rosewood Garden', status: 'Scheduled' },
  { title: 'Catering tasting', detail: 'Tuesday · 2:00 PM · Goldfinch Table', status: 'Pending' },
  { title: 'Floral moodboard review', detail: 'Thursday · 5:30 PM · Bridal suite', status: 'In review' },
];

export function EventsPage() {
  return (
    <div className="page-grid">
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Wedding timeline</p>
          <h2>Event flow</h2>
        </div>
        <button type="button" className="primary-button">Add event</button>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Celebration date</span>
          <strong>18 Mar</strong>
          <small>2027</small>
        </article>
        <article className="stat-card">
          <span>Venue</span>
          <strong>Rosewood</strong>
          <small>Garden hall</small>
        </article>
        <article className="stat-card">
          <span>Guest arrival</span>
          <strong>3:30 PM</strong>
          <small>Before ceremony</small>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>Upcoming milestones</h3>
          </div>
          <div className="table-list">
            {eventTimeline.map((item) => (
              <div key={item.title} className="row-item">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
                <span className="status-badge">{item.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Wedding brief</h3>
          </div>
          <div className="feature-list">
            <div className="feature-card">
              <span className="section-tag">Theme</span>
              <h4>Celestial romance</h4>
              <p>Golden hour tones, candlelit textures and soft floral layers.</p>
            </div>
            <div className="feature-card">
              <span className="section-tag">Experience</span>
              <h4>Guest journey</h4>
              <p>Arrival lounge, welcome cocktails and candlelight reception flow.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
