// src/components/AdSense.js
import { useEffect } from 'react';

const CLIENT = process.env.REACT_APP_ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXXXXXXXXX';

export const SLOTS = {
  LEADERBOARD: { slot: '1234567890', w: 728, h: 90  },
  RECTANGLE:   { slot: '0987654321', w: 336, h: 280 },
  SIDEBAR:     { slot: '5544332211', w: 300, h: 600 },
};

export function AdBanner({ slotConfig = SLOTS.RECTANGLE, style = {} }) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'14px 0', ...style }}>
      <span style={{ fontSize:'10px', letterSpacing:'.14em', textTransform:'uppercase', color:'#8A8070', marginBottom:'7px', fontFamily:"'DM Sans',sans-serif" }}>
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display:'block', width: slotConfig.w, height: slotConfig.h, maxWidth:'100%' }}
        data-ad-client={CLIENT}
        data-ad-slot={slotConfig.slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function InArticleAd() {
  useEffect(() => { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {} }, []);
  return (
    <div style={{ textAlign:'center', margin:'36px 0' }}>
      <span style={{ fontSize:'10px', color:'#8A8070', display:'block', marginBottom:'7px', letterSpacing:'.12em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif" }}>Sponsored</span>
      <ins className="adsbygoogle" style={{ display:'block', textAlign:'center' }}
        data-ad-layout="in-article" data-ad-format="fluid"
        data-ad-client={CLIENT} data-ad-slot={SLOTS.RECTANGLE.slot} />
    </div>
  );
}
