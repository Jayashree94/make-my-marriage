const settings = [
  { label: 'Dark luxury mode', value: 'Enabled' },
  { label: 'Email reminders', value: 'On' },
  { label: 'Guest RSVP notifications', value: 'Auto-send' },
  { label: 'Shared planner access', value: 'Family + boutique' },
];

export function SettingsPage() {
  return (
    <div className="page-grid">
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Preferences</p>
          <h2>Planning settings</h2>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Workspace configuration</h3>
        </div>
        <div className="settings-list">
          {settings.map((item) => (
            <div key={item.label} className="setting-row">
              <span>{item.label}</span>
              <button type="button" className="toggle-pill">{item.value}</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
