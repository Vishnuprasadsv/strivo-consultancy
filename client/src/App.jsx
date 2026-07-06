import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Toaster } from 'sonner';
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
const Profile = lazy(() => import('./Admin/Profile'));
const clientTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-poppins)',
  },
});

const adminTheme = createTheme();

const DynamicThemeProvider = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <ThemeProvider theme={isAdmin ? adminTheme : clientTheme}>
      {children}
    </ThemeProvider>
  );
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

                {/* Admin Routes */}
                <Route path="/admin" element={<Login />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/register" element={<Register />} />
                <Route path="/admin/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin/reset-password" element={<ResetPassword />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/inquiries" element={<Inquiries />} />
                <Route path="/admin/casestudies" element={<CaseStudiesAdmin />} />
                <Route path='/admin/career' element={<CareerAdmin />} />
                <Route path='/admin/article' element={<ArticlesAdmin />} />
                <Route
                  path="/admin/create-case-study"
                  element={<CreateCaseStudy />}
                />
                <Route
                  path="/admin/edit-case-study/:id"
                  element={<EditCaseStudy />}
                />
                <Route path="/admin/article" element={<ArticlesAdmin />} />
                <Route path="/admin/career" element={<CareerAdmin />} />
                <Route path="/admin/profile" element={<Profile />} />
              </Routes>
            </Suspense>
      </main>

      <ConditionalFooter />


    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <DynamicThemeProvider>
        <ScrollToTop />
        <Toaster position="top-right" theme="dark" />
        <AppLayout />
      </DynamicThemeProvider>
    </BrowserRouter>
  );
};

export default App;