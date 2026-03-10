// src/components/AuthModal.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const G = '#C9A84C';

export default function AuthModal({ onClose }) {
  const [mode, setMode]       = useState('signin');
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ name:'', email:'', password:'' });
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const set = f => e => setForm({ ...form, [f]: e.target.value });

  const errMsg = code => ({
    'auth/user-not-found':      'Account not found.',
    'auth/wrong-password':      'Incorrect password.',
    'auth/email-already-in-use':'Email already registered.',
    'auth/weak-password':       'Password must be 6+ characters.',
    'auth/invalid-email':       'Invalid email address.',
  }[code] || 'Something went wrong. Try again.');

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(form.email, form.password);
      } else {
        if (!form.name.trim()) { toast.error('Enter your business/full name.'); setLoading(false); return; }
        await signUp(form.email, form.password, form.name);
      }
      onClose();
    } catch (err) { toast.error(errMsg(err.code)); }
    setLoading(false);
  };

  const googleSign = async () => {
    setLoading(true);
    try { await signInWithGoogle(); onClose(); }
    catch { toast.error('Google sign-in failed. Try again.'); }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(10px)' }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:28 }} transition={{ duration:0.3 }}
          style={{ background:'#141414', border:'1px solid rgba(201,168,76,0.22)', padding:'48px 44px', width:'100%', maxWidth:430, position:'relative' }}
        >
          <div style={{ position:'absolute', top:0, left:44, width:44, height:2, background:G }} />
          <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', color:'#8A8070', cursor:'pointer', fontSize:18 }}>✕</button>

          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:G, letterSpacing:'.12em', marginBottom:4 }}>Dendritic</div>
          <div style={{ fontSize:12, color:'#8A8070', marginBottom:26 }}>South Africa's Vendor Delivery Platform</div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:2, marginBottom:22 }}>
            {[['signin','Sign In'],['signup','Register']].map(([v,l]) => (
              <button key={v} onClick={() => setMode(v)}
                style={{ flex:1, padding:'8px', background: mode===v ? 'rgba(201,168,76,0.12)' : 'transparent', border: mode===v ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent', color: mode===v ? G : '#8A8070', fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all .2s' }}>
                {l}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            {mode === 'signup' && (
              <>
                <label style={lbl}>Business / Full Name</label>
                <input style={inp} placeholder="e.g. Thandi's Crafts" value={form.name} onChange={set('name')} required />
              </>
            )}
            <label style={lbl}>Email Address</label>
            <input style={inp} type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} required />
            <label style={lbl}>Password</label>
            <input style={inp} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            <button style={{ ...primaryBtn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          <div style={{ textAlign:'center', color:'#4A4035', fontSize:11, margin:'12px 0' }}>or</div>

          <button style={googleBtn} onClick={googleSign} disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const lbl = { display:'block', fontSize:10, letterSpacing:'.12em', textTransform:'uppercase', color:'#8A8070', marginBottom:6 };
const inp = { width:'100%', background:'#0D0D0D', border:'1px solid rgba(201,168,76,0.15)', padding:'12px 14px', color:'#F5F0E8', fontSize:14, outline:'none', fontFamily:"'DM Sans',sans-serif", marginBottom:14, display:'block' };
const primaryBtn = { width:'100%', padding:13, background:'#C9A84C', color:'#0D0D0D', border:'none', fontSize:12, letterSpacing:'.12em', textTransform:'uppercase', fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", marginBottom:12 };
const googleBtn = { width:'100%', padding:11, background:'transparent', border:'1px solid rgba(201,168,76,0.2)', color:'#B8A88A', fontSize:12, letterSpacing:'.08em', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:"'DM Sans',sans-serif" };
