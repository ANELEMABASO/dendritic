// src/components/Toast.js
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

export function DendriticToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1E1C19',
          color: '#F5F0E8',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '0px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '13px',
          letterSpacing: '0.04em',
          padding: '13px 17px',
          maxWidth: '370px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        },
        success: { iconTheme: { primary: '#C9A84C', secondary: '#1E1C19' } },
        error:   { iconTheme: { primary: '#E05C5C', secondary: '#1E1C19' },
          style: { border: '1px solid rgba(224,92,92,0.4)' } },
      }}
    />
  );
}

export const notify = {
  orderPlaced:    (id)   => toast.success(`Order #${id} placed! Delivery 2-5 days 🚚`, { duration: 5000 }),
  orderConfirmed: ()     => toast.success('Order confirmed by vendor! 📦'),
  orderDispatched:(city) => toast(`Order on its way from ${city}! 🚛`, { icon: '🚛', duration: 5000 }),
  orderDelivered: ()     => toast.success('Order delivered! ✅', { duration: 5000 }),
  vendorApproved: ()     => toast.success('Your business is now live! 🎉', { duration: 6000 }),
  productAdded:   (name) => toast.success(`"${name}" added to your store 🛍️`),
  productSold:    (name, price) => toast(`New sale! "${name}" — R${price} 💰`, { icon: '🎊', duration: 5000 }),
  copied:         ()     => toast('Copied!', { icon: '📋', duration: 2000 }),
  error:          (msg)  => toast.error(msg || 'Something went wrong. Try again.'),
  networkError:   ()     => toast.error('Connection issue. Check your internet.'),
};
