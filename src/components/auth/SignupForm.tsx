import { useState } from 'react';

interface SignupFormProps {
  onSignUp: (email: string, password: string) => void;
  onShowLogin: () => void;
  error?: string;
}

export const SignupForm = ({ onSignUp, onShowLogin, error }: Readonly<SignupFormProps>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (password !== confirm) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (!email.trim() || password.length < 8) return;
    onSignUp(email.trim(), password);
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {displayError ? (
        <p role="alert" className="text-sm text-expense mb-4 px-3 py-2 bg-expense/10 rounded-lg">
          {displayError}
        </p>
      ) : null}

      <div className="mb-5">
        <label htmlFor="signup-email" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full min-h-[44px] py-2.5 px-3 border border-border rounded-lg text-ink bg-transparent placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="signup-password" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          required
          className="w-full min-h-[44px] py-2.5 px-3 border border-border rounded-lg text-ink bg-transparent placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="signup-confirm" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
          Confirm Password
        </label>
        <input
          id="signup-confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat your password"
          required
          className="w-full min-h-[44px] py-2.5 px-3 border border-border rounded-lg text-ink bg-transparent placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        />
      </div>

      <button
        type="submit"
        className="w-full min-h-[44px] bg-ink text-surface font-medium rounded-lg hover:opacity-90 cursor-pointer transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1"
      >
        Create Account
      </button>

      <p className="text-sm text-muted text-center mt-5">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onShowLogin}
          className="text-ink font-medium underline underline-offset-2 cursor-pointer hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};
