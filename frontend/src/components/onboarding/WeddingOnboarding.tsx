import { FormEvent, useState } from 'react';

export type WeddingEvent = {
  id: number;
  name: string;
  date: string;
  time: string;
  venue: string;
};

export type WeddingProfile = {
  brideName: string;
  groomName: string;
  weddingDate: string;
  city: string;
  partnerEmail: string;
  theme: string;
  events: WeddingEvent[];
};

export const defaultWeddingProfile: WeddingProfile = {
  brideName: '',
  groomName: '',
  weddingDate: '',
  city: '',
  partnerEmail: '',
  theme: 'Traditional Gold',
  events: [],
};

type Props = {
  initialProfile: WeddingProfile;
  onSaveForLater: (profile: WeddingProfile) => void;
  onComplete: (profile: WeddingProfile) => void;
};

const themes = [
  { name: 'Traditional Gold', colors: ['#5B1E31', '#C5A059', '#FAF7F2'] },
  { name: 'Pastel Floral', colors: ['#E8C5C8', '#B8C5B9', '#FDFCFA'] },
  { name: 'Royal Elegance', colors: ['#1B2A4A', '#1E4D38', '#D4AF37'] },
];

export function WeddingOnboarding({ initialProfile, onSaveForLater, onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<WeddingProfile>(() => ({
    ...initialProfile,
    brideName: initialProfile.brideName || '',
    groomName: initialProfile.groomName || '',
    weddingDate: initialProfile.weddingDate || '',
    city: initialProfile.city || '',
    partnerEmail: initialProfile.partnerEmail || '',
    events:
      initialProfile.events.length > 0
        ? initialProfile.events
        : [
            { id: 1, name: 'Mehndi Ceremony', date: '', time: '04:00 PM', venue: 'Haveli Courtyard' },
            { id: 2, name: 'Sangeet & Cocktail Night', date: '', time: '07:30 PM', venue: 'The Grand Ballroom' },
            { id: 3, name: 'Wedding Ceremony (Pheras)', date: '', time: '11:00 AM', venue: 'Mandap by the Lake' },
            { id: 4, name: 'Gala Reception', date: '', time: '08:00 PM', venue: 'Palace Gardens' },
          ],
  }));

  const update = <K extends keyof WeddingProfile>(key: K, value: WeddingProfile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const updateEvent = (id: number, key: keyof WeddingEvent, value: string | number) => {
    setProfile((current) => ({
      ...current,
      events: current.events.map((event) => (event.id === id ? { ...event, [key]: value } : event)),
    }));
  };

  const addEvent = () => {
    setProfile((current) => ({
      ...current,
      events: [
        ...current.events,
        { id: Date.now(), name: '', date: current.weddingDate, time: '', venue: '' },
      ],
    }));
  };

  const detailsSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (profile.events.length > 0 && !profile.events[0].date) {
      setProfile((current) => ({
        ...current,
        events: current.events.map((item, index) => ({
          ...item,
          date: item.date || current.weddingDate || '',
        })),
      }));
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const monogram =
    `${profile.brideName.trim().charAt(0)}${profile.groomName.trim().charAt(0)}`.toUpperCase() || 'B&G';

  const complete = () => {
    if (!profile.events.every((item) => item.name.trim() && item.date)) return;
    onComplete(profile);
  };

  const canComplete =
    profile.brideName.trim().length > 0 &&
    profile.groomName.trim().length > 0 &&
    profile.weddingDate.length > 0 &&
    profile.events.length > 0 &&
    profile.events.every((item) => item.name.trim().length > 0 && item.date.length > 0);

  return (
    <div className="onboarding-shell">
      <header className="onboarding-header">
        <div className="onboarding-brand">
          <span className="onboarding-mark">✦</span>
          <div>
            <strong>Make My Marriage</strong>
            <small>Celebration Suite</small>
          </div>
        </div>
        <button type="button" className="save-later" onClick={() => onSaveForLater(profile)}>
          Save &amp; finish later <span>→</span>
        </button>
      </header>

      <main className="onboarding-main">
        <div className="onboarding-stepper" aria-label={`Step ${step} of 2`}>
          <div className={`step-item ${step === 1 ? 'active' : 'complete'}`}>
            <span>{step === 1 ? '01' : '✓'}</span>
            <div><strong>1. Wedding details</strong><small>Couple &amp; Theme</small></div>
          </div>
          <div className={`step-item ${step === 2 ? 'active' : ''}`}>
            <span>02</span>
            <div><strong>2. Add events</strong><small>Timeline &amp; Venues</small></div>
          </div>
        </div>

        <div className="onboarding-grid">
          <section className="onboarding-form-card">
            {step === 1 ? (
              <>
                <div className="onboarding-title">
                  <span>♥ FOUNDATIONS &amp; STYLE</span>
                  <h1>Let&apos;s set up your wedding</h1>
                  <p>Start with the essentials. You can refine these details anytime.</p>
                </div>
                <form onSubmit={detailsSubmit} className="onboarding-form">
                  <div className="form-grid">
                    <label><span>Bride&apos;s name *</span><input required value={profile.brideName} onChange={(e) => update('brideName', e.target.value)} placeholder="e.g., Ananya Sharma" /></label>
                    <label><span>Groom&apos;s name *</span><input required value={profile.groomName} onChange={(e) => update('groomName', e.target.value)} placeholder="e.g., Rohan Kapoor" /></label>
                    <label><span>Wedding date *</span><input required type="date" value={profile.weddingDate} onChange={(e) => update('weddingDate', e.target.value)} /></label>
                    <label><span>City / Destination</span><input value={profile.city} onChange={(e) => update('city', e.target.value)} placeholder="e.g., Jaipur / Udaipur" /></label>
                  </div>
                  <label className="partner-field">
                    <span>Partner&apos;s email <small>(Optional)</small></span>
                    <input type="email" value={profile.partnerEmail} onChange={(e) => update('partnerEmail', e.target.value)} placeholder="partner@example.com" />
                    <small>We&apos;ll invite them as a co-admin to curate events and guest lists.</small>
                  </label>

                  <fieldset>
                    <legend>Select Wedding Theme Palette</legend>
                    <div className="theme-grid">
                      {themes.map((theme) => (
                        <button type="button" key={theme.name} className={profile.theme === theme.name ? 'selected' : ''} onClick={() => update('theme', theme.name)}>
                          <strong>{theme.name}</strong>
                          <span className="theme-colors">{theme.colors.map((color) => <i key={color} style={{ backgroundColor: color }} />)}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="form-actions"><button className="primary-action" type="submit">Continue to events <span>→</span></button></div>
                </form>
              </>
            ) : (
              <>
                <div className="onboarding-title">
                  <span>YOUR CELEBRATION TIMELINE</span>
                  <h1>Add your wedding events</h1>
                  <p>Shape the ceremonies, gatherings, and celebrations your guests will attend.</p>
                </div>
                <div className="events-list">
                  {profile.events.map((item, index) => (
                    <div className="event-editor" key={item.id}>
                      <div className="event-editor-head">
                        <strong>#{index + 1} Event Ceremony</strong>
                        <button type="button" onClick={() => update('events', profile.events.filter((event) => event.id !== item.id))}>Remove</button>
                      </div>
                      <div className="event-grid">
                        <label><span>Ceremony name *</span><input required value={item.name} onChange={(e) => updateEvent(item.id, 'name', e.target.value)} placeholder="e.g. Sangeet" /></label>
                        <label><span>Ceremony date *</span><input required type="date" value={item.date} onChange={(e) => updateEvent(item.id, 'date', e.target.value)} /></label>
                        <label><span>Start time</span><input value={item.time} onChange={(e) => updateEvent(item.id, 'time', e.target.value)} placeholder="e.g. 07:00 PM" /></label>
                        <label><span>Venue / location</span><input value={item.venue} onChange={(e) => updateEvent(item.id, 'venue', e.target.value)} placeholder="e.g. The Palace Lawn" /></label>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" className="add-event" onClick={addEvent}>＋ Add another event</button>
                <div className="form-actions split-actions">
                  <button type="button" className="secondary-action" onClick={() => setStep(1)}>← Back to details</button>
                  <button type="button" className="primary-action" onClick={complete} disabled={!canComplete}>Create wedding workspace <span>→</span></button>
                </div>
              </>
            )}
          </section>

          <aside className="onboarding-preview">
            <div className="preview-card">
              <span>Celebration Invitation</span>
              <strong>Your Wedding Crest</strong>
              <div className="preview-monogram">{monogram || 'B&G'}</div>
              <h2>{profile.brideName || 'Bride'} &amp; {profile.groomName || 'Groom'}</h2>
              <p>{profile.weddingDate ? new Date(`${profile.weddingDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Wedding date'} • {profile.city || 'Destination'}</p>
              <small>{profile.events.length} Celebrations</small>
              <em>{profile.theme}</em>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
