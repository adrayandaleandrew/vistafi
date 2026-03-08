// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../../src/context/AuthContext';
import { supabase } from '../../../src/lib/supabase';

vi.mock('../../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

const mockUser = { id: 'user-123', email: 'test@test.com' };
const mockSession = { user: mockUser };

function TestConsumer() {
  const { user, isLoading, error, signIn, signUp, signOut } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'no-user'}</span>
      <span data-testid="loading">{isLoading ? 'loading' : 'ready'}</span>
      <span data-testid="error">{error ? error.message : 'no-error'}</span>
      <button onClick={() => signIn('a@b.com', 'pass1234')}>Sign In</button>
      <button onClick={() => signUp('a@b.com', 'pass1234')}>Sign Up</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  } as ReturnType<typeof supabase.auth.onAuthStateChange>);
});

describe('AuthProvider — initial state', () => {
  it('shows loading then resolves with no user when no session', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>);

    renderWithProvider();
    expect(screen.getByTestId('loading').textContent).toBe('loading');

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));
    expect(screen.getByTestId('user').textContent).toBe('no-user');
  });

  it('resolves with user when session exists', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as never },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>);

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('test@test.com'));
  });
});

describe('AuthProvider — signIn', () => {
  beforeEach(() => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>);
  });

  it('calls signInWithPassword with email and password', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: mockUser, session: mockSession } as never,
      error: null,
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));
    await act(async () => { await userEvent.click(screen.getByText('Sign In')); });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'pass1234',
    });
  });

  it('sets error when sign in fails', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null } as never,
      error: { message: 'Invalid login credentials' } as never,
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));
    await act(async () => { await userEvent.click(screen.getByText('Sign In')); });

    expect(screen.getByTestId('error').textContent).toBe('Invalid login credentials');
  });
});

describe('AuthProvider — signUp', () => {
  beforeEach(() => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>);
  });

  it('calls supabase.auth.signUp with email and password', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: mockUser, session: null } as never,
      error: null,
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));
    await act(async () => { await userEvent.click(screen.getByText('Sign Up')); });

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'pass1234',
    });
  });

  it('sets error when sign up fails', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null } as never,
      error: { message: 'User already registered' } as never,
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));
    await act(async () => { await userEvent.click(screen.getByText('Sign Up')); });

    expect(screen.getByTestId('error').textContent).toBe('User already registered');
  });
});

describe('AuthProvider — signOut', () => {
  beforeEach(() => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as never },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>);
  });

  it('calls supabase.auth.signOut', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('test@test.com'));
    await act(async () => { await userEvent.click(screen.getByText('Sign Out')); });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
