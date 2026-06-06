import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminPortal from '../pages/AdminPortal';

export default function AdminLayout() {
  const { user, loading, isAdmin, logout } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login?redirect=/admin" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/40">You do not have admin access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-indigo-500/[0.06] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-gray-950/70 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-gray-950 shadow-lg shadow-emerald-500/20">
              <span className="text-base font-bold">A</span>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-300">
                Admin Portal
              </div>
              <h1 className="text-base font-semibold tracking-tight">Aesthify Studio</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs text-white/40 hover:text-white/70 transition"
            >
              Back to Store
            </a>
            <button
              onClick={logout}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AdminPortal />
      </main>
    </div>
  );
}
