import { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useAgeVerification } from "@/hooks/useAgeVerification";
import SplashScreen from "@/components/SplashScreen";
import AgeVerification from "@/components/AgeVerification";
import AccessDenied from "@/components/AccessDenied";
import PurchaseNotification from "@/components/PurchaseNotification";
import SpecialOfferPopup from "@/components/SpecialOfferPopup";
import FloatingOfferButton from "@/components/FloatingOfferButton";
import Home from "./pages/Home";
import VideoDetails from "./pages/VideoDetails";
import NotFound from "./pages/NotFound";

// Lazy-loaded admin pages (code splitting — admin is rarely used by visitors)
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));



const queryClient = new QueryClient();

const POPUP_SESSION_KEY = "special_offer_popup_shown";

const AppRoutes = () => {
  const location = useLocation();
  const [showOfferPopup, setShowOfferPopup] = useState(false);

  // Check if current route is admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Auto-show popup ONCE per session on non-admin routes
  useEffect(() => {
    if (!isAdminRoute) {
      const alreadyShown = sessionStorage.getItem(POPUP_SESSION_KEY) === 'true';
      if (alreadyShown) return; // Don't auto-show if already shown this session

      const timeout = setTimeout(() => {
        setShowOfferPopup(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isAdminRoute]);

  const handleClosePopup = () => {
    setShowOfferPopup(false);
    sessionStorage.setItem(POPUP_SESSION_KEY, 'true');
  };

  const handleOpenPopup = () => {
    setShowOfferPopup(true);
  };

  return (
    <>
      {!isAdminRoute && <PurchaseNotification />}
      {!isAdminRoute && showOfferPopup && <SpecialOfferPopup onClose={handleClosePopup} />}
      {!isAdminRoute && !showOfferPopup && <FloatingOfferButton onClick={handleOpenPopup} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:id" element={<VideoDetails />} />
        <Route path="/admin" element={<Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}><Admin /></Suspense>} />
        <Route path="/admin/login" element={<Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}><AdminLogin /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { isVerified, isLoading, verify, deny } = useAgeVerification();

  // If still loading verification status, show splash
  if (isLoading || showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // If user denied access
  if (isVerified === false) {
    return <AccessDenied />;
  }

  // If not verified yet, show verification modal
  if (isVerified === null) {
    return <AgeVerification onVerify={verify} onDeny={deny} />;
  }

  // User is verified, show the app
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
const App = () => {
  useEffect(() => {
    // Apply theme on mount
    const stored = localStorage.getItem('hothub-theme');
    if (stored === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // Remove floating elements with specific styles (e.g. third-party badges)
    const removeFloating = () => {
      document.querySelectorAll('[style^="position: fixed"][style*="bottom: 1rem"][style*="z-index: 2147483647"]').forEach(el => el.remove());
    };
    removeFloating();
    const observer = new MutationObserver(removeFloating);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
