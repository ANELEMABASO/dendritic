// src/pages/Cart.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../firebase/db';
import { notify } from '../components/Toast';
import toast from 'react-hot-toast';

const G = '#C9A84C';

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, total, delivery } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const placeOrder = async () => {
    if (!user) { toast.error('Please sign in to place an order.'); return; }
    if (items.length === 0) return;

    try {
      // Group by vendor and create one order per vendor
      const byVendor = items.reduce((acc, item) => {
        if (!acc[item.vendorId]) acc[item.vendorId] = [];
        acc[item.vendorId].push(item);
        return acc;
      }, {});

      for (const [vendorId, vendorItems] of Object.entries(byVendor)) {
        const orderTotal = vendorItems.reduce((s, i) => s + i.price * i.qty, 0);
        const order = await createOrder({
          vendorId,
          customerId: user.uid,
          customerName: user.displayName || user.email,
          products: vendorItems,
          total: orderTotal,
          deliveryAddress: { province: 'To be confirmed', city: '', street: '' },
        });
        notify.orderPlaced(order.id.slice(-6).toUpperCase());
      }
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error(err);
      notify.error('Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight:'100vh', background:'#0D0D0D', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif", color:'#F5F0E8', paddingTop:80 }}>
        <div style={{ fontSize:64, marginBottom:20 }}>🛒</div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:500, marginBottom:12 }}>Your cart is empty</h2>
        <p style={{ color:'#8A8070', marginBottom:32 }}>Browse our marketplace to find great SA products.</p>
        <Link to="/marketplace" style={{ padding:'13px 32px', background:G, color:'#0D0D0D', textDecoration:'none', fontSize:12, letterSpacing:'.1em', textTransform:'uppercase', fontWeight:500 }}>Browse Marketplace →</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0D0D0D', fontFamily:"'DM Sans',sans-serif", color:'#F5F0E8', paddingTop:100 }}>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'0 40px 80px' }}>
        <div style={{ fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:G, marginBottom:12 }}>Shopping Cart</div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:500, marginBottom:40 }}>Your Cart</h1>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:32, alignItems:'start' }}>
          {/* Items */}
          <div>
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                style={{ background:'#141414', display:'flex', gap:20, padding:20, marginBottom:2, alignItems:'center' }}>
                <div style={{ width:80, height:80, background:'#1E1C19', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, flexShrink:0 }}>
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '🛍️'}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:500, marginBottom:3 }}>{item.name}</div>
                  <div style={{ fontSize:11, color:'#8A8070', marginBottom:8 }}>{item.category}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <button onClick={() => updateQty(item.id, item.qty-1)} style={qtyBtn}>−</button>
                    <span style={{ fontSize:14, minWidth:24, textAlign:'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty+1)} style={qtyBtn}>+</button>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:G, marginBottom:8 }}>R{item.price * item.qty}</div>
                  <button onClick={() => removeItem(item.id)} style={{ background:'none', border:'none', color:'#E05C5C', fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Remove</button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background:'#141414', border:'1px solid rgba(201,168,76,.12)', padding:32, position:'sticky', top:100 }}>
            <div style={{ position:'absolute', top:0, left:32, width:40, height:2, background:G }} />
            <div style={{ fontSize:11, letterSpacing:'.14em', textTransform:'uppercase', color:G, marginBottom:20 }}>Order Summary</div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:14, color:'#B8A88A' }}>
              <span>Subtotal</span><span>R{total}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20, fontSize:14, color:'#5CB88A' }}>
              <span>Delivery (flat fee)</span><span>R{delivery}</span>
            </div>
            <div style={{ borderTop:'1px solid rgba(201,168,76,.1)', paddingTop:16, display:'flex', justifyContent:'space-between', marginBottom:24 }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:500 }}>Total</span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:G }}>R{total + delivery}</span>
            </div>
            <button onClick={placeOrder}
              style={{ width:'100%', padding:14, background:G, color:'#0D0D0D', border:'none', fontSize:12, letterSpacing:'.1em', textTransform:'uppercase', fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", marginBottom:10 }}>
              Place Order →
            </button>
            <Link to="/marketplace" style={{ display:'block', textAlign:'center', fontSize:11, color:'#8A8070', letterSpacing:'.08em', textDecoration:'none', padding:'8px 0' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const qtyBtn = { width:28, height:28, background:'#1E1C19', border:'1px solid rgba(201,168,76,.2)', color:'#C9A84C', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif" };
