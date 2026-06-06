import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import { Toaster } from 'react-hot-toast';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ForgotPassword from "./pages/ForgotPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import LicenseAgreement from "./pages/LicenseAgreement";
import { useProductCatalog, subscribeToProducts, unsubscribeFromProducts } from './store/catalogStore';
import Onboarding from './components/Onboarding';
import AdminLayout from './components/AdminLayout';

function StoreInit() {
  const fetchProducts = useProductCatalog((s) => s.fetchProducts);
  useEffect(() => {
    fetchProducts();
    subscribeToProducts();
    return () => unsubscribeFromProducts();
  }, [fetchProducts]);
  return null;
}

function AppContent() {
  const { needsOnboarding } = useAuth();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return <AdminLayout />;
  }

  return (
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
  );
}

function App() {
  return (
    <AuthProvider>
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
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
