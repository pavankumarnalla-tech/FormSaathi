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
import ValidationPlaceholder from './pages/ValidationPlaceholder'
import NotFound from './pages/NotFound'
import PlaceholderPage from './components/PlaceholderPage'

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('formSaathi_auth') === 'true';
  return isAuth ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Welcome />} />
          <Route path="/language" element={<Language />} />
          <Route path="/login" element={<Login />} />

          {/* Core protected */}
          <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Quick Access */}
          <Route path="/my-forms"   element={<ProtectedRoute><PlaceholderPage title="My Forms" stepNumber="8" /></ProtectedRoute>} />
          <Route path="/documents"  element={<ProtectedRoute><DocumentsPlaceholder /></ProtectedRoute>} />
          <Route path="/help"       element={<ProtectedRoute><PlaceholderPage title="Help & Support" stepNumber="9" /></ProtectedRoute>} />
          <Route path="/ai-saathi"  element={<ProtectedRoute><PlaceholderPage title="AI Saathi" stepNumber="7" /></ProtectedRoute>} />

          {/* Find Form flow */}
          <Route path="/find-form"  element={<ProtectedRoute><FindForm /></ProtectedRoute>} />
          <Route path="/form/:id"   element={<ProtectedRoute><FormInformation /></ProtectedRoute>} />

          {/* Step 6+7 — Form Filling (Find Form flow):  /form/:id/fill */}
          <Route path="/form/:id/fill"        element={<ProtectedRoute><FormFill /></ProtectedRoute>} />
          {/* Step 6+7 — Form Filling (Upload flow): /form/upload/fill */}
          <Route path="/form/upload/fill"     element={<ProtectedRoute><FormFill /></ProtectedRoute>} />
          {/* Step 8 placeholder */}
          <Route path="/form/:id/validation"  element={<ProtectedRoute><ValidationPlaceholder /></ProtectedRoute>} />
          {/* AI explanation placeholder (Step 7+) */}
          <Route path="/form/:id/explanation" element={<ProtectedRoute><PlaceholderPage title="AI Form Explanation" stepNumber="7" /></ProtectedRoute>} />

          {/* Upload Form flow */}
          <Route path="/upload-form"          element={<ProtectedRoute><UploadForm /></ProtectedRoute>} />
          <Route path="/form-analysis"        element={<ProtectedRoute><FormAnalysis /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
