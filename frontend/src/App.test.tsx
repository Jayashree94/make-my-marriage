import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('renders the wedding invitation landing page from the reference design', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getAllByText('MAKE MY MARRIAGE').length).toBeGreaterThan(0);
    expect(screen.getByText(/Lady Genevieve Vance/i)).toBeInTheDocument();
    expect(screen.getByText(/Lord Alexander Montgomery/i)).toBeInTheDocument();
    expect(screen.getByText(/Curated Itinerary/i)).toBeInTheDocument();
  });
});
