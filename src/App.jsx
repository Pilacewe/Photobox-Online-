import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Import Providers
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext' 

// Import Komponen Layout & Halaman
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LandingPage from './pages/LandingPage'
import PhotoboothPage from './pages/PhotoboothPage'
import TemplateSelectionPage from './pages/TemplateSelectionPage'
import PremiumCatalogPage from './pages/PremiumCatalogPage'
import CheckoutPage from './pages/CheckoutPage'
import ResultPage from './pages/ResultPage'
import AuthPage from './pages/AuthPage'
import AccountPage from './pages/AccountPage' // Import Halaman Akun Baru

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/templates" element={<TemplateSelectionPage />} />
                <Route path="/photobooth" element={<PhotoboothPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/premium" element={<PremiumCatalogPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                
                {/* Rute Halaman Akun Pengguna */}
                <Route path="/account" element={<AccountPage />} />
                
                {/* Rute Autentikasi */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<AuthPage />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App