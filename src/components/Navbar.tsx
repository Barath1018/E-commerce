import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const { cart, wishlist } = useStore();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl flex items-center justify-between h-16 px-5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 transition group-hover:shadow-amber-500/40">
            <Sparkles className="h-4 w-4 text-gray-950" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">
            Aesthify Studio
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-sm text-white/50 hover:text-white transition">
            Products
          </Link>

          <div className="flex items-center gap-4 text-white/40">
            <Link to="/cart" className="relative hover:text-white transition">
              <ShoppingCart className="h-4.5 w-4.5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 h-4 min-w-[16px] rounded-full bg-amber-500 text-[9px] font-bold text-gray-950 flex items-center justify-center px-1">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link to="/wishlist" className="relative hover:text-white transition">
              <Heart className="h-4.5 w-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 h-4 min-w-[16px] rounded-full bg-amber-500 text-[9px] font-bold text-gray-950 flex items-center justify-center px-1">
                  {wishlist.length}
                </span>
              )}
            </Link>
            {user && (
              <Link to="/order-history" className="text-sm text-white/50 hover:text-white transition">
                Orders
              </Link>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-sm text-white/70 transition hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
              >
                <User className="h-3.5 w-3.5" />
                Account
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/[0.08] bg-gray-900/95 backdrop-blur-xl py-1 shadow-2xl shadow-black/50 z-50">
                  <div className="px-3 py-2 text-xs text-white/30 truncate border-b border-white/[0.06]">{user.email}</div>
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-3 py-2 text-sm text-white/60 hover:bg-white/[0.05] hover:text-white transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setIsProfileOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-white/60 hover:bg-white/[0.05] hover:text-white transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-white/50 hover:text-white transition">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-white text-gray-950 px-4 py-1.5 text-sm font-medium transition hover:bg-white/90"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white/60 hover:text-white transition">
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-gray-950/95 backdrop-blur-xl px-5 py-4 space-y-1">
          <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block text-sm text-white/60 hover:text-white py-2 transition">Products</Link>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block text-sm text-white/60 hover:text-white py-2 transition">Cart ({cart.length})</Link>
          <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="block text-sm text-white/60 hover:text-white py-2 transition">Wishlist ({wishlist.length})</Link>
          {user && <Link to="/order-history" onClick={() => setIsMenuOpen(false)} className="block text-sm text-white/60 hover:text-white py-2 transition">Orders</Link>}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block text-sm text-white/60 hover:text-white py-2 transition">Profile</Link>
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block text-sm text-white/60 hover:text-white py-2 transition">Logout</button>
            </>
          ) : (
            <div className="flex gap-4 pt-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-sm text-white/60 hover:text-white transition">Sign in</Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-sm text-white/60 hover:text-white transition">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
