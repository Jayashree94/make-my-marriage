const vendors = [
  { name: 'Rose & Ribbons', category: 'Florals', status: 'Confirmed' },
  { name: 'Velvet Frame Studio', category: 'Photography', status: 'Booked' },
  { name: 'Crescent Catering', category: 'Food & beverage', status: 'Awaiting tasting' },
  { name: 'Golden Hour Events', category: 'Production', status: 'Confirmed' },
];

export function VendorsPage() {
  return (
    <div className="page-grid">
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Vendor network</p>
          <h2>Key partners</h2>
        </div>
        <button type="button" className="primary-button">Add vendor</button>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Booked</span>
          <strong>19</strong>
          <small>+3 this month</small>
        </article>
        <article className="stat-card">
          <span>Contracts</span>
          <strong>14</strong>
          <small>Signed</small>
        </article>
        <article className="stat-card">
          <span>Open tasks</span>
          <strong>6</strong>
          <small>2 urgent</small>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>Vendor list</h3>
          </div>
          <div className="table-list">
            {vendors.map((vendor) => (
              <div key={vendor.name} className="row-item">
                <div>
                  <strong>{vendor.name}</strong>
                  <p>{vendor.category}</p>
                </div>
                <span className="status-badge">{vendor.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Next touchpoints</h3>
          </div>
          <div className="feature-list">
            <div className="feature-card">
              <span className="section-tag">Call</span>
              <h4>Venue coordinator</h4>
              <p>Confirm timeline and power access for the ceremony.</p>
            </div>
            <div className="feature-card">
              <span className="section-tag">Review</span>
              <h4>Wedding planner</h4>
              <p>Finalize the production schedule and service flow.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
