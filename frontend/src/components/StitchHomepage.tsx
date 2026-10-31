type StitchHomepageProps = {
  coupleName?: string;
  destination?: string;
  weddingDate?: string;
  accountLabel?: string;
  accountName?: string;
  onAccount: () => void;
  onLogout?: () => void;
};

const portfolioCards = [
  {
    eyebrow: 'HAUTE COUTURE ATELIER',
    title: 'Hand-Embroidered Alençon Silk',
    location: 'PARISIAN ATELIER',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBauD8735tu7OEHoaDO7CDNUhyd3IbbH_LHOZrwU1duFCGTmwfHMSgTCSFoPGJwVdsrqoyUJfZ4WFWlUC0d2FMVTpX6YrMLhjVwb1c1epZJ2JRjvWguPFUkB8tWvZjm41xeVQZNo_bqhfHR8YBdh-zXntus91gJUsLnQnX1gsq1d0qaqICtGBbKQAB2rM3TRgdrnsqqcL7BFJuLgs8JgpizNixTyEeAS6L2jXJruuTzF4IjU3ywAY3K3A',
  },
  {
    eyebrow: 'HISTORIC VENUE BUYOUT',
    title: "Villa d’Este Harbor & Gardens",
    location: 'LAKE COMO',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQFEpALtSL3xkweUYtiRmQvmakiX68xY2w_M0DId61uX0__LebzNiNaQyhCgSvxR8_2xXiufzGnbuflhbrIBLk-xlcgv2PaVJZY3-hfGHLy4XgkLuXiUXBzzgFqZ1F4Vv3fVgK7q7w',
  },
  {
    eyebrow: 'GRAND BANQUET PRODUCTION',
    title: 'The Gilded Pavilion Scenography',
    location: 'FRENCH CHATEAU',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqHGcdLCCZzgTbKZXQ3QC-dsnUAlqIWqYw-s3ITzhKkNwdMPRafzZz1TvabqyCm8lHIwlMKlwojXReHZQv_Dt0FpCm1FLd_69gd23dTjL9RUERojGO2G80qbb-5jDld-MVR778WCngMfIVal-2veCMTLM389T21Nh14GXj2y8HqIT3sizgtPd9g4iDKh7O1R58FuAjZCunJ3tl7btN-8TTi1t1a08h2qoKZjASp-VKtri1wD2eCnbkLg',
  },
];

