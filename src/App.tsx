import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import AdminPortal from './pages/AdminPortal';
import OrderHistory from './pages/OrderHistory';
import { Toaster } from 'react-hot-toast';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./pages/ForgotPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import LicenseAgreement from "./pages/LicenseAgreement";
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { isAdminHost } from './lib/adminAuth';
import { useProductCatalog, subscribeToProducts, unsubscribeFromProducts } from './store/catalogStore';
import Onboarding from './components/Onboarding';

function StoreInit() {
  const fetchProducts = useProductCatalog((s) => s.fetchProducts);
  useEffect(() => {
    fetchProducts();
    subscribeToProducts();
    return () => unsubscribeFromProducts();
  }, [fetchProducts]);
  return null;
}

function AppRoutes() {
  const { isAdmin, logout, needsOnboarding } = useAuth();
  const adminHost = isAdminHost();

  if (adminHost) {
    return (
      <Router>
        <StoreInit />
        <Toaster
          toastOptions={{
            style: {
              background: '#0b0f14',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.08)',
            },
          }}
        />
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
              {isAdmin && (
                <button
                  onClick={logout}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={isAdmin ? <AdminPortal /> : <Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <StoreInit />
      <Toaster
        toastOptions={{
          style: {
            background: '#0b0f14',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
          },
        }}
      />
      <div className="min-h-screen bg-gray-950 text-white">
        {needsOnboarding && <Onboarding />}
        <Navbar />
        <main className="mx-auto max-w-7xl px-5 py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<Account />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/license" element={<LicenseAgreement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
