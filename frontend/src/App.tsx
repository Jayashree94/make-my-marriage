const countdown = [
  { value: '142', label: 'DAYS' },
  { value: '18', label: 'HOURS' },
  { value: '42', label: 'MINUTES' },
  { value: '39', label: 'SECONDS' },
];

const itinerary = [
  {
    day: 'DAY 01',
    date: 'THU, OCT 23',
    title: 'The Welcome Soirée & Sunset Yacht Cruise',
    description:
      'Private Riva boat procession leaving Villa d’Este harbor for panoramic champagne degustation and acoustic strings under twilight.',
    time: '18:00 CEST',
    attire: 'Riviera Chic Silk',
    location: 'Lake Como Docks',
  },
  {
    day: 'DAY 02',
    date: 'FRI, OCT 24',
    title: 'The Royal Matrimony & Gala Banquet',
    description:
      'Exchange of vows at the Mosaic Gardens followed by an haute gastronomy banquet curated by 3-Michelin star chefs and midnight fireworks.',
    time: '16:30 CEST',
    attire: 'Black Tie & Velvet',
    location: 'The Gilded Pavilion',
    featured: true,
  },
  {
    day: 'DAY 03',
    date: 'SAT, OCT 25',
    title: 'The Recovery Brunch & Garden Farewell',
    description:
      'Relaxed conservatory brunch amidst ancient cypress groves, bespoke bloody mary bar, and helicopter transfers to Milan Malpensa.',
    time: '11:30 CEST',
    attire: 'Crisp Linen & Champagne',
    location: 'Villa Orangerie',
  },
];

const guestRows = [
  ['HRH Princess Beatrice of Savoy', 'Table 01 — The Gilded Pavilion', 'Confirmed', 'Beluga Caviar & White Truffle Tagliolini', 'Maybach 680 (Private)'],
  ['Sir Cedric Kensington-Blake', 'Table 02 — Belle Époque Suite', 'Confirmed', 'A5 Miyazaki Wagyu Reserve', 'Riva Aquarama Boat'],
  ['Countess Eléonore de Montmirail', 'Table 04 — Cypress Loggia', 'Pending Passkey', 'Vegan Haute Gastronomy Selection', 'Helipad Slot Requested'],
  ['Lady Marisol Wren', 'Table 06 — The Atrium Salon', 'Confirmed', 'Atlantic Lobster Thermidor', 'Private Chauffeur Arrival'],
];

const budgetStats = [
  { value: '$1,250,000', label: 'Wedding Design & Styling', note: 'Floral architecture, textile homage, and ceremonial draping.' },
  { value: '$890,000', label: 'Culinary Experience', note: 'Chef-led tasting menus, beverage curation, and soirée service.' },
  { value: '$360,000', label: 'Transport & Logistics', note: 'Fleet coordination, boat service, and departure transfers.' },
];

const vaultCards = [
  'The Alchemy of Vows',
  'The Peak of the Lakeside Celebration',
  'The Story of Vance & Montgomery',
  'The Golden Garden Farewell',
];

