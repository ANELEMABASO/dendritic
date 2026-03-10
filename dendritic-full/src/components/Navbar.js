// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const G = '#C9A84C';

export default function Navbar({ onAuthOpen }) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:500,
      padding:'18px 52px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      background: scrolled ? 'rgba(13,13,13,0.97)' : 'transparent',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.1)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      transition:'all .4s',
    }}>
      <Link to="/" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:G, letterSpacing:'.12em', textDecoration:'none' }}>
        Dendritic
      </Link>

      {/* Desktop links */}
      <ul style={{ display:'flex', gap:36, listStyle:'none', alignItems:'center' }}>
        {[['/', 'Home'], ['/marketplace', 'Marketplace']].map(([to, label]) => (
          <li key={to}>
            <Link to={to} style={{ fontSize:12, letterSpacing:'.12em', textTransform:'uppercase', color: location.pathname===to ? G : '#B8A88A', textDecoration:'none', transition:'color .3s' }}>
              {label}
            </Link>
          </li>
        ))}
        {user && (
          <li>
            <Link to="/dashboard" style={{ fontSize:12, letterSpacing:'.12em', textTransform:'uppercase', color: location.pathname.startsWith('/dashboard') ? G : '#B8A88A', textDecoration:'none' }}>
              Dashboard
            </Link>
          </li>
        )}
      </ul>

      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
        {/* Cart */}
        <button onClick={() => navigate('/cart')} style={{ position:'relative', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', color:G, padding:'9px 14px', fontSize:14, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
          🛒
          {count > 0 && (
            <span style={{ position:'absolute', top:-6, right:-6, background:G, color:'#0D0D0D', borderRadius:'50%', width:18, height:18, fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {count}
            </span>
          )}
        </button>

        {user ? (
          <>
            <button onClick={() => navigate('/dashboard')} style={{ fontSize:12, letterSpacing:'.08em', padding:'9px 16px', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.25)', color:G, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
              👤 {user.displayName?.split(' ')[0] || 'Vendor'}
            </button>
            <button onClick={logout} style={{ fontSize:12, letterSpacing:'.08em', padding:'9px 14px', background:'transparent', border:'1px solid rgba(201,168,76,0.15)', color:'#8A8070', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
              Sign Out
            </button>
          </>
        ) : (
          <button onClick={onAuthOpen} style={{ fontSize:12, letterSpacing:'.1em', textTransform:'uppercase', padding:'10px 22px', border:`1px solid ${G}`, color:G, background:'transparent', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all .3s' }}
            onMouseEnter={e => { e.target.style.background=G; e.target.style.color='#0D0D0D'; }}
            onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color=G; }}>
            Vendor Login →
          </button>
        )}
      </div>
    </nav>
  );
}
