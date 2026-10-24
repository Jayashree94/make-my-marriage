import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the dashboard route default shell', () => {
    render(<App />);
    expect(screen.getByText('Make My Marriage')).toBeInTheDocument();
    expect(screen.getByText('Planner overview')).toBeInTheDocument();
  });
});
