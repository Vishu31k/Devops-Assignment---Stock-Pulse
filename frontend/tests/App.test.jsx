import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import Navbar from '../src/components/Navbar';
import * as AuthContextModule from '../src/context/AuthContext';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ symbol: 'AAPL' })
  };
});

describe('Stock Pulse App', () => {
  
  it('App renders without crashing (unauthenticated redirects to login)', () => {
    // Mock unauthenticated state
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    // Should render the main layout (Navbar is always there)
    expect(screen.getByText('Stock Pulse')).toBeInTheDocument();
  });

  it('Login page renders email and password fields', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      login: vi.fn(),
      loading: false
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('Register page renders name, email, password fields', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      register: vi.fn(),
      loading: false
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument(); // matches exactly Password
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('Navbar renders brand name "Stock Pulse"', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: false
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Stock Pulse')).toBeInTheDocument();
  });

  it('Unauthenticated user sees Login/Register links', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: false
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    // Dashboard should not be visible for unauth user
    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
  });
});
