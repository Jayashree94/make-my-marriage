export type NavItem = {
  label: string;
  to: string;
};

export type StatCard = {
  label: string;
  value: string;
  trend?: string;
};

export type DashboardSummary = {
  coupleName: string;
  eventDate: string;
  month: string;
  budget: number;
  guestCount: number;
  vendorCount: number;
};

export type TableRow = {
  name: string;
  status: string;
  detail: string;
};
