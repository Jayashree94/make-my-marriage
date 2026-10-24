import { EmptyState } from '../components/common/EmptyState';

export function ExpensesPage() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Expenses</h2>
        <button className="primary-button" type="button">Add expense</button>
      </div>
      <EmptyState
        title="Expense tracking placeholder"
        description="Budgeting, categories and payment approvals are intentionally not yet implemented."
      />
    </div>
  );
}