function App() {
  return (
    <div className="page-shell">
      <div className="page-frame">
        <header className="topbar">
          <div className="brand-block" aria-label="Make My Marriage brand">
            <div className="brand-mark">✦</div>
            <div className="brand-copy">
              <span>MAKE MY MARRIAGE</span>
              <small>COUTURE CELEBRATIONS &amp; BESPOKE UNION SUITE</small>
            </div>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#story">Our Story</a>
            <a href="#itinerary">Itinerary &amp; Events</a>
            <a href="#guests">VIP Directory</a>
            <a href="#vault">Gallery</a>
            <a href="#ledger">Registry &amp; Ledger</a>
            <a href="#rsvp">RSVP</a>
          </nav>

          <button type="button" className="portal-button">
            <span className="portal-icon">◌</span>
            VIP Portal
          </button>
        </header>

        <main className="content-wrap">
          <section className="hero-section">
            <div className="hero-meta-row">
              <span>EST. MMXXV</span>
              <div className="meta-rule" />
              <span>COUTURE NUPTIALS</span>
            </div>

            <div className="crest" aria-hidden="true">
              <div className="crest-inner">✧</div>
            </div>

            <p className="eyebrow">A CELESTIAL CELEBRATION OF ETERNAL UNION</p>

            <h1 className="hero-title">
              <span>Lady Genevieve Vance</span>
              <span className="ampersand">&amp;</span>
              <span>Lord Alexander Montgomery</span>
            </h1>

            <div className="wedding-meta" aria-label="Wedding details">
              <span>Villa d’Este</span>
              <span className="dot">◆</span>
              <span>Lake Como, Italy</span>
              <span className="dot">◆</span>
              <span>October 24, 2025</span>
            </div>

            <div className="countdown-panel">
              <div className="countdown-header">CHRONOMETER COUNTDOWN TO THE PROCESSION</div>
              <div className="countdown-grid">
                {countdown.map((item) => (
                  <div key={item.label} className="count-box">
                    <span className="count-value">{item.value}</span>
                    <span className="count-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cta-row">
              <button type="button" className="primary-btn">
                <span>✦</span>
                RSVP with Access Code
              </button>
              <button type="button" className="secondary-btn">
                <span>✧</span>
                Enter VIP Suite
              </button>
            </div>
          </section>

          <section className="section-block itinerary-section" id="itinerary">
            <div className="section-head">
              <div>
                <div className="eyebrow-row">
                  <span className="rule" />
                  <span>CEREMONIAL PROTOCOL</span>
                </div>
                <h2>Curated Itinerary</h2>
              </div>
              <div className="head-actions">
                <button type="button">Sync All to Calendar</button>
                <button type="button">Chauffeur Dispatch</button>
              </div>
            </div>

            <div className="itinerary-grid">
              {itinerary.map((item) => (
                <article key={item.title} className={`itinerary-card ${item.featured ? 'featured' : ''}`}>
                  {item.featured && <div className="featured-tag">PRINCIPAL MATRIMONY</div>}
                  <div className="card-head">
                    <span className="day-pill">{item.day}</span>
                    <span className="date-pill">{item.date}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="card-meta">
                    <div><label>TIME</label><strong>{item.time}</strong></div>
                    <div><label>ATTIRE CODE</label><strong>{item.attire}</strong></div>
                    <div><label>LOCATION</label><strong>{item.location}</strong></div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section-block guest-section" id="guests">
            <div className="section-head compact-head">
              <div>
                <div className="eyebrow-row">
                  <span className="rule" />
                  <span>VIP PROTOCOL</span>
                </div>
                <h2>Guest Concierge Ledger</h2>
              </div>
              <div className="stats-mini">
                <div><strong>180</strong><span>CONFIRMED</span></div>
                <div><strong>24</strong><span>PENDING</span></div>
                <div><strong>12</strong><span>ROYAL TABLES</span></div>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-pills">
                <button className="active" type="button">ALL GUESTS</button>
                <button type="button">ROYAL FAMILY</button>
                <button type="button">INNER CIRCLE</button>
                <button type="button">INTERNATIONAL VIPS</button>
                <button type="button">BRIDAL PARTY</button>
              </div>
              <div className="search-box">
                <span>⌕</span>
                <input type="text" placeholder="Search dignitary name..." />
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>DIGNITARY NAME</th>
                    <th>TIER &amp; SEATING</th>
                    <th>RSVP STATUS</th>
                    <th>GASTRONOMY PREFERENCE</th>
                    <th>TRANSFER DISPATCH</th>
                  </tr>
                </thead>
                <tbody>
                  {guestRows.map(([name, seating, status, preference, dispatch], index) => (
                    <tr key={`${name}-${index}`}>
                      <td>
                        <div className="guest-cell">
                          <span className="initials">{name.split(' ').map((word) => word[0]).slice(0, 2).join('').toUpperCase()}</span>
                          <div>
                            <strong>{name}</strong>
                            <small>Monaco Delegation</small>
                          </div>
                        </div>
                      </td>
                      <td>{seating}</td>
                      <td>
                        <span className={`status-pill ${status === 'Pending Passkey' ? 'pending' : ''}`}>
                          {status}
                        </span>
                      </td>
                      <td>{preference}</td>
                      <td>{dispatch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="section-block ledger-section" id="ledger">
            <div className="section-head compact-head">
              <div>
                <div className="eyebrow-row">
                  <span className="rule" />
                  <span>FINANCIAL CATALOGUE</span>
                </div>
                <h2>Curated Budget &amp; Scenography Ledger</h2>
              </div>
            </div>

            <div className="budget-grid">
              {budgetStats.map((item) => (
                <div key={item.label} className="metric-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <small>{item.note}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="section-block memory-section" id="vault">
            <div className="section-head compact-head">
              <div>
                <div className="eyebrow-row">
                  <span className="rule" />
                  <span>MEMORY VAULT</span>
                </div>
                <h2>Memory &amp; Visual Vault</h2>
              </div>
            </div>

            <div className="photo-grid">
              {vaultCards.map((title, index) => (
                <div key={title} className="photo-card" data-tone={index % 4}>
                  <div className="photo-overlay" />
                  <span>{title}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="section-block rsvp-section" id="rsvp">
            <div className="rsvp-box">
              <div className="eyebrow-row center">
                <span className="rule" />
                <span>CONFIRMATION</span>
              </div>
              <h2>RSVP &amp; Protocol Verification</h2>
              <p>Formal verification for guest access, itinerary confirmation, and personal protocol selection.</p>

              <div className="rsvp-form">
                <div className="form-grid">
                  <label>
                    <span>Guest Name</span>
                    <input type="text" placeholder="Full name" />
                  </label>
                  <label>
                    <span>Access Key</span>
                    <input type="text" placeholder="AE-15X-XX" />
                  </label>
                  <label>
                    <span>Arrival Window</span>
                    <input type="text" placeholder="Friday, 15:30" />
                  </label>
                  <label>
                    <span>Guest Count</span>
                    <input type="text" placeholder="2 guests" />
                  </label>
                </div>
                <button type="button" className="submit-btn">Confirm Attendance</button>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer-bar">
          <div className="footer-brand">
            <span className="footer-mark">✦</span>
            <span>MAKE MY MARRIAGE</span>
          </div>
          <div className="footer-links">
            <a href="#story">Our Story</a>
            <a href="#itinerary">Itinerary</a>
            <a href="#vault">Photos</a>
            <a href="#rsvp">RSVP</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
