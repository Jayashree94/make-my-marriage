const gallery = [
  { title: 'Engagement shoot', tag: 'Favorites' },
  { title: 'Venue details', tag: 'Venue' },
  { title: 'Dress fitting', tag: 'Bride' },
  { title: 'Reception mood', tag: 'Styling' },
];

export function PhotosPage() {
  return (
    <div className="page-grid">
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Gallery</p>
          <h2>Photo memories</h2>
        </div>
        <button type="button" className="primary-button">Upload gallery</button>
      </section>

      <section className="content-grid gallery-layout">
        <article className="panel full-width-panel">
          <div className="panel-header">
            <h3>Album collection</h3>
          </div>
          <div className="gallery-grid">
            {gallery.map((item) => (
              <div key={item.title} className="gallery-item">
                <div className="gallery-thumb" aria-hidden="true" />
                <div className="gallery-copy">
                  <span className="section-tag">{item.tag}</span>
                  <strong>{item.title}</strong>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
