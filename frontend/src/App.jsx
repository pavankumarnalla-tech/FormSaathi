import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Welcome from './pages/Welcome'
import Language from './pages/Language'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import PlaceholderPage from './components/PlaceholderPage'

// Simple frontend-only protected route wrapper
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
          <Route path="/" element={<Welcome />} />
          <Route path="/language" element={<Language />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Placeholder Routes */}
          <Route 
            path="/find-form" 
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Find a Form" stepNumber="4" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload-form" 
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Upload a Form" stepNumber="5" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-saathi" 
            element={
              <ProtectedRoute>
                <PlaceholderPage title="AI Saathi" stepNumber="7" />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
