import { EmptyState } from '../components/common/EmptyState';

export function SettingsPage() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Settings</h2>
      </div>
      <EmptyState
        title="Settings page placeholder"
        description="Theme selection, preferences and admin configuration are not yet implemented."
      />
    </div>
  );
}
