import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { isAdminHost, isAdminEmail } from '../lib/adminAuth';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

interface Props {
  isSignup?: boolean;
}

const AuthForm: React.FC<Props> = ({ isSignup = false }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const adminHost = isAdminHost();

  const handleAuth = async () => {
    if (adminHost && !isSignup) {
      setError('This portal requires Google sign-in. Click "Continue with Google".');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              username,
            },
          },
        });

        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      if (adminHost) {
        const user = data?.user;
        if (user) {
          const admin = await isAdminEmail(user.email);
          if (admin) {
            navigate('/');
            return;
          }
          await logout();
          setError('You do not have access to this admin portal.');
          return;
        }
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2.5 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
          <Sparkles className="h-5 w-5 text-gray-950" />
        </div>
        <span className="text-lg font-semibold text-white">Aesthify Studio</span>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8">
        <h1 className="text-xl font-bold text-white text-center mb-6">
          {isSignup ? 'Create an account' : 'Welcome back'}
        </h1>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {isSignup && (
            <>
              <input
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/20"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/20"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}

          {!adminHost && (
            <>
              <input
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/20"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/20"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}

          {isSignup && (
            <input
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/20"
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
        </div>

        {!adminHost && (
          <button
            className="mt-5 w-full rounded-xl bg-white py-3 text-sm font-semibold text-gray-950 transition hover:bg-white/90 disabled:opacity-50"
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
          </button>
        )}

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-xs text-white/25">or</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        <button
          className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-3 text-sm font-medium text-white/80 transition hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white disabled:opacity-50 flex items-center justify-center gap-2.5"
          onClick={handleGoogle}
          disabled={loading}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {!adminHost && (
          <div className="mt-5 text-center text-sm text-white/30">
            {isSignup ? (
              <>Already have an account? <Link to="/login" className="text-white/60 hover:text-white transition">Log in</Link></>
            ) : (
              <>
                Don't have an account? <Link to="/signup" className="text-white/60 hover:text-white transition">Sign up</Link>
                <div className="mt-2">
                  <Link to="/forgot-password" className="text-white/30 hover:text-white/60 transition text-xs">Forgot password?</Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
