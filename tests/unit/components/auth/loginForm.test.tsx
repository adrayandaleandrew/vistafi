// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../../../../src/components/auth/LoginForm';

const noop = vi.fn();

describe('LoginForm — rendering', () => {
  it('renders email and password inputs', () => {
    render(<LoginForm onSignIn={noop} onShowSignup={noop} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    render(<LoginForm onSignIn={noop} onShowSignup={noop} />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders create account link', () => {
    render(<LoginForm onSignIn={noop} onShowSignup={noop} />);
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows error message when error prop provided', () => {
    render(<LoginForm onSignIn={noop} onShowSignup={noop} error="Incorrect email or password." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Incorrect email or password.');
  });

  it('does not show error when error prop is absent', () => {
    render(<LoginForm onSignIn={noop} onShowSignup={noop} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('LoginForm — submission', () => {
  it('calls onSignIn with email and password on valid submit', async () => {
    const onSignIn = vi.fn();
    render(<LoginForm onSignIn={onSignIn} onShowSignup={noop} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'user@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(onSignIn).toHaveBeenCalledWith('user@test.com', 'password123');
  });

  it('does not call onSignIn when email is empty', async () => {
    const onSignIn = vi.fn();
    render(<LoginForm onSignIn={onSignIn} onShowSignup={noop} />);

    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(onSignIn).not.toHaveBeenCalled();
  });

  it('does not call onSignIn when password is shorter than 8 chars', async () => {
    const onSignIn = vi.fn();
    render(<LoginForm onSignIn={onSignIn} onShowSignup={noop} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'user@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'short');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(onSignIn).not.toHaveBeenCalled();
  });

  it('calls onShowSignup when create account is clicked', async () => {
    const onShowSignup = vi.fn();
    render(<LoginForm onSignIn={noop} onShowSignup={onShowSignup} />);
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(onShowSignup).toHaveBeenCalled();
  });
});
