// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupForm } from '../../../../src/components/auth/SignupForm';

const noop = vi.fn();

describe('SignupForm — rendering', () => {
  it('renders email, password, and confirm password inputs', () => {
    render(<SignupForm onSignUp={noop} onShowLogin={noop} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('renders create account button', () => {
    render(<SignupForm onSignUp={noop} onShowLogin={noop} />);
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('renders sign in link', () => {
    render(<SignupForm onSignUp={noop} onShowLogin={noop} />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error message when error prop provided', () => {
    render(<SignupForm onSignUp={noop} onShowLogin={noop} error="An account with this email already exists." />);
    expect(screen.getByRole('alert')).toHaveTextContent('An account with this email already exists.');
  });
});

describe('SignupForm — submission', () => {
  it('calls onSignUp with email and password on valid submit', async () => {
    const onSignUp = vi.fn();
    render(<SignupForm onSignUp={onSignUp} onShowLogin={noop} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'new@test.com');
    await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(onSignUp).toHaveBeenCalledWith('new@test.com', 'password123');
  });

  it('does not call onSignUp when passwords do not match', async () => {
    const onSignUp = vi.fn();
    render(<SignupForm onSignUp={onSignUp} onShowLogin={noop} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'new@test.com');
    await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'different1');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(onSignUp).not.toHaveBeenCalled();
  });

  it('shows passwords-do-not-match validation error', async () => {
    render(<SignupForm onSignUp={noop} onShowLogin={noop} />);

    await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'different1');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/passwords do not match/i);
  });

  it('does not call onSignUp when password is shorter than 8 chars', async () => {
    const onSignUp = vi.fn();
    render(<SignupForm onSignUp={onSignUp} onShowLogin={noop} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'new@test.com');
    await userEvent.type(screen.getByLabelText(/^password/i), 'short');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'short');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(onSignUp).not.toHaveBeenCalled();
  });

  it('calls onShowLogin when sign in link is clicked', async () => {
    const onShowLogin = vi.fn();
    render(<SignupForm onSignUp={noop} onShowLogin={onShowLogin} />);
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(onShowLogin).toHaveBeenCalled();
  });
});
