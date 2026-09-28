import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Welcome from './pages/Welcome'
import Language from './pages/Language'
import LoginPlaceholder from './pages/LoginPlaceholder'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/language" element={<Language />} />
          <Route path="/login" element={<LoginPlaceholder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
