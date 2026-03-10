// src/pages/Home.js
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Scene3D from '../components/Scene3D';
import { AdBanner, InArticleAd, SLOTS } from '../components/AdSense';
import { useAuth } from '../context/AuthContext';

const G = '#C9A84C';
const fadeUp = { hidden:{ opacity:0, y:36 }, visible:(i=0) => ({ opacity:1, y:0, transition:{ delay:i*0.1, duration:0.7, ease:[0.22,1,0.36,1] } }) };

function Reveal({ children, delay=0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-80px' });
  return (
    <motion.div ref={ref} custom={delay} variants={fadeUp} initial="hidden" animate={inView?'visible':'hidden'}>
      {children}
    </motion.div>
  );
}

export default function Home({ onAuthOpen }) {
  const { user } = useAuth();

  return (
    <div style={{ background:'#0D0D0D', color:'#F5F0E8', fontFamily:"'DM Sans',sans-serif" }}>

      {/* HERO */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', overflow:'hidden' }}>
        <Scene3D style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0 }} />
        <div style={{ position:'absolute', inset:0, zIndex:1, background:'linear-gradient(to right,rgba(13,13,13,.96) 0%,rgba(13,13,13,.68) 52%,rgba(13,13,13,.05) 100%)' }} />
        <div style={{ position:'relative', zIndex:2, padding:'140px 52px 80px', maxWidth:640 }}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
            style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'6px 13px', border:'1px solid rgba(201,168,76,.3)', color:'#E8C97A', fontSize:11, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:28 }}>
            <span style={{ width:6, height:6, background:G, borderRadius:'50%', display:'inline-block', animation:'pulse 2s infinite' }} />
            🇿🇦 Built for South African Small Businesses
          </motion.div>
          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.12}}
            style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(50px,6vw,82px)', fontWeight:500, lineHeight:1.06, letterSpacing:'-.01em', marginBottom:22 }}>
            Your Local Shop,<br/><em style={{color:G,fontStyle:'italic'}}>Delivered</em><br/>Everywhere.
          </motion.h1>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.24}}
            style={{ fontSize:17, lineHeight:1.8, color:'#B8A88A', maxWidth:440, marginBottom:38 }}>
            Register your business on Dendritic. We list your products, customers order nationwide, and our own transport delivers — like Shein &amp; Temu, but proudly South African.
          </motion.p>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.36}}
            style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
            {user
              ? <Link to="/dashboard" style={btnPrimary}>Go to Dashboard →</Link>
              : <button onClick={onAuthOpen} style={btnPrimary}>Register Your Business →</button>}
            <Link to="/marketplace" style={btnGhost}>Browse Marketplace</Link>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.56}}
            style={{ display:'flex', gap:36, marginTop:44, flexWrap:'wrap' }}>
            {[['2.4k+','Vendors'],['98%','On-Time Delivery'],['R49','Flat Fee'],['9','Provinces']].map(([v,l]) => (
              <div key={l}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:600, color:G, lineHeight:1 }}>{v}</div><div style={{ fontSize:10, letterSpacing:'.12em', textTransform:'uppercase', color:'#8A8070', marginTop:3 }}>{l}</div></div>
            ))}
          </motion.div>
        </div>
        <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:2, textAlign:'center' }}>
          <div style={{ fontSize:10, letterSpacing:'.14em', textTransform:'uppercase', color:'#4A4035', marginBottom:6 }}>Scroll</div>
          <div style={{ width:1, height:36, background:'linear-gradient(to bottom,#C9A84C,transparent)', margin:'0 auto' }} />
        </div>
      </section>

      {/* Ad */}
      <div style={{ background:'#0D0D0D', borderTop:'1px solid rgba(201,168,76,.05)', borderBottom:'1px solid rgba(201,168,76,.05)' }}>
        <AdBanner slotConfig={SLOTS.LEADERBOARD} style={{ justifyContent:'center', padding:'18px' }} />
      </div>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding:'100px 52px', background:'#141414' }}>
        <Reveal>
          <div style={secLabel}>The Process</div>
          <h2 style={secTitle}>Simple to Start,<br/><em style={{color:G,fontStyle:'italic'}}>Powerful to Grow</em></h2>
          <p style={secSub}>From registration to your first sale — Dendritic handles the complexity.</p>
        </Reveal>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:2, marginTop:44 }}>
          {[
            { n:'01', icon:'📋', title:'Register Your Business', desc:'Sign up, list your products and prices, and go live in minutes. No technical skills needed.' },
            { n:'02', icon:'🛒', title:'Customers Browse & Buy', desc:'Shoppers across South Africa discover and order your products through the Dendritic platform.' },
            { n:'03', icon:'🚚', title:'We Deliver for You', desc:'Our transport network picks up and delivers — like Shein or Temu, but for SA businesses.' },
          ].map((s,i) => (
            <Reveal key={i} delay={i}>
              <div style={stepCard} onMouseEnter={e=>e.currentTarget.style.background='#222018'} onMouseLeave={e=>e.currentTarget.style.background='#1E1C19'}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:60, fontWeight:700, color:'rgba(201,168,76,.08)', lineHeight:1, marginBottom:14 }}>{s.n}</div>
                <div style={{ fontSize:26, marginBottom:12 }}>{s.icon}</div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:500, marginBottom:8 }}>{s.title}</h3>
                <p style={{ fontSize:13, lineHeight:1.8, color:'#8A8070' }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div style={{ background:'#141414' }}><InArticleAd /></div>

      {/* FEATURES */}
      <section style={{ padding:'100px 52px', background:'#0D0D0D' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'start' }}>
          <div>
            <Reveal>
              <div style={secLabel}>Why Dendritic</div>
              <h2 style={secTitle}>Everything You Need<br/>to <em style={{color:G,fontStyle:'italic'}}>Sell</em></h2>
              <p style={secSub}>Infrastructure built for small businesses to compete nationally.</p>
            </Reveal>
            <div style={{ display:'flex', flexDirection:'column', gap:2, marginTop:10 }}>
              {[
                { icon:'🏪', t:'Your Own Digital Storefront', d:'Dedicated shop page with product listings, photos, and descriptions.' },
                { icon:'🚛', t:'Managed Delivery Network', d:'Our drivers collect and deliver nationwide — no courier headaches.' },
                { icon:'💳', t:'Transparent R49 Delivery Fee', d:'Customers pay a clear flat fee at checkout. No hidden costs.' },
                { icon:'📊', t:'Real-Time Sales Dashboard', d:'Track orders, revenue, and delivery status in one place.' },
                { icon:'🤝', t:'SA Vendor Community', d:'Join thousands of South African businesses growing together.' },
              ].map((f,i) => (
                <Reveal key={i} delay={i*0.5}>
                  <div style={featItem} onMouseEnter={e=>{e.currentTarget.style.borderLeftColor=G;e.currentTarget.style.background='#181610';}} onMouseLeave={e=>{e.currentTarget.style.borderLeftColor='transparent';e.currentTarget.style.background='#1E1C19';}}>
                    <div style={{ fontSize:20, flexShrink:0 }}>{f.icon}</div>
                    <div>
                      <h4 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:500, marginBottom:4 }}>{f.t}</h4>
                      <p style={{ fontSize:12, lineHeight:1.8, color:'#8A8070' }}>{f.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div style={{ position:'sticky', top:100 }}>
            <Reveal>
              <div style={{ background:'#1E1C19', border:'1px solid rgba(201,168,76,.12)', padding:40, position:'relative' }}>
                <div style={{ position:'absolute', top:0, left:40, width:44, height:2, background:G }} />
                <div style={secLabel}>Delivery Cost</div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:500, marginBottom:10 }}>Affordable Delivery,<br/><em style={{color:G,fontStyle:'italic'}}>Every Time</em></h3>
                <p style={{ fontSize:13, color:'#8A8070', lineHeight:1.8, marginBottom:22 }}>Customers pay a clear flat fee. You receive your full product price — we handle logistics.</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2 }}>
                  <div style={{ background:'rgba(201,168,76,.08)', border:'1px solid rgba(201,168,76,.2)', padding:20, textAlign:'center' }}>
                    <div style={{ fontSize:10, letterSpacing:'.12em', textTransform:'uppercase', color:'#8A8070', marginBottom:8 }}>Dendritic</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:600, color:G }}>R49</div>
                    <div style={{ fontSize:10, color:'#8A8070', marginTop:3 }}>Flat delivery fee</div>
                  </div>
                  <div style={{ background:'#141414', padding:20, textAlign:'center' }}>
                    <div style={{ fontSize:10, letterSpacing:'.12em', textTransform:'uppercase', color:'#8A8070', marginBottom:8 }}>Traditional Courier</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600, color:'#4A4035' }}>R120+</div>
                    <div style={{ fontSize:10, color:'#8A8070', marginTop:3 }}>Variable / hidden fees</div>
                  </div>
                </div>
              </div>
              <AdBanner slotConfig={SLOTS.RECTANGLE} style={{ marginTop:18 }} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:'100px 52px', background:'#141414' }}>
        <Reveal>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <div style={secLabel}>Vendor Stories</div>
            <h2 style={secTitle}>Businesses <em style={{color:G,fontStyle:'italic'}}>Thriving</em><br/>with Dendritic</h2>
          </div>
        </Reveal>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:2 }}>
          {[
            { q:'Before Dendritic I could only sell in my neighbourhood. Now I have customers in Durban, Cape Town — all over. It changed everything.', name:'Nomvula Dlamini', biz:'Handmade Jewellery · Soweto', av:'👩🏾' },
            { q:'The delivery is just like Shein — my customers trust it. They know exactly what they\'re paying. My sales tripled in three months.', name:'Sipho Mokoena', biz:'African Spices · Pretoria', av:'👨🏿' },
            { q:'Registration was so easy. Within a week I had my first 20 orders and Dendritic handled all the deliveries. I just focus on making products.', name:'Fatima Adams', biz:'Natural Skincare · Cape Town', av:'👩🏽' },
          ].map((t,i) => (
            <Reveal key={i} delay={i}>
              <div style={{ background:'#1E1C19', padding:36, height:'100%' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:64, color:'rgba(201,168,76,.12)', lineHeight:1, marginBottom:2 }}>"</div>
                <p style={{ fontSize:14, lineHeight:1.8, color:'#B8A88A', marginBottom:22, fontStyle:'italic' }}>{t.q}</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:38, height:38, background:'rgba(201,168,76,.1)', border:'1px solid rgba(201,168,76,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{t.av}</div>
                  <div><div style={{ fontSize:13, color:'#F5F0E8' }}>{t.name}</div><div style={{ fontSize:11, color:'#8A8070' }}>{t.biz}</div></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'120px 52px', textAlign:'center', background:'#0D0D0D', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:300, background:'radial-gradient(ellipse,rgba(201,168,76,.07) 0%,transparent 70%)', pointerEvents:'none' }} />
        <Reveal>
          <div style={secLabel}>Get Started Today</div>
          <h2 style={{ ...secTitle, maxWidth:420, margin:'0 auto 14px' }}>Ready to Grow<br/><em style={{color:G,fontStyle:'italic'}}>Your Business?</em></h2>
          <p style={{ ...secSub, margin:'0 auto 36px' }}>Join thousands of SA small businesses already selling and delivering with Dendritic. Free to register.</p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            {user ? <Link to="/dashboard" style={btnPrimary}>Go to Dashboard →</Link> : <button onClick={onAuthOpen} style={btnPrimary}>Register Your Business →</button>}
            <Link to="/marketplace" style={btnGhost}>Explore Marketplace</Link>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'#141414', borderTop:'1px solid rgba(201,168,76,.1)', padding:'44px 52px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:18 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:G, letterSpacing:'.1em' }}>Dendritic</div>
        <div style={{ display:'flex', gap:26, flexWrap:'wrap' }}>
          {['About','Vendors','Delivery','Privacy','Terms'].map(l => <span key={l} style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'#8A8070', cursor:'pointer' }}>{l}</span>)}
        </div>
        <div style={{ fontSize:11, color:'#4A4035' }}>© 2025 Dendritic · Proudly South African 🇿🇦</div>
      </footer>

      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}@media(max-width:800px){section{padding:70px 20px!important}.steps,.feat-grid,.testi-grid{grid-template-columns:1fr!important}footer{flex-direction:column!important;padding:36px 20px!important}}`}</style>
    </div>
  );
}

const btnPrimary = { display:'inline-flex', alignItems:'center', padding:'14px 32px', background:'#C9A84C', color:'#0D0D0D', fontSize:12, letterSpacing:'.1em', textTransform:'uppercase', fontWeight:500, textDecoration:'none', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" };
const btnGhost   = { display:'inline-flex', alignItems:'center', padding:'14px 0', color:'#B8A88A', fontSize:12, letterSpacing:'.1em', textTransform:'uppercase', textDecoration:'none', borderBottom:'1px solid rgba(201,168,76,.3)' };
const secLabel   = { fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:G, marginBottom:12 };
const secTitle   = { fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,4vw,50px)', fontWeight:500, lineHeight:1.1, marginBottom:14 };
const secSub     = { fontSize:15, lineHeight:1.8, color:'#B8A88A', maxWidth:470, marginBottom:40 };
const stepCard   = { background:'#1E1C19', padding:'38px 32px', transition:'background .3s', cursor:'default' };
const featItem   = { display:'flex', gap:18, padding:'20px 22px', background:'#1E1C19', borderLeft:'2px solid transparent', transition:'all .3s', cursor:'default', alignItems:'flex-start' };
