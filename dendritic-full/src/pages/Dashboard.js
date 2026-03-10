// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getVendorProducts, addProduct, deleteProduct, updateProduct, getVendorOrders, updateOrderStatus } from '../firebase/db';
import { uploadProductImage } from '../firebase/storage';
import { AdBanner, SLOTS } from '../components/AdSense';
import { notify } from '../components/Toast';
import toast from 'react-hot-toast';

const G = '#C9A84C';
const CATS = ['Food & Beverages','Fashion & Apparel','Handmade & Crafts','Beauty & Skincare','Electronics','Home & Garden','Books & Art','Other'];
const PROVINCES = ['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Limpopo','Mpumalanga','North West','Free State','Northern Cape'];

export default function Dashboard() {
  const { user, vendor, registerVendor, logout } = useAuth();
  const [products, setProducts]   = useState([]);
  const [orders,   setOrders]     = useState([]);
  const [tab,      setTab]        = useState('overview');
  const [adding,   setAdding]     = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [uploadPct,setUploadPct]  = useState(0);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name:'', description:'', price:'', category:'', imageUrl:'', imageFile:null });
  const [regForm, setRegForm] = useState({ businessName:'', category:'', province:'', phone:'', description:'' });

  useEffect(() => {
    if (!user || !vendor) return;
    getVendorProducts(user.uid).then(setProducts);
    const unsub = getVendorOrders(user.uid, setOrders);
    return unsub;
  }, [user, vendor]);

  // ── REGISTER VENDOR ────────────────────────────────────────
  const handleRegister = async e => {
    e.preventDefault();
    setLoading(true);
    try { await registerVendor(regForm); }
    catch { toast.error('Registration failed. Try again.'); }
    setLoading(false);
  };

  // ── ADD PRODUCT ────────────────────────────────────────────
  const handleAddProduct = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.imageUrl;
      if (form.imageFile) {
        const result = await uploadProductImage(user.uid, form.imageFile, setUploadPct);
        imageUrl = result.url;
      }
      await addProduct(user.uid, {
        name: form.name, description: form.description,
        price: parseFloat(form.price), category: form.category, imageUrl,
      });
      notify.productAdded(form.name);
      setForm({ name:'', description:'', price:'', category:'', imageUrl:'', imageFile:null });
      setAdding(false);
      setUploadPct(0);
      const updated = await getVendorProducts(user.uid);
      setProducts(updated);
    } catch (err) { toast.error('Failed to add product.'); }
    setLoading(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from your store?`)) return;
    await deleteProduct(id);
    setProducts(p => p.filter(x => x.id !== id));
    toast('Product removed.', { icon:'🗑️' });
  };

  const handleOrderStatus = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    if      (status === 'confirmed')  notify.orderConfirmed();
    else if (status === 'dispatched') notify.orderDispatched(vendor?.province || 'your location');
    else if (status === 'delivered')  notify.orderDelivered();
    else toast.success(`Order marked as ${status}`);
  };

  // ── NOT YET A VENDOR ───────────────────────────────────────
  if (user && !vendor) {
    return (
      <div style={{ minHeight:'100vh', background:'#0D0D0D', display:'flex', alignItems:'center', justifyContent:'center', padding:'80px 24px', fontFamily:"'DM Sans',sans-serif" }}>
        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}}
          style={{ background:'#141414', border:'1px solid rgba(201,168,76,.2)', padding:'52px 48px', maxWidth:520, width:'100%', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:48, width:44, height:2, background:G }} />
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:500, color:'#F5F0E8', marginBottom:6 }}>Register Your Business</div>
          <p style={{ fontSize:13, color:'#8A8070', marginBottom:32 }}>Complete your vendor profile to start selling on Dendritic</p>
          <form onSubmit={handleRegister}>
            <label style={lbl}>Business Name</label>
            <input style={inp} placeholder="e.g. Thandi's Crafts" value={regForm.businessName} onChange={e=>setRegForm({...regForm,businessName:e.target.value})} required />
            <label style={lbl}>Phone Number</label>
            <input style={inp} placeholder="+27 82 000 0000" value={regForm.phone} onChange={e=>setRegForm({...regForm,phone:e.target.value})} required />
            <label style={lbl}>Category</label>
            <select style={inp} value={regForm.category} onChange={e=>setRegForm({...regForm,category:e.target.value})} required>
              <option value="">Select category...</option>
              {CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <label style={lbl}>Province</label>
            <select style={inp} value={regForm.province} onChange={e=>setRegForm({...regForm,province:e.target.value})} required>
              <option value="">Select province...</option>
              {PROVINCES.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
            <label style={lbl}>Business Description</label>
            <textarea style={{...inp,height:80,resize:'vertical'}} placeholder="Tell customers about your business..." value={regForm.description} onChange={e=>setRegForm({...regForm,description:e.target.value})} required />
            <button style={{...primaryBtn,opacity:loading?.7:1}} type="submit" disabled={loading}>{loading?'Registering...':'Register Business →'}</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const stats = [
    { icon:'💰', val:`R${(vendor?.totalSales||0).toLocaleString()}`, lbl:'Total Sales' },
    { icon:'📦', val:vendor?.totalOrders||0, lbl:'Total Orders' },
    { icon:'🛍️', val:products.length, lbl:'Products Listed' },
    { icon:'⏳', val:orders.filter(o=>o.status==='placed').length, lbl:'Pending Orders' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#0D0D0D', fontFamily:"'DM Sans',sans-serif", color:'#F5F0E8', display:'flex' }}>
      {/* Sidebar */}
      <div style={{ width:215, background:'#141414', borderRight:'1px solid rgba(201,168,76,.1)', position:'fixed', top:0, bottom:0, display:'flex', flexDirection:'column', zIndex:100 }}>
        <div style={{ padding:'24px 20px', borderBottom:'1px solid rgba(201,168,76,.08)' }}>
          <Link to="/" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:G, letterSpacing:'.1em', textDecoration:'none', display:'block' }}>Dendritic</Link>
          <div style={{ fontSize:9, color:'#8A8070', letterSpacing:'.14em', textTransform:'uppercase', marginTop:3 }}>Vendor Portal</div>
        </div>
        <div style={{ padding:'12px 8px', flex:1 }}>
          {[['overview','📊','Overview'],['products','🛍️','Products'],['orders','📦','Orders'],['profile','⚙️','Profile']].map(([id,icon,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'11px 12px', background:tab===id?'rgba(201,168,76,.1)':'transparent', border:'none', borderLeft:`2px solid ${tab===id?G:'transparent'}`, color:tab===id?G:'#8A8070', fontSize:13, cursor:'pointer', textAlign:'left', fontFamily:"'DM Sans',sans-serif", marginBottom:2, transition:'all .2s' }}>
              {icon}&nbsp;{label}
            </button>
          ))}
        </div>
        <div style={{ padding:'12px 8px', borderTop:'1px solid rgba(201,168,76,.08)' }}>
          <button onClick={()=>navigate('/')} style={sideBtn}>← Back to Site</button>
          <button onClick={logout} style={sideBtn}>Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft:215, padding:36, flex:1 }}>
        <div style={{ marginBottom:30 }}>
          <div style={{ fontSize:10, letterSpacing:'.14em', textTransform:'uppercase', color: vendor?.status==='active'?'#5CB88A':G, marginBottom:5 }}>
            {vendor?.status==='active'?'● Live':'○ Pending Review'}
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:500, lineHeight:1 }}>{vendor?.businessName||user?.displayName}</div>
          <div style={{ color:'#8A8070', fontSize:12, marginTop:3 }}>{vendor?.category} · {vendor?.province}</div>
        </div>

        {/* OVERVIEW */}
        {tab==='overview' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2, marginBottom:22 }}>
              {stats.map((s,i)=>(
                <motion.div key={s.lbl} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:i*.07}}
                  style={{ background:'#1E1C19', padding:'22px 18px' }}>
                  <div style={{ fontSize:20, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:600, color:G, lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:10, letterSpacing:'.1em', textTransform:'uppercase', color:'#8A8070', marginTop:5 }}>{s.lbl}</div>
                </motion.div>
              ))}
            </div>
            <AdBanner slotConfig={SLOTS.LEADERBOARD} style={{ marginBottom:18 }} />
            <div style={{ background:'#1E1C19', padding:22 }}>
              <div style={{ fontSize:10, letterSpacing:'.14em', textTransform:'uppercase', color:G, marginBottom:16 }}>Recent Orders</div>
              {orders.length===0
                ? <p style={{ color:'#4A4035', fontSize:14, textAlign:'center', padding:28 }}>No orders yet. Share your store to start selling!</p>
                : orders.slice(0,5).map(o=>(
                  <div key={o.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                    <div>
                      <div style={{ fontSize:13, color:'#F5F0E8', marginBottom:2 }}>Order #{o.id.slice(-6).toUpperCase()}</div>
                      <div style={{ fontSize:11, color:'#8A8070' }}>{o.status} · R{o.total+49}</div>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* PRODUCTS */}
        {tab==='products' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:500 }}>Your Products</h2>
              <button style={primaryBtn} onClick={()=>setAdding(true)}>+ Add Product</button>
            </div>

            {adding && (
              <div style={{ background:'#1E1C19', border:'1px solid rgba(201,168,76,.15)', padding:32, marginBottom:22, position:'relative' }}>
                <div style={{ position:'absolute', top:0, left:32, width:40, height:2, background:G }} />
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:500, marginBottom:22 }}>New Product</h3>
                <form onSubmit={handleAddProduct}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <div><label style={lbl}>Product Name</label><input style={inp} placeholder="e.g. Beaded Necklace" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                    <div><label style={lbl}>Price (ZAR)</label><input style={inp} type="number" min="1" placeholder="e.g. 250" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required /></div>
                  </div>
                  <label style={lbl}>Category</label>
                  <select style={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required>
                    <option value="">Select category...</option>
                    {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <label style={lbl}>Description</label>
                  <textarea style={{...inp,height:72,resize:'vertical'}} placeholder="Describe your product..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required />
                  <label style={lbl}>Product Image</label>
                  <input type="file" accept="image/*" style={{...inp,padding:'9px 14px'}}
                    onChange={e=>setForm({...form,imageFile:e.target.files[0]})} />
                  {uploadPct>0 && uploadPct<100 && (
                    <div style={{ background:'#0D0D0D', height:4, borderRadius:2, margin:'8px 0' }}>
                      <div style={{ width:`${uploadPct}%`, height:'100%', background:G, borderRadius:2, transition:'width .3s' }} />
                    </div>
                  )}
                  <div style={{ display:'flex', gap:10, marginTop:8 }}>
                    <button style={{...primaryBtn,opacity:loading?.7:1}} type="submit" disabled={loading}>{loading?'Saving...':'Add Product'}</button>
                    <button style={{...primaryBtn,background:'transparent',color:'#8A8070',border:'1px solid rgba(201,168,76,.2)'}} type="button" onClick={()=>setAdding(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:2 }}>
              {products.map(p=>(
                <div key={p.id} style={{ background:'#1E1C19', padding:22 }}>
                  {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width:'100%', height:160, objectFit:'cover', marginBottom:14 }} />}
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:500, marginBottom:3 }}>{p.name}</div>
                  <div style={{ fontSize:12, color:'#8A8070', marginBottom:8 }}>{p.category}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:G, fontWeight:600, marginBottom:14 }}>R{p.price}</div>
                  <button onClick={()=>handleDelete(p.id,p.name)} style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'#E05C5C', background:'none', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Remove</button>
                </div>
              ))}
              {products.length===0&&!adding&&<div style={{ gridColumn:'1/-1', textAlign:'center', padding:52, color:'#4A4035', fontSize:14 }}>No products yet. Click "Add Product" to start!</div>}
            </div>
          </motion.div>
        )}

        {/* ORDERS */}
        {tab==='orders' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:500, marginBottom:20 }}>Orders</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              {orders.length===0&&<p style={{ color:'#4A4035', textAlign:'center', padding:52, fontSize:14 }}>No orders yet.</p>}
              {orders.map(o=>(
                <div key={o.id} style={{ background:'#1E1C19', padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14 }}>
                  <div>
                    <div style={{ fontSize:14, color:'#F5F0E8', marginBottom:3 }}>Order #{o.id.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize:12, color:'#8A8070' }}>R{o.total} + R49 delivery · {o.customerName||'Customer'}</div>
                  </div>
                  <StatusBadge status={o.status} />
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {o.status==='placed'     && <SmallBtn onClick={()=>handleOrderStatus(o.id,'confirmed')}>Confirm</SmallBtn>}
                    {o.status==='confirmed'  && <SmallBtn onClick={()=>handleOrderStatus(o.id,'dispatched')}>Mark Dispatched</SmallBtn>}
                    {o.status==='dispatched' && <SmallBtn onClick={()=>handleOrderStatus(o.id,'delivered')}>Mark Delivered</SmallBtn>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PROFILE */}
        {tab==='profile' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:500, marginBottom:20 }}>Business Profile</h2>
            <div style={{ background:'#1E1C19', padding:32, maxWidth:540, position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:32, width:40, height:2, background:G }} />
              {[['Business Name',vendor?.businessName],['Category',vendor?.category],['Province',vendor?.province],['Phone',vendor?.phone],['Email',user?.email],['Status',vendor?.status]].map(([l,v])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                  <span style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'#8A8070' }}>{l}</span>
                  <span style={{ fontSize:14, color: l==='Status'?(v==='active'?'#5CB88A':G):'#F5F0E8' }}>{v||'—'}</span>
                </div>
              ))}
            </div>
            <AdBanner slotConfig={SLOTS.RECTANGLE} style={{ marginTop:28, maxWidth:360 }} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = { placed:'#C9A84C', confirmed:'#4A9EE0', dispatched:'#9B6AD4', delivered:'#5CB88A' };
  const c = colors[status]||'#8A8070';
  return <span style={{ fontSize:10, letterSpacing:'.08em', textTransform:'uppercase', color:c, background:`${c}18`, padding:'4px 9px', border:`1px solid ${c}44` }}>{status}</span>;
}
function SmallBtn({ children, onClick }) {
  return <button onClick={onClick} style={{ padding:'7px 14px', background:'rgba(201,168,76,.1)', color:'#C9A84C', border:'1px solid rgba(201,168,76,.3)', fontSize:10, letterSpacing:'.08em', textTransform:'uppercase', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>{children}</button>;
}

const lbl        = { display:'block', fontSize:10, letterSpacing:'.12em', textTransform:'uppercase', color:'#8A8070', marginBottom:6 };
const inp        = { width:'100%', background:'#0D0D0D', border:'1px solid rgba(201,168,76,.15)', padding:'12px 14px', color:'#F5F0E8', fontSize:14, outline:'none', fontFamily:"'DM Sans',sans-serif", marginBottom:16, display:'block' };
const primaryBtn = { padding:'12px 26px', background:'#C9A84C', color:'#0D0D0D', border:'none', fontSize:12, letterSpacing:'.1em', textTransform:'uppercase', fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" };
const sideBtn    = { width:'100%', padding:'10px 12px', background:'transparent', border:'none', color:'#8A8070', fontSize:11, cursor:'pointer', textAlign:'left', fontFamily:"'DM Sans',sans-serif" };
