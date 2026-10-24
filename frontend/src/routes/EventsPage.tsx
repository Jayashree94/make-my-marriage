import { EmptyState } from '../components/common/EmptyState';

export function EventsPage() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Events</h2>
        <button className="primary-button" type="button">Add event</button>
      </div>
      <EmptyState
        title="Event planning is not implemented yet"
        description="This is a placeholder view for the wedding event workspace."
      />
    </div>
  );
}
