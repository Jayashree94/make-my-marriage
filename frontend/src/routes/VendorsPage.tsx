import { EmptyState } from '../components/common/EmptyState';

export function VendorsPage() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Vendors</h2>
        <button className="primary-button" type="button">Add vendor</button>
      </div>
      <EmptyState
        title="Vendor list placeholder"
        description="Vendor management, contracts and review flows will be added in a future milestone."
      />
    </div>
  );
}
