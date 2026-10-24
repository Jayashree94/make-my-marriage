import { EmptyState } from '../components/common/EmptyState';

export function GuestsPage() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Guests</h2>
        <button className="primary-button" type="button">Invite guest</button>
      </div>
      <EmptyState
        title="Guest management placeholder"
        description="The guest list, RSVP workflow and seating logic are not implemented in this scaffold."
      />
    </div>
  );
}
