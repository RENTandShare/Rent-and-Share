import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { ToastProvider } from './context/ToastContext';
import { DemoModeBanner } from './components/common/DemoModeBanner';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { AuthModal } from './components/common/AuthModal';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { AccountPage } from './pages/AccountPage';
import { RepairsPage } from './pages/RepairsPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Helper to scroll to top on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <MarketplaceProvider>
            <div className="min-h-screen flex flex-col bg-white text-[#1F1F1F]">
              {/* Demo Mode / Cloud Persistence Top Banner */}
              <DemoModeBanner />

              {/* Header with City Selector, Live Search & Category Strip */}
              <Header onOpenAuthModal={() => setIsAuthModalOpen(true)} />

              {/* Main Routed Content */}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<CatalogPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/booking-success/:id" element={<BookingSuccessPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/repairs" element={<RepairsPage />} />
                  <Route path="/owner" element={<OwnerDashboardPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              {/* Footer */}
              <Footer />

              {/* Mobile Sticky Bottom Navigation Bar */}
              <MobileNav />

              {/* Authentication Modal */}
              <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
              />
            </div>
          </MarketplaceProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
