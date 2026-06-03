import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import { Sparkles } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) throw resetError;
      setMessage("Password reset email sent. Please check your inbox.");
      setError(null);
    } catch (err: any) {
      setError("Failed to send password reset email. Please try again.");
      setMessage(null);
    }
  };

  return (
    <div className="py-16">
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
          <h2 className="text-xl font-bold text-white text-center mb-2">Forgot password?</h2>
          <p className="text-sm text-white/30 text-center mb-6">
            Enter your email and we'll send you a reset link.
          </p>

          {message && (
            <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-sm text-emerald-400">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/20"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-gray-950 transition hover:bg-white/90"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-white/30">
            <Link to="/login" className="text-white/60 hover:text-white transition">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
