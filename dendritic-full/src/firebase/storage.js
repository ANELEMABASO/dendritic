// src/firebase/storage.js
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Upload a product image and return download URL
export const uploadProductImage = (vendorId, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const path = `products/${vendorId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      snapshot => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url, path });
      }
    );
  });
};

// Delete an image by its storage path
export const deleteProductImage = async (path) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

// Upload vendor profile/logo
export const uploadVendorLogo = (vendorId, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const path = `vendors/${vendorId}/logo_${Date.now()}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      snapshot => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url, path });
      }
    );
  });
};
