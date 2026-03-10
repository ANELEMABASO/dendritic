// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DendriticToaster } from './components/Toast';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';

import Home        from './pages/Home';
import Marketplace from './pages/Marketplace';
import Dashboard   from './pages/Dashboard';
import Cart        from './pages/Cart';
import Orders      from './pages/Orders';

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <DendriticToaster />

          <Navbar onAuthOpen={() => setAuthOpen(true)} />

          {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

          <Routes>
            <Route path="/"            element={<Home onAuthOpen={() => setAuthOpen(true)} />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/cart"        element={<Cart />} />
            <Route path="/orders"      element={
              <ProtectedRoute><Orders /></ProtectedRoute>
            } />
            <Route path="/dashboard"   element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="*"            element={
              <div style={{ minHeight:'100vh', background:'#0D0D0D', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif", color:'#F5F0E8' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:100, fontWeight:600, color:'rgba(201,168,76,0.1)', lineHeight:1 }}>404</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:500, marginBottom:12 }}>Page Not Found</h2>
                <a href="/" style={{ color:'#C9A84C', fontSize:12, letterSpacing:'.1em', textTransform:'uppercase' }}>← Return Home</a>
              </div>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
