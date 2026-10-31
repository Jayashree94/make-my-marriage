import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('renders the general wedding landing page and includes auth access', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getAllByText('MAKE MY MARRIAGE').length).toBeGreaterThan(0);
    expect(screen.getByText(/Let's Plan the Wedding Together/i)).toBeInTheDocument();
    expect(screen.queryByText(/Lady Genevieve Vance/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Signature Celebration Itineraries/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up or login/i })).toBeInTheDocument();
  });
});
