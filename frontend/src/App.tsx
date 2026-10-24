import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './routes/DashboardPage';
import { EventsPage } from './routes/EventsPage';
import { ExpensesPage } from './routes/ExpensesPage';
import { GuestsPage } from './routes/GuestsPage';
import { PhotosPage } from './routes/PhotosPage';
import { SettingsPage } from './routes/SettingsPage';
import { VendorsPage } from './routes/VendorsPage';

const navigation = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Events', to: '/events' },
  { label: 'Guests', to: '/guests' },
  { label: 'Expenses', to: '/expenses' },
  { label: 'Vendors', to: '/vendors' },
  { label: 'Photos', to: '/photos' },
  { label: 'Settings', to: '/settings' },
];

function App() {
  return (
    <AppLayout
      brand="Make My Marriage"
      navItems={navigation.map((item) => ({
        ...item,
        component: ({ isActive }) => (
          <NavLink to={item.to} className={({ isActive: linkActive }) => `nav-link ${linkActive || isActive ? 'active' : ''}`}>
            {item.label}
          </NavLink>
        ),
      }))}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/guests" element={<GuestsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