export default function StitchHomepage({
  coupleName,
  destination,
  weddingDate,
  accountLabel = 'Sign up or login',
  accountName,
  onAccount,
  onLogout,
}: StitchHomepageProps) {
  return (
    <div className="stitch-page">
      <header className="stitch-topbar">
        <a className="stitch-brand" href="#top" aria-label="Make My Marriage home">
          <span className="stitch-mark">✦</span>
          <span>
            <strong>MAKE MY MARRIAGE</strong>
            <small>WHERE ETERNAL LUXURY BEGINS</small>
          </span>
        </a>
        <nav className="stitch-nav" aria-label="Main navigation">
          <a href="#offerings">Signature Offerings</a>
          <a href="#itineraries">Couture Itineraries</a>
          <a href="#protocol">VIP Concierge</a>
          <a href="#scenography">Scenography</a>
          <a href="#suite">Executive Suite</a>
        </nav>
        <div className="stitch-account-actions">
          <button type="button" className="stitch-portal" onClick={onAccount} aria-label={accountLabel}>
            ◆ {accountName || 'Sign up / Login'}
          </button>
          {accountName && (
            <button type="button" className="stitch-logout" onClick={onLogout} aria-label="Logout">
              Logout
            </button>
          )}
        </div>
      </header>

      <main className="stitch-main" id="top">
        <section className="stitch-hero" id="offerings">
          <div className="stitch-hero-rule">
            <span>EST. MMXXV</span><i /><span>HAUTE COUTURE NUPTIAL SUITE</span>
          </div>
          <div className="stitch-crest" aria-hidden="true">✦</div>
          <div className="stitch-badge">WHERE ETERNAL LUXURY MEETS HAUTE COUTURE</div>
          <h1>{coupleName ? coupleName : <>Let&apos;s Plan the Wedding Together</>}</h1>
          <p className="stitch-hero-copy">
            {coupleName
              ? `${destination || 'A magnificent destination'} • ${weddingDate || 'Wedding date to be announced'}`
              : 'Bespoke celebrations, white-glove guest concierge, and couture itineraries for extraordinary love stories.'}
          </p>
          <div className="stitch-standard">
            <span>THE CELEBRATION SUITE STANDARD</span>
            <div>
              <article><b>50+ Palaces</b><small>GLOBAL PRIVATE ESTATES</small></article>
              <article><b>100% Sovereign</b><small>GUEST PRIVACY</small></article>
              <article><b>White-Glove</b><small>CONCIERGE DISPATCH</small></article>
              <article><b>Couture Atelier</b><small>ROYAL SCENOGRAPHY</small></article>
            </div>
          </div>
          <div className="stitch-ctas">
            <a className="stitch-primary" href="#itineraries">◆ &nbsp; Explore Celebration Suites</a>
            <a className="stitch-secondary" href="#rsvp">✧ &nbsp; Schedule Private Concierge</a>
          </div>
        </section>

        <section className="stitch-section" id="itineraries">
          <div className="stitch-section-head">
            <div><span className="stitch-kicker"><i /> BESPOKE JOURNEYS</span><h2>Signature Celebration Itineraries</h2></div>
          </div>
          <div className="stitch-itinerary-grid">
            {[
              ['I', '4 DAYS • PALACE UNION', 'The Royal Palace Union — Udaipur & Como', 'A grand sovereign nuptial odyssey spanning marble palaces, candlelit courtyards, and private lake estates.'],
              ['II', '3 DAYS • COTE D’AZUR', 'The Riviera Soirée & Superyacht Gala', 'Haute receptions along the cliffs, midnight yacht processions, and Michelin culinary scenography under the stars.'],
              ['III', '3 DAYS • ATOLL SANCTUARY', 'The Sovereign Private Island Sanctuary', 'Absolute seclusion on private coral atolls with sandbank ceremonies and orchestral performances at dusk.'],
            ].map(([format, detail, title, copy], index) => (
              <article className={`stitch-format-card ${index === 1 ? 'featured' : ''}`} key={title}>
                {index === 1 && <span className="stitch-featured-tag">FLAGSHIP CELEBRATION</span>}
                <div><span>FORMAT {format}</span><small>{detail}</small></div>
                <h3>{title}</h3><p>{copy}</p>
                <footer><span><small>CAPACITY</small><b>{index === 0 ? '150–400 Guests' : index === 1 ? '80–250 Luminaries' : '40–120 VIPs'}</b></span></footer>
              </article>
            ))}
          </div>
        </section>

        <section className="stitch-section" id="protocol">
          <div className="stitch-section-head">
            <div><span className="stitch-kicker"><i /> HIGH-SECURITY ARCHITECTURE</span><h2>Celebrity &amp; VIP Guest Protocol</h2></div>
            <div className="stitch-protocol-metrics"><article><b>256-Bit</b><small>ENCRYPTED</small></article><article><b>100%</b><small>NDA ENFORCED</small></article><article><b>24/7</b><small>CONCIERGE</small></article></div>
          </div>
          <div className="stitch-feature-grid">
            <article><span>✉</span><h3>Wax-Sealed Digital Passes</h3><p>Encrypted passkeys with personalized biometric verification.</p></article>
            <article><span>♨</span><h3>Dietary Concierge</h3><p>Discreet allergy, pairing, and culinary request management.</p></article>
            <article><span>⌂</span><h3>Diplomatic Seating</h3><p>Protocol-compliant placement for dynasties and honored guests.</p></article>
            <article><span>✈</span><h3>Charter Matrix</h3><p>Private jets, yacht moorings, and executive transfer coordination.</p></article>
          </div>
        </section>

        <section className="stitch-section" id="suite">
          <div className="stitch-section-head">
            <div><span className="stitch-kicker"><i /> PRODUCTION ARCHITECTURE</span><h2>The Executive Celebration Suite</h2></div>
          </div>
          <div className="stitch-suite-metrics">
            <article><small>CAPITAL MANAGEMENT</small><b>$1M–$25M+</b><span>Global escrow and audit trail</span></article>
            <article className="gold"><small>ROYAL VENDOR NETWORK</small><b>250+ Vetted</b><span>Ateliers, florists, and security</span></article>
            <article><small>DISPATCH EFFICIENCY</small><b>100% Real-Time</b><span>Air, water, and fleet integration</span></article>
          </div>
          <div className="stitch-suite-grid">
            <article><span>01</span><div><h3>Haute Couture Bridal Atelier</h3><p>Private salon consultations, bespoke sketches, and European fitting itineraries.</p></div></article>
            <article><span>02</span><div><h3>Floral Architecture &amp; Scenography</h3><p>Monumental botanical sculptures, crystal canopies, and gilded pavilions.</p></div></article>
            <article><span>03</span><div><h3>Michelin Gastronomy &amp; Cellar</h3><p>On-site masters, rare vintages, imperial caviar, and bespoke confections.</p></div></article>
            <article><span>04</span><div><h3>Private Transport Dispatch</h3><p>Helicopter, yacht, Maybach, and Rolls-Royce movement coordination.</p></div></article>
          </div>
        </section>

        <section className="stitch-section" id="scenography">
          <div className="stitch-section-head">
            <div><span className="stitch-kicker"><i /> HISTORIC ESTATES &amp; MASTERPIECES</span><h2>Iconic Palaces &amp; Couture Scenography</h2></div>
          </div>
          <div className="stitch-gallery">
            {portfolioCards.map((card) => (
              <article key={card.title}>
                <img src={card.image} alt={card.title} />
                <div><span><small>{card.eyebrow}</small><b>{card.title}</b></span><small>{card.location}</small></div>
              </article>
            ))}
          </div>
        </section>

        <section className="stitch-section stitch-rsvp" id="rsvp">
          <div className="stitch-access">
            <span className="stitch-kicker"><i /> SOVEREIGN ACCESS TERMINAL</span>
            <h2>Request Private Suite Access</h2>
            <p>Commission a bespoke celebration or validate an honored guest passkey with our private office.</p>
            <form onSubmit={(event) => event.preventDefault()}>
              <label><span>PASSKEY CIPHER</span><input required placeholder="MMM-ROYAL-2025" /></label>
              <label><span>PRINCIPAL NAME</span><input required placeholder="Title, First & Surname" /></label>
              <label><span>PRIVATE OFFICE EMAIL</span><input required type="email" placeholder="delegate@private-office.com" /></label>
              <button type="submit">Transmit to Private Concierge Office</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="stitch-footer">
        <span className="stitch-footer-mark">✦</span><strong>MAKE MY MARRIAGE</strong>
        <small>WHERE ETERNAL LUXURY BEGINS • BESPOKE NUPTIAL SUITE</small>
        <nav><a href="#offerings">Signature Suites</a><a href="#protocol">VIP Concierge</a><a href="#scenography">Palace Estates</a><a href="#rsvp">Private Consultation</a></nav>
        <small>© 2025 MAKE MY MARRIAGE. ALL PRIVILEGES RESERVED.</small>
      </footer>
    </div>
  );
}
