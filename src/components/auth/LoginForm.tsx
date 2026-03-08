import { useState } from 'react';

interface LoginFormProps {
  onSignIn: (email: string, password: string) => void;
  onShowSignup: () => void;
  error?: string;
}

export const LoginForm = ({ onSignIn, onShowSignup, error }: Readonly<LoginFormProps>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 8) return;
    onSignIn(email.trim(), password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error ? (
        <p role="alert" className="text-sm text-expense mb-4 px-3 py-2 bg-expense/10 rounded-lg">
          {error}
        </p>
      ) : null}

      <div className="mb-5">
        <label htmlFor="login-email" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full min-h-[44px] py-2.5 px-3 border border-border rounded-lg text-ink bg-transparent placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="login-password" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          required
          className="w-full min-h-[44px] py-2.5 px-3 border border-border rounded-lg text-ink bg-transparent placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        />
      </div>

      <button
        type="submit"
        className="w-full min-h-[44px] bg-ink text-surface font-medium rounded-lg hover:opacity-90 cursor-pointer transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1"
      >
        Sign In
      </button>

      <p className="text-sm text-muted text-center mt-5">
        No account?{' '}
        <button
          type="button"
          onClick={onShowSignup}
          className="text-ink font-medium underline underline-offset-2 cursor-pointer hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded"
        >
          Create account
        </button>
      </p>
    </form>
  );
};
