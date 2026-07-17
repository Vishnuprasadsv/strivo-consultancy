import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import axios from 'axios';
import Navbar from './Components/Navbar';
import AdminNavbar from './Components/AdminNavbar';
import Footer from './Components/Footer';
import Ready from './Components/Ready';
import LoadingIndicator from './Components/LoadingIndicator';

import Review from './pages/Review';
import Career from './pages/Career';
import CareerAdmin from './Admin/Admincareers';

import ArticlesAdmin from './Admin/ArticlesAdmin';

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
const Mission = lazy(() => import('./pages/Mission'));
const Vision = lazy(() => import('./pages/Vision'));
const Values = lazy(() => import('./pages/Values'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));

// Admin Pages
const Login = lazy(() => import('./Admin/Login'));
const Register = lazy(() => import('./Admin/Register'));
const ForgotPassword = lazy(() => import('./Admin/ForgotPassword'));
const ResetPassword = lazy(() => import('./Admin/ResetPassword'));
const Dashboard = lazy(() => import('./Admin/Dashboard'));
const Inquiries = lazy(() => import('./Admin/Inquiries'));
const CaseStudiesAdmin = lazy(() => import('./Admin/CaseStudies'));
const CreateCaseStudy = lazy(() => import('./Admin/CreateCaseStudy'));
const EditCaseStudy = lazy(() => import('./Admin/EditCaseStudy'));
const CreateArticle = lazy(() => import('./Admin/CreateArticle'));
const EditArticle = lazy(() => import('./Admin/EditArticle'));
const CreateJob = lazy(() => import('./Admin/CreateJob'));
const EditJob = lazy(() => import('./Admin/EditJob'));
const Profile = lazy(() => import('./Admin/Profile'));
const InterviewsAdmin = lazy(() => import('./Admin/InterviewsAdmin'));
const AppointmentsAdmin = lazy(() => import('./Admin/AppointmentsAdmin'));
const TalentPoolAdmin = lazy(() => import('./Admin/TalentPoolAdmin'));
const clientTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-primary)',
  },
});

const adminTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-primary)',
  },
});

const DynamicThemeProvider = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <ThemeProvider theme={isAdmin ? adminTheme : clientTheme}>
      {children}
    </ThemeProvider>
  );
};

// Configure global Axios settings to auto-attach authorization header & allow credentials cookies
axios.interceptors.request.use(
  (config) => {
    // Only attach tokens and credentials for our own API, not external ones like Cloudinary
    if (config.url && !config.url.includes('cloudinary.com')) {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      config.withCredentials = true;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ProtectedRoute component handles role authorization and user session validation
const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('adminToken');
  const userStr = localStorage.getItem('adminUser');

  if (!token || !userStr) {
    return <Navigate to="/admin/login" replace />;
  }

  const user = JSON.parse(userStr);
  const userRole = user.role ? user.role.toLowerCase() : '';

  // Check if role is allowed
  const isAllowed = allowedRoles.some(role => {
    const r = role.toLowerCase();
    if (r === 'admin' && (userRole === 'admin' || userRole === 'administrator')) return true;
    if (r === 'administrator' && (userRole === 'admin' || userRole === 'administrator')) return true;
    return r === userRole;
  });

  if (!isAllowed) {
    // If not allowed, redirect to respective role's default dashboard/page
    if (userRole === 'hr') {
      return <Navigate to="/admin/career" replace />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <Outlet />;
};

// ScrollToTop component ensures navigating to a new route scrolls to the top smoothly
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// Conditionally render Navbar based on route
const ConditionalNavbar = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return <Navbar />;
};

// Conditionally render Footer based on route
const ConditionalFooter = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return (
    <>
      <Ready />
      <Footer />
    </>
  );
};



const AppLayout = () => {
  const { pathname } = useLocation();
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-[var(--color-main-bg)] text-[var(--color-pure-black)] flex flex-col relative z-0`}>
      <ConditionalNavbar />
      <AdminNavbar />

      {/* Main content area */}
      <main className="flex-grow relative z-10">
        <Suspense fallback={<LoadingIndicator />}>
          <Routes>
            {/* Fix: Root path now directly renders Home */}
            <Route path="/" element={<Home />} />

            <Route path="/about" element={<Aboutus />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/insights" element={<Insight />} />
            <Route path="/casestudies" element={<CaseStudies />} />
            <Route path="/case-study-details/:id" element={<CaseStudyDetails />} />
            <Route path="/services" element={<Services />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/strategic" element={<Strategic />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/digital" element={<Digital />} />
            <Route path="/change" element={<Change />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/values/:valueType" element={<Values />} />
            <Route path="/careerstrivo" element={<Career />} />
            <Route
              path="/privacy-policy"
              element={<PrivacyPolicy />}
            />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/review" element={<Review />} />

            {/* Admin Public Auth Routes */}
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />

            {/* Admin & HR Common Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin', 'Administrator', 'Hr']} />}>
              <Route path="/admin/profile" element={<Profile />} />
              <Route path="/admin/career" element={<CareerAdmin />} />
              <Route path="/admin/interviews" element={<InterviewsAdmin />} />
              <Route path="/admin/appointments" element={<AppointmentsAdmin />} />
              <Route path="/admin/talent-pool" element={<TalentPoolAdmin />} />
              <Route path="/admin/create-job" element={<CreateJob />} />
              <Route path="/admin/edit-job/:id" element={<EditJob />} />
            </Route>

            {/* Admin-Only Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin', 'Administrator']} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/inquiries" element={<Inquiries />} />
              <Route path="/admin/casestudies" element={<CaseStudiesAdmin />} />
              <Route path="/admin/create-case-study" element={<CreateCaseStudy />} />
              <Route path="/admin/edit-case-study/:id" element={<EditCaseStudy />} />
              <Route path="/admin/article" element={<ArticlesAdmin />} />
              <Route path="/admin/create-article" element={<CreateArticle />} />
              <Route path="/admin/edit-article/:id" element={<EditArticle />} />
            </Route>
          </Routes>
        </Suspense>
      </main>

      <ConditionalFooter />

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            whileHover={{ scale: 1.1, translateY: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-colors duration-200"
            aria-label="Scroll to top"
          >
            <FiArrowUp size={20} className="stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <DynamicThemeProvider>
        <ScrollToTop />
       <Toaster position="top-center" theme="dark" />
        <AppLayout />
      </DynamicThemeProvider>
    </BrowserRouter>
  );
};

export default App;