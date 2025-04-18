import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const { cart, wishlist } = useStore();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">Aesthify Studio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>

            <Link to="/cart" className="text-gray-600 hover:text-gray-900 relative">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            <Link to="/wishlist" className="text-gray-600 hover:text-gray-900 relative">
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* 👇 NEW: Order History link */}
            {user && (
              <Link to="/order-history" className="text-gray-600 hover:text-gray-900">
                Order History
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <User className="w-6 h-6" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-md z-50 min-w-[150px]">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/products" className="text-gray-600 hover:text-gray-900">
                Products
              </Link>
              <Link to="/cart" className="text-gray-600 hover:text-gray-900">
                Cart ({cart.length})
              </Link>
              <Link to="/wishlist" className="text-gray-600 hover:text-gray-900">
                Wishlist ({wishlist.length})
              </Link>

              {/* 👇 NEW: Mobile Order History link */}
              {user && (
                <Link
                  to="/order-history"
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Order History
                </Link>
              )}

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-gray-900 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}