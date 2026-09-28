import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Welcome from './pages/Welcome'
import Language from './pages/Language'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import FindForm from './pages/FindForm'
import FormInformation from './pages/FormInformation'
import FormFill from './pages/FormFill'
import UploadForm from './pages/UploadForm'
import FormAnalysis from './pages/FormAnalysis'
import DocumentsPlaceholder from './pages/DocumentsPlaceholder'
import ValidationPage from './pages/ValidationPage'
import ReviewPage from './pages/ReviewPage'
import FormComplete from './pages/FormComplete'
import NotFound from './pages/NotFound'
import MyFormsPage from './pages/MyFormsPage'
import HelpPage from './pages/HelpPage'
import PlaceholderPage from './components/PlaceholderPage'

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('formSaathi_auth') === 'true';
  return isAuth ? children : <Navigate to="/login" replace />;
};

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* ── Public ── */}
          <Route path="/"         element={<Welcome />} />
          <Route path="/language" element={<Language />} />
          <Route path="/login"    element={<Login />} />

          {/* ── Core ── */}
          <Route path="/dashboard" element={<P><Dashboard /></P>} />
          <Route path="/profile"   element={<P><Profile /></P>} />

          {/* ── Quick Access ── */}
          <Route path="/my-forms"  element={<P><MyFormsPage /></P>} />
          <Route path="/documents" element={<P><DocumentsPlaceholder /></P>} />
          <Route path="/help"      element={<P><HelpPage /></P>} />
          <Route path="/ai-saathi" element={<P><PlaceholderPage title="AI Saathi" stepNumber="7" /></P>} />

          {/* ── Find Form flow ── */}
          <Route path="/find-form" element={<P><FindForm /></P>} />
          <Route path="/form/:id"  element={<P><FormInformation /></P>} />

          {/*
            IMPORTANT: Static "upload" segment routes must come BEFORE :id routes.
            React Router matches top-down; /form/upload/fill would match /form/:id otherwise.
          */}

          {/* ── Upload flow ── */}
          <Route path="/upload-form"       element={<P><UploadForm /></P>} />
          <Route path="/form-analysis"     element={<P><FormAnalysis /></P>} />
          <Route path="/form/upload/fill"       element={<P><FormFill /></P>} />
          <Route path="/form/upload/validation" element={<P><ValidationPage /></P>} />
          <Route path="/form/upload/review"     element={<P><ReviewPage /></P>} />
          <Route path="/form/upload/complete"   element={<P><FormComplete /></P>} />

          {/* ── Find Form filling flow ── */}
          <Route path="/form/:id/fill"        element={<P><FormFill /></P>} />
          <Route path="/form/:id/validation"  element={<P><ValidationPage /></P>} />
          <Route path="/form/:id/review"      element={<P><ReviewPage /></P>} />
          <Route path="/form/:id/complete"    element={<P><FormComplete /></P>} />
          <Route path="/form/:id/explanation" element={<P><PlaceholderPage title="AI Form Explanation" stepNumber="7" /></P>} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
