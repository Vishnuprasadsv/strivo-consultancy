import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Ferrofluid from './Components/Ferrofluid';

// Lazy load all pages for code splitting and performance optimization
const Home = lazy(() => import('./pages/Home'));
const Aboutus = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Insight = lazy(() => import('./pages/Insight'));
const Article = lazy(() => import('./pages/Article'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const CaseStudyDetails = lazy(() => import('./pages/CaseStudyDetails'));
const Services = lazy(() => import('./pages/Services'));
const Strategic = lazy(() => import('./pages/Strategic'));
const Operations = lazy(() => import('./pages/Operations'));
const Digital = lazy(() => import('./pages/Digital'));
const Change = lazy(() => import('./pages/Change'));

// Admin Pages
const Login = lazy(() => import('./Admin/Login'));
const ForgotPassword = lazy(() => import('./Admin/ForgotPassword'));
const ResetPassword = lazy(() => import('./Admin/ResetPassword'));

// ScrollToTop component ensures navigating to a new route scrolls to the top smoothly
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// A premium loading fallback for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-transparent z-50">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" theme="dark" />
      <div className="min-h-screen bg-transparent text-white flex flex-col relative z-0">
        {/* Global Ferrofluid Background */}
        <div className="fixed inset-0 z-[-1] bg-black">
          <Ferrofluid
            colors={["#002c9b","#3673d6","#7ba0db"]}
            speed={0.1}
            scale={2.6}
            turbulence={0.65}
            fluidity={0.14}
            rimWidth={0.2}
            sharpness={3}
            shimmer={1}
            glow={1.6}
            flowDirection="up"
            opacity={1}
            mouseInteraction={true}
            mouseStrength={1}
            mouseRadius={0.3}
          />
          <div className="absolute inset-0 backdrop-blur-[6px] bg-black/40 pointer-events-none" />
        </div>
        
        <Navbar />
        
        {/* Main content area */}
        <main className="flex-grow relative z-10">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Fix: Root path now directly renders Home */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              
              <Route path="/about" element={<Aboutus />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/insights" element={<Insight />} />
              <Route path="/casestudies" element={<CaseStudies />} />
              <Route path="/case-study-details" element={<CaseStudyDetails />} />
              <Route path="/services" element={<Services />} />
              <Route path="/article/:id" element={<Article />} />
              <Route path="/strategic" element={<Strategic />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/digital" element={<Digital />} />
              <Route path="/change" element={<Change />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/reset-password" element={<ResetPassword />} />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;