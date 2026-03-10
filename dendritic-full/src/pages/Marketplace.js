// src/pages/Marketplace.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllProducts } from '../firebase/db';
import { AdBanner, SLOTS } from '../components/AdSense';
import { useCart } from '../context/CartContext';

const G = '#C9A84C';
const CATS = ['All','Food & Beverages','Fashion & Apparel','Handmade & Crafts','Beauty & Skincare','Electronics','Home & Garden','Books & Art','Other'];

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cat, setCat]           = useState('All');
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    getAllProducts().then(p => { setProducts(p); setFiltered(p); setLoading(false); });
  }, []);

  useEffect(() => {
    let p = products;
    if (cat !== 'All') p = p.filter(x => x.category === cat);
    if (search.trim()) p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(p);
  }, [cat, search, products]);

  return (
    <div style={{ minHeight:'100vh', background:'#0D0D0D', fontFamily:"'DM Sans',sans-serif", paddingTop:80 }}>
      <div style={{ padding:'52px 52px 32px', borderBottom:'1px solid rgba(201,168,76,.07)' }}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <div style={{ fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:G, marginBottom:12 }}>South African Marketplace</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(30px,4vw,50px)', fontWeight:500, lineHeight:1.1, color:'#F5F0E8', marginBottom:20 }}>
            Shop Local, <em style={{color:G,fontStyle:'italic'}}>Delivered to You</em>
          </h1>
          <input
            style={{ background:'#1E1C19', border:'1px solid rgba(201,168,76,.15)', padding:'13px 18px', color:'#F5F0E8', fontSize:14, width:340, maxWidth:'100%', outline:'none', fontFamily:"'DM Sans',sans-serif" }}
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </motion.div>
      </div>

      <div style={{ display:'flex' }}>
        {/* Sidebar */}
        <div style={{ width:195, flexShrink:0, padding:'24px 14px', borderRight:'1px solid rgba(201,168,76,.06)', position:'sticky', top:80, alignSelf:'flex-start', maxHeight:'calc(100vh - 80px)', overflowY:'auto' }}>
          <div style={{ fontSize:10, letterSpacing:'.14em', textTransform:'uppercase', color:'#8A8070', marginBottom:12 }}>Categories</div>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ display:'block', width:'100%', textAlign:'left', padding:'9px 12px', background: cat===c ? 'rgba(201,168,76,.1)' : 'transparent', border:'none', borderLeft:`2px solid ${cat===c ? G : 'transparent'}`, color: cat===c ? G : '#8A8070', fontSize:12, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", marginBottom:2, transition:'all .2s' }}>
              {c}
            </button>
          ))}
          <AdBanner slotConfig={SLOTS.RECTANGLE} style={{ marginTop:20 }} />
        </div>

        {/* Products */}
        <div style={{ flex:1, padding:'24px 32px' }}>
          <div style={{ fontSize:12, color:'#8A8070', marginBottom:18, letterSpacing:'.06em' }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found{cat !== 'All' ? ` in ${cat}` : ''}
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:80, color:'#4A4035' }}>Loading products from Firestore...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:80 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🏪</div>
              <p style={{ color:'#8A8070', fontSize:14 }}>
                {products.length === 0 ? 'No products yet. Vendors are joining — check back soon!' : 'No products match your search.'}
              </p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:2 }}>
              {filtered.map((p, i) => (
                <motion.div key={p.id}
                  initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
                  style={{ background:'#141414', overflow:'hidden', cursor:'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                  <div style={{ height:190, background:'#1E1C19', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <div style={{ fontSize:50 }}>🛍️</div>}
                  </div>
                  <div style={{ padding:18 }}>
                    <div style={{ fontSize:10, letterSpacing:'.1em', textTransform:'uppercase', color:'#8A8070', marginBottom:5 }}>{p.category}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:500, marginBottom:4, color:'#F5F0E8' }}>{p.name}</div>
                    <p style={{ fontSize:12, color:'#8A8070', lineHeight:1.7, marginBottom:14 }}>{p.description?.slice(0,80)}{p.description?.length>80?'...':''}</p>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:G }}>R{p.price}</div>
                      <button onClick={() => addItem(p)}
                        style={{ padding:'8px 16px', background:G, color:'#0D0D0D', border:'none', fontSize:10, letterSpacing:'.1em', textTransform:'uppercase', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>
                        Add to Cart
                      </button>
                    </div>
                    <div style={{ fontSize:10, color:'#5CB88A', marginTop:8 }}>+ R49 delivery · 2-5 days</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
