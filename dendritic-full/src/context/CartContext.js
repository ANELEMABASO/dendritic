// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dendritic_cart') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('dendritic_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        toast('Already in cart! Quantity updated. 🛒');
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      toast.success(`"${product.name}" added to cart! 🛍️`);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast('Item removed from cart.', { icon: '🗑️' });
  };

  const updateQty = (id, qty) => {
    if (qty < 1) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);

  const total    = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count    = items.reduce((s, i) => s + i.qty, 0);
  const delivery = items.length > 0 ? 49 : 0;

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      total, count, delivery,
    }}>
      {children}
    </CartContext.Provider>
  );
};
