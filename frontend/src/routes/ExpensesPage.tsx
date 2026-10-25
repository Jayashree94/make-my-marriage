const expenseBreakdown = [
  { label: 'Venue', amount: '$54,000', pct: '32%' },
  { label: 'Catering', amount: '$38,500', pct: '24%' },
  { label: 'Photography', amount: '$22,200', pct: '17%' },
  { label: 'Flowers', amount: '$18,400', pct: '12%' },
];

export function ExpensesPage() {
  return (
    <div className="page-grid">
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Wedding budget</p>
          <h2>Expense overview</h2>
        </div>
        <button type="button" className="primary-button">Add expense</button>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Allocated</span>
          <strong>$240,000</strong>
          <small>Target budget</small>
        </article>
        <article className="stat-card">
          <span>Spent</span>
          <strong>$184,000</strong>
          <small>76% used</small>
        </article>
        <article className="stat-card">
          <span>Remaining</span>
          <strong>$56,000</strong>
          <small>Healthy runway</small>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>Budget split</h3>
          </div>
          <div className="table-list">
            {expenseBreakdown.map((item) => (
              <div key={item.label} className="row-item budget-row">
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.pct} of total spend</p>
                </div>
                <span>{item.amount}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Approvals</h3>
          </div>
          <div className="feature-list">
            <div className="feature-card">
              <span className="section-tag">Pending</span>
              <h4>Florist invoice</h4>
              <p>$7,400 · Due Friday</p>
            </div>
            <div className="feature-card">
              <span className="section-tag">Approved</span>
              <h4>Photographer package</h4>
              <p>$18,200 · Signed and paid</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
