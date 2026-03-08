import { useAuth } from '../context/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';

interface LoginPageProps {
  onShowSignup: () => void;
}

export const LoginPage = ({ onShowSignup }: Readonly<LoginPageProps>) => {
  const { signIn, error } = useAuth();

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Wordmark */}
        <div className="mb-10">
          <h1
            className="text-4xl text-ink mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            VistaFi
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Your personal ledger
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-8" />

        <h2 className="text-base font-semibold text-ink mb-6">Sign in to your account</h2>

        <LoginForm
          onSignIn={signIn}
          onShowSignup={onShowSignup}
          error={error?.message}
        />
      </div>
    </div>
  );
};
