import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from './lib/api';
import StitchHomepage from './components/StitchHomepage';
import {
  defaultWeddingProfile,
  WeddingOnboarding,
  type WeddingProfile,
} from './components/onboarding/WeddingOnboarding';

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

type AuthMode = 'login' | 'register';

type UserSession = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

const profileStorageKey = (userId: number) =>
  `make-my-marriage-wedding-profile:${userId}`;

const parseWeddingProfile = (value: string | null): WeddingProfile | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as WeddingProfile;
  } catch {
    return null;
  }
};

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [form, setForm] = useState(emptyForm);
  const [user, setUser] = useState<UserSession | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'signin' | 'onboarding'>('home');
  const [weddingProfile, setWeddingProfile] = useState<WeddingProfile>(() => {
    return defaultWeddingProfile;
  });

  const loadAccountProfile = async (account: UserSession): Promise<WeddingProfile> => {
    const accountProfile = parseWeddingProfile(
      window.localStorage.getItem(profileStorageKey(account.id)),
    );
    let resolvedProfile = accountProfile;

    try {
      const response = await apiFetch<{ success: boolean; data?: { profileJson?: string } }>(
        '/profile/me',
      );
      if (response.data?.profileJson) {
        resolvedProfile = parseWeddingProfile(response.data.profileJson) ?? accountProfile;
      } else {
        resolvedProfile = defaultWeddingProfile;
        window.localStorage.removeItem(profileStorageKey(account.id));
      }
    } catch {
      // Account-local browser storage remains available if the backend is temporarily unavailable.
    }

    resolvedProfile ??= defaultWeddingProfile;
    window.localStorage.setItem(profileStorageKey(account.id), JSON.stringify(resolvedProfile));
    return resolvedProfile;
  };

  useEffect(() => {
    let mounted = true;

    void (async () => {
      try {
        const response = await apiFetch<{ success: boolean; data?: UserSession }>('/auth/me');
        if (!mounted || !response.data) return;

        const accountProfile = await loadAccountProfile(response.data);
        if (!mounted) return;

        setUser(response.data);
        setWeddingProfile(accountProfile);
        const complete =
          Boolean(accountProfile.brideName) &&
          Boolean(accountProfile.groomName) &&
          Boolean(accountProfile.weddingDate) &&
          accountProfile.events.length > 0 &&
          accountProfile.events.every((item) => item.name && item.date);
        setCurrentPage(complete ? 'home' : 'onboarding');
      } catch {
        if (mounted) setUser(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const hasWeddingProfile = Boolean(user && weddingProfile.brideName && weddingProfile.groomName);
  const brideDisplay = hasWeddingProfile ? weddingProfile.brideName : '';
  const groomDisplay = hasWeddingProfile ? weddingProfile.groomName : '';
  const weddingDateDisplay = weddingProfile.weddingDate
    ? new Date(`${weddingProfile.weddingDate}T00:00:00`).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
  const ceremonyItinerary = weddingProfile.events.length > 0
    ? weddingProfile.events.map((event, index) => ({
        day: `DAY ${String(index + 1).padStart(2, '0')}`,
        date: event.date
          ? new Date(`${event.date}T00:00:00`).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            }).toUpperCase()
          : 'DATE TBD',
        title: event.name,
        description: hasWeddingProfile
          ? `${event.venue || 'Venue to be confirmed'} — curated celebration for ${brideDisplay} & ${groomDisplay}.`
          : `${event.venue || 'Venue to be confirmed'} — a celebration planned with elegance and care.`,
        time: event.time || 'Time TBD',
        attire: 'Ceremony Attire',
        location: event.venue || 'Venue to be confirmed',
        featured: index === weddingProfile.events.findIndex((item) => /wedding|pheras|ceremony/i.test(item.name)),
      }))
    : itinerary;

  const handleFieldChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage('');
    setIsSubmitting(true);

    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
      const payload =
        authMode === 'login'
          ? { email: form.email, password: form.password }
          : {
              firstName: form.firstName,
              lastName: form.lastName,
              email: form.email,
              password: form.password,
            };

      const response = await apiFetch<{ success: boolean; data?: UserSession; message?: string }>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const account = response.data ?? null;

      if (!account) {
        throw new Error('No account data returned.');
      }

      setUser(account);
      setForm(emptyForm);
      setStatusMessage(
        authMode === 'login'
          ? `Welcome back, ${account.firstName}. Your private suite is ready.`
          : `Welcome, ${account.firstName}. Your account has been created.`,
      );

      const accountProfile = await loadAccountProfile(account);
      setWeddingProfile(accountProfile);

      const profileComplete =
        Boolean(accountProfile.brideName) &&
        Boolean(accountProfile.groomName) &&
        Boolean(accountProfile.weddingDate) &&
        accountProfile.events.length > 0 &&
        accountProfile.events.every((item) => item.name && item.date);

      setCurrentPage(profileComplete ? 'home' : 'onboarding');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication request failed.';
      setStatusMessage(message || 'Authentication request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore backend error; logout still updates the local guest interface.
    } finally {
      setUser(null);
      setWeddingProfile(defaultWeddingProfile);
      setStatusMessage('You have been signed out successfully.');
      setCurrentPage('home');
    }
  };

  const saveWeddingProfile = (profile: WeddingProfile, complete: boolean) => {
    setWeddingProfile(profile);
    if (user) {
      window.localStorage.setItem(profileStorageKey(user.id), JSON.stringify(profile));
      void apiFetch('/profile/me', {
        method: 'PUT',
        body: JSON.stringify({ profileJson: JSON.stringify(profile) }),
      }).catch((error) => {
        setStatusMessage(
          error instanceof Error
            ? `Saved on this device, but the server update failed: ${error.message}`
            : 'Saved on this device, but the server update failed.',
        );
      });
    } else {
      setStatusMessage('Please sign in before saving your wedding workspace.');
      setCurrentPage('signin');
      return;
    }

    if (complete) {
      setStatusMessage('Your wedding workspace is ready.');
      setCurrentPage('home');
    } else {
      setStatusMessage('Your wedding setup has been saved.');
    }
  };

  if (currentPage === 'onboarding') {
    return (
      <WeddingOnboarding
        initialProfile={weddingProfile}
        onSaveForLater={(profile) => saveWeddingProfile(profile, false)}
        onComplete={(profile) => saveWeddingProfile(profile, true)}
      />
    );
  }

  if (currentPage === 'signin') {
    return (
      <div className="auth-page-shell">
        <header className="auth-topbar">
          <div className="auth-brand-block" aria-label="Make My Marriage brand">
            <div className="brand-mark">✦</div>
            <div className="brand-copy">
              <span>MAKE MY MARRIAGE</span>
              <small>COUTURE CELEBRATIONS &amp; BESPOKE UNION SUITE</small>
            </div>
          </div>

          <nav className="auth-nav" aria-label="Public navigation">
            <a href="#">Celebration Suite</a>
            <a href="#">Concierge Protocol</a>
            <a href="#">Private Butler</a>
          </nav>

          <button type="button" className="auth-back-link" onClick={() => setCurrentPage('home')}>
            <span>↩</span>
            Back to Ceremony
          </button>
        </header>

        <main className="auth-page-main">
          <div className="auth-page-inner">
            <div className="auth-page-header">
              <div className="auth-crest-badge">
                <span>shield</span>
                <small>PRIVATE &amp; CONFIDENTIAL ACCESS</small>
              </div>
              <h1>Enter the Sanctuary of Eternal Unions</h1>
              <p>Please sign in to access your bespoke wedding celebration suite and concierge portal.</p>
            </div>

            <div className="auth-page-card">
              <div className="auth-mode-switch" aria-label="Authentication mode selector">
                <button
                  type="button"
                  className={authMode === 'login' ? 'active' : ''}
                  onClick={() => setAuthMode('login')}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className={authMode === 'register' ? 'active' : ''}
                  onClick={() => setAuthMode('register')}
                >
                  Create account
                </button>
              </div>

              <form className="auth-page-form" onSubmit={handleAuthSubmit}>
                {authMode === 'register' && (
                  <div className="auth-split-fields">
                    <label>
                      <span>First name</span>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={(event) => handleFieldChange('firstName', event.target.value)}
                        placeholder="First name"
                        required
                      />
                    </label>
                    <label>
                      <span>Last name</span>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={(event) => handleFieldChange('lastName', event.target.value)}
                        placeholder="Last name"
                        required
                      />
                    </label>
                  </div>
                )}

                <label>
                  <span>Email / Login ID</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(event) => handleFieldChange('email', event.target.value)}
                    placeholder="e.g. your email or login ID"
                    required
                  />
                </label>

                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(event) => handleFieldChange('password', event.target.value)}
                    placeholder="••••••••••••"
                    required
                  />
                </label>

                <div className="auth-page-utility">
                  <label className="remember-box">
                    <input type="checkbox" />
                    <span>Remember this Session</span>
                  </label>
                  <a href="#rsvp">Forgot Password?</a>
                </div>

                <button type="submit" className="auth-page-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Please wait...' : authMode === 'login' ? 'Log In to Celebration Suite' : 'Create Account'}
                </button>

                {statusMessage && <p className="auth-status">{statusMessage}</p>}
              </form>

              <div className="auth-divider">
                <span>✦</span>
              </div>

              <div className="auth-page-footer">
                <a href="#">Lost Cipher or Assistance?</a>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <StitchHomepage
      coupleName={hasWeddingProfile ? `${brideDisplay} & ${groomDisplay}` : undefined}
      destination={hasWeddingProfile ? weddingProfile.city : undefined}
      weddingDate={hasWeddingProfile ? weddingDateDisplay : undefined}
      accountLabel={user?.firstName ? `${user.firstName} account portal` : 'Sign up or login'}
      accountName={user?.firstName || undefined}
      onLogout={handleLogout}
      onAccount={() => {
        setAuthMode('login');
        setCurrentPage(user ? 'onboarding' : 'signin');
      }}
    />
  );

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

          <button
            type="button"
            className="portal-button"
            onClick={() => {
              setAuthMode('login');
              setCurrentPage(user ? 'onboarding' : 'signin');
            }}
            aria-label={user?.firstName ? `${user?.firstName} account portal` : 'VIP portal sign in'}
          >
            {user?.firstName ? `${user?.firstName} • Account` : 'Sign in'}
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

            <h1 className={`hero-title ${hasWeddingProfile ? '' : 'hero-tagline'}`}>
              {hasWeddingProfile ? (
                <>
                  <span>{brideDisplay}</span>
                  <span className="ampersand">&amp;</span>
                  <span>{groomDisplay}</span>
                </>
              ) : (
                <span>Let&apos;s Plan the Wedding Together</span>
              )}
            </h1>

            {hasWeddingProfile && (
              <div className="wedding-meta" aria-label="Wedding details">
                <span>{weddingProfile.city || 'Wedding Destination'}</span>
                <span className="dot">◆</span>
                <span>Wedding Celebration</span>
                <span className="dot">◆</span>
                <span>{weddingDateDisplay}</span>
              </div>
            )}

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

          <section className="auth-portal" aria-label="Authentication portal">
            <div className="auth-copy">
              <p className="eyebrow">PRIVATE ACCESS</p>
              <h2>{user?.firstName ? `Welcome back, ${user?.firstName}` : 'Enter the Sanctuary of Eternal Unions'}</h2>
              <p>
                Secure your preferred seat in the wedding vault, access the guest concierge,
                and keep every itinerary detail in one private sanctuary.
              </p>
              <ul className="auth-benefits">
                <li>Instant access to guest itinerary updates</li>
                <li>Personalized RSVP and concierge profile</li>
                <li>Private editorial gallery and event ledger</li>
              </ul>
            </div>

            <div className="auth-card">
              <div className="auth-switch" aria-label="Authentication mode selector">
                <button
                  type="button"
                  className={authMode === 'login' ? 'active' : ''}
                  onClick={() => setAuthMode('login')}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className={authMode === 'register' ? 'active' : ''}
                  onClick={() => setAuthMode('register')}
                >
                  Create account
                </button>
              </div>

              <form className="auth-form" onSubmit={handleAuthSubmit}>
                {authMode === 'register' && (
                  <div className="split-field">
                    <label>
                      <span>First name</span>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={(event) => handleFieldChange('firstName', event.target.value)}
                        placeholder="First name"
                        required
                      />
                    </label>
                    <label>
                      <span>Last name</span>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={(event) => handleFieldChange('lastName', event.target.value)}
                        placeholder="Last name"
                        required
                      />
                    </label>
                  </div>
                )}

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(event) => handleFieldChange('email', event.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(event) => handleFieldChange('password', event.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </label>

                <div className="auth-utility">
                  <span>Secure enclave</span>
                  <a href="#rsvp">Need help?</a>
                </div>

                <button type="submit" className="auth-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Please wait...' : authMode === 'login' ? 'Sign in' : 'Create account'}
                </button>

                {statusMessage && <p className="auth-status">{statusMessage}</p>}
              </form>

              {user && (
                <button type="button" className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              )}
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
              {ceremonyItinerary.map((item) => (
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
