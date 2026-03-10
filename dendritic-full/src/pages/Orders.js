// src/pages/Orders.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCustomerOrders } from '../firebase/db';

const G = '#C9A84C';

const STATUS_STEPS = ['placed', 'confirmed', 'dispatched', 'delivered'];
const STATUS_LABELS = {
  placed: '📋 Order Placed',
  confirmed: '✅ Confirmed by Vendor',
  dispatched: '🚚 Out for Delivery',
  delivered: '🎉 Delivered',
};

function StatusTracker({ status }) {
  const idx = STATUS_STEPS.indexOf(status);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 16 }}>
      {STATUS_STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 'none' : 1 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: i <= idx ? G : '#1E1C19',
              border: `2px solid ${i <= idx ? G : 'rgba(201,168,76,0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, color: i <= idx ? '#0D0D0D' : '#4A4035',
              fontWeight: 700,
            }}>
              {i < idx ? '✓' : i + 1}
            </div>
            <div style={{ fontSize: 9, color: i <= idx ? G : '#4A4035', marginTop: 5, letterSpacing: '.08em', textTransform: 'uppercase', textAlign: 'center', maxWidth: 60 }}>
              {s}
            </div>
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < idx ? G : 'rgba(201,168,76,0.15)', margin: '0 4px', marginBottom: 22 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = getCustomerOrders(user.uid, (data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 13, color: '#8A8070', letterSpacing: '.1em', fontFamily: "'DM Sans',sans-serif" }}>Loading orders...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', fontFamily: "'DM Sans',sans-serif", color: '#F5F0E8', paddingTop: 100 }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 40px 80px' }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: G, marginBottom: 12 }}>My Orders</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 500, marginBottom: 40 }}>Order History</h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 500, marginBottom: 12 }}>No orders yet</h2>
            <p style={{ color: '#8A8070', marginBottom: 28, fontSize: 14 }}>Browse our marketplace and place your first order!</p>
            <Link to="/marketplace" style={{ padding: '13px 32px', background: G, color: '#0D0D0D', textDecoration: 'none', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 500 }}>
              Browse Marketplace →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {orders.map((order, i) => (
              <motion.div key={order.id}
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                style={{ background: '#141414', border: '1px solid rgba(201,168,76,0.08)', padding: '28px 30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#8A8070', marginBottom: 4 }}>Order</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500 }}>
                      #{order.id.slice(-6).toUpperCase()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#8A8070', marginBottom: 4 }}>Total incl. delivery</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: G }}>
                      R{(order.total || 0) + 49}
                    </div>
                  </div>
                </div>

                {/* Products list */}
                {order.products && (
                  <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {order.products.map((p, j) => (
                      <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#B8A88A', padding: '4px 0' }}>
                        <span>{p.name} × {p.qty}</span>
                        <span>R{p.price * p.qty}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5CB88A', padding: '4px 0' }}>
                      <span>Delivery fee</span><span>R49</span>
                    </div>
                  </div>
                )}

                {/* Tracker */}
                <div style={{ fontSize: 11, color: '#8A8070', marginBottom: 6, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                  Current Status: <span style={{ color: G }}>{STATUS_LABELS[order.status] || order.status}</span>
                </div>
                <StatusTracker status={order.status} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
