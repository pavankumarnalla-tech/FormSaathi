import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Welcome from './pages/Welcome'
import Language from './pages/Language'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import FindForm from './pages/FindForm'
import FormInformation from './pages/FormInformation'
import FormFill from './pages/FormFill'
import UploadForm from './pages/UploadForm'
import FormAnalysis from './pages/FormAnalysis'
import DocumentsPage from './pages/DocumentsPage'
import ValidationPage from './pages/ValidationPage'
import ReviewPage from './pages/ReviewPage'
import FormComplete from './pages/FormComplete'
import NotFound from './pages/NotFound'
import MyFormsPage from './pages/MyFormsPage'
import HelpPage from './pages/HelpPage'
import AISaathiPage from './pages/AISaathiPage'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary-brand mt-5" role="status">
          <span className="visually-hidden">Loading session...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* ── Public ── */}
          <Route path="/"         element={<Welcome />} />
          <Route path="/language" element={<Language />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Core Protected ── */}
          <Route path="/dashboard" element={<P><Dashboard /></P>} />
          <Route path="/profile"   element={<P><Profile /></P>} />

          {/* ── Quick Access ── */}
          <Route path="/my-forms"  element={<P><MyFormsPage /></P>} />
          <Route path="/documents" element={<P><DocumentsPage /></P>} />
          <Route path="/help"      element={<P><HelpPage /></P>} />
          <Route path="/ai-saathi" element={<P><AISaathiPage /></P>} />

          {/* ── Find Form flow ── */}
          <Route path="/find-form" element={<P><FindForm /></P>} />
          <Route path="/form/:id"  element={<P><FormInformation /></P>} />

          {/* ── Upload flow ── */}
          <Route path="/upload-form"          element={<P><UploadForm /></P>} />
          <Route path="/form-analysis"        element={<P><FormAnalysis /></P>} />
          <Route path="/form/upload/fill"       element={<P><FormFill /></P>} />
          <Route path="/form/upload/validation" element={<P><ValidationPage /></P>} />
          <Route path="/form/upload/review"     element={<P><ReviewPage /></P>} />
          <Route path="/form/upload/complete"   element={<P><FormComplete /></P>} />

          {/* ── Find Form filling flow ── */}
          <Route path="/form/:id/fill"        element={<P><FormFill /></P>} />
          <Route path="/form/:id/validation"  element={<P><ValidationPage /></P>} />
          <Route path="/form/:id/review"      element={<P><ReviewPage /></P>} />
          <Route path="/form/:id/complete"    element={<P><FormComplete /></P>} />
          <Route path="/form/:id/explanation" element={<P><AISaathiPage /></P>} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App
