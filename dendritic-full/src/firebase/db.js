// src/firebase/db.js
import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  deleteDoc, query, where, orderBy, serverTimestamp,
  onSnapshot, setDoc, increment, limit
} from 'firebase/firestore';
import { db } from './config';

// ── VENDORS ────────────────────────────────────────────────────
export const createVendor = async (userId, data) => {
  await setDoc(doc(db, 'vendors', userId), {
    ...data,
    createdAt:   serverTimestamp(),
    status:      'pending',
    totalSales:  0,
    totalOrders: 0,
    rating:      0,
  });
};

export const getVendor = async (userId) => {
  const snap = await getDoc(doc(db, 'vendors', userId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateVendor = async (userId, data) => {
  await updateDoc(doc(db, 'vendors', userId), {
    ...data, updatedAt: serverTimestamp(),
  });
};

export const getAllVendors = async () => {
  const snap = await getDocs(
    query(collection(db, 'vendors'), where('status', '==', 'active'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ── PRODUCTS ───────────────────────────────────────────────────
export const addProduct = async (vendorId, data) => {
  return await addDoc(collection(db, 'products'), {
    ...data,
    vendorId,
    createdAt: serverTimestamp(),
    available: true,
    sales:     0,
  });
};

export const getVendorProducts = async (vendorId) => {
  const snap = await getDocs(
    query(
      collection(db, 'products'),
      where('vendorId', '==', vendorId),
      orderBy('createdAt', 'desc')
    )
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getAllProducts = async (cat = null) => {
  let q = query(
    collection(db, 'products'),
    where('available', '==', true),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  if (cat) q = query(q, where('category', '==', cat));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateProduct = async (productId, data) => {
  await updateDoc(doc(db, 'products', productId), {
    ...data, updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (productId) => {
  await deleteDoc(doc(db, 'products', productId));
};

// ── ORDERS ─────────────────────────────────────────────────────
export const createOrder = async (data) => {
  const order = await addDoc(collection(db, 'orders'), {
    ...data,
    status:      'placed',
    createdAt:   serverTimestamp(),
    deliveryFee: 49,
    currency:    'ZAR',
  });
  await updateDoc(doc(db, 'vendors', data.vendorId), {
    totalOrders: increment(1),
    totalSales:  increment(data.total),
  });
  return order;
};

export const getVendorOrders = (vendorId, callback) => {
  return onSnapshot(
    query(
      collection(db, 'orders'),
      where('vendorId', '==', vendorId),
      orderBy('createdAt', 'desc')
    ),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

export const getCustomerOrders = (customerId, callback) => {
  return onSnapshot(
    query(
      collection(db, 'orders'),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    ),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

export const updateOrderStatus = async (orderId, status) => {
  await updateDoc(doc(db, 'orders', orderId), {
    status, updatedAt: serverTimestamp(),
  });
};

// ── REVIEWS ────────────────────────────────────────────────────
export const addReview = async (vendorId, data) => {
  await addDoc(collection(db, 'reviews'), {
    ...data, vendorId, createdAt: serverTimestamp(),
  });
};

export const getVendorReviews = async (vendorId) => {
  const snap = await getDocs(
    query(collection(db, 'reviews'), where('vendorId', '==', vendorId))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
