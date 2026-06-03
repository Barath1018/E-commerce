import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

const Onboarding: React.FC = () => {
  const { user, setNeedsOnboarding } = useAuth();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const isGoogleUser = user.app_metadata?.provider?.includes('google');
  const hasName = !!user.user_metadata?.full_name;

  const steps = isGoogleUser || hasName
    ? [{ label: 'username', title: 'Pick your username', subtitle: 'This is how others will see you.' }]
    : [
        { label: 'name', title: "What's your name?", subtitle: 'Shown on your profile and reviews.' },
        { label: 'username', title: 'Pick your username', subtitle: 'This is how others will see you.' },
      ];

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  const validateUsername = (val: string) => /^[a-zA-Z0-9_]{3,20}$/.test(val);

  const handleNext = async () => {
    setError('');

    if (currentStep.label === 'username') {
      if (!validateUsername(username)) {
        setError('Username must be 3-20 characters, letters, numbers, and underscores only.');
        return;
      }

      setSaving(true);

      try {
        console.log('[Onboarding] Checking username availability...');
        const { data: existing, error: checkErr } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .neq('id', user.id)
          .maybeSingle();

        console.log('[Onboarding] Username check - data:', existing, 'error:', checkErr);

        if (existing) {
          setError('This username is already taken.');
          setSaving(false);
          return;
        }

        // Step 1: Update auth metadata
        console.log('[Onboarding] Updating user metadata with username:', username);
        const { data: metaResult, error: metaErr } = await supabase.auth.updateUser({
          data: { username, ...(fullName ? { full_name: fullName } : {}) },
        });
        console.log('[Onboarding] Metadata result:', metaResult?.user?.user_metadata, 'error:', metaErr);
        if (metaErr) {
          console.error('[Onboarding] Metadata update FAILED:', metaErr);
          throw metaErr;
        }

        // Step 2: Upsert profile row with username
        console.log('[Onboarding] Upserting profile with username:', username);
        const { data: upsertResult, error: profileErr } = await supabase
          .from('profiles')
          .upsert(
            { id: user.id, email: user.email ?? '', username, full_name: fullName || '' },
            { onConflict: 'id' }
          );
        console.log('[Onboarding] Upsert result:', upsertResult, 'error:', profileErr);
        if (profileErr) {
          console.error('[Onboarding] Profile upsert FAILED:', profileErr);
          throw profileErr;
        }

        // Step 3: Verify the save actually worked by reading it back
        console.log('[Onboarding] Verifying save...');
        const { data: verifyProfile, error: verifyErr } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .maybeSingle();
        console.log('[Onboarding] Verify profile:', verifyProfile, 'error:', verifyErr);

        const { data: verifyUser, error: verifyUserErr } = await supabase.auth.getUser();
        console.log('[Onboarding] Verify user metadata:', verifyUser?.user_metadata, 'error:', verifyUserErr);

        if (!verifyProfile?.username && !verifyUser?.user_metadata?.username) {
          setError('Save appeared to succeed but verification failed. Check console for details.');
          setSaving(false);
          return;
        }

        setNeedsOnboarding(false);
        sessionStorage.setItem(`onboarding_done_${user.id}`, '1');
        console.log('[Onboarding] Done!');
      } catch (err: any) {
        console.error('[Onboarding] Final error:', err);
        setError(err.message || 'Failed to save.');
        setSaving(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = async () => {
    setSaving(true);
    console.log('[Onboarding] Skip clicked');

    try {
      if (fullName) {
        console.log('[Onboarding] Saving name...');
        await supabase.auth.updateUser({ data: { full_name: fullName } });
        await supabase
          .from('profiles')
          .upsert({ id: user.id, email: user.email ?? '', full_name: fullName }, { onConflict: 'id' });
        console.log('[Onboarding] Name saved.');
      }
      setNeedsOnboarding(false);
      sessionStorage.setItem(`onboarding_done_${user.id}`, '1');
      console.log('[Onboarding] Skipped.');
    } catch (err) {
      console.error('[Onboarding] Skip error:', err);
      setNeedsOnboarding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/95 backdrop-blur-xl">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-amber-500/[0.04] blur-[150px]" />
      </div>

      <div className="w-full max-w-md px-5">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
            <Sparkles className="h-5 w-5 text-gray-950" />
          </div>
          <span className="text-lg font-semibold text-white">Aesthify Studio</span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8">
          <div className="flex gap-1.5 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition ${
                  i <= step ? 'bg-amber-400' : 'bg-white/[0.08]'
                }`}
              />
            ))}
          </div>

          <h2 className="text-xl font-bold text-white mb-1">{currentStep.title}</h2>
          <p className="text-sm text-white/35 mb-6">{currentStep.subtitle}</p>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {currentStep.label === 'name' && (
            <input
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/20"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoFocus
            />
          )}

          {currentStep.label === 'username' && (
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/25">@</span>
                <input
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-8 pr-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/20"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  autoFocus
                />
              </div>
              <p className="mt-2 text-[11px] text-white/20">3-20 characters. Letters, numbers, and underscores only.</p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step === 0 && (
              <button
                onClick={handleSkip}
                disabled={saving}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/50 transition hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white/70 disabled:opacity-50"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={saving || (currentStep.label === 'username' && !username)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-gray-950 transition hover:bg-white/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : isLast ? (
                <>
                  <Check className="h-4 w-4" /> Complete
                </>
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
