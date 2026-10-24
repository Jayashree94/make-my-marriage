import { EmptyState } from '../components/common/EmptyState';

export function PhotosPage() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Photos</h2>
        <button className="primary-button" type="button">Upload gallery</button>
      </div>
      <EmptyState
        title="Photo gallery placeholder"
        description="Photo uploads and album management are intentionally deferred for the initial scaffold."
      />
    </div>
  );
}
