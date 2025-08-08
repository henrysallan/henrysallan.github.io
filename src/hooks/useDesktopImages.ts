import { useState, useCallback, useEffect } from 'react';
import { auth } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { compressImage, getCompressedFileName } from '../utils/imageCompression';

interface DesktopImageData {
  id: string;
  name: string;
  url: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  aspectRatio?: number;
  uploadedAt: string;
  storagePath: string;
}

export const useDesktopImages = () => {
  const [images, setImages] = useState<DesktopImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Use a simpler collection structure: /users/{userId}/desktopImages
      const userImagesRef = collection(db, 'users', user.uid, 'desktopImages');
      const querySnapshot = await getDocs(userImagesRef);
      const loadedImages: DesktopImageData[] = [];
      
      querySnapshot.forEach((doc) => {
        loadedImages.push({
          id: doc.id,
          ...doc.data()
        } as DesktopImageData);
      });
      
      setImages(loadedImages);
    } catch (err: any) {
      console.error('Error loading desktop images:', err);
      setError(`Failed to load images: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const addImage = useCallback(async (file: File, position: { x: number; y: number }) => {
    const user = auth.currentUser;
    if (!user) {
      setError('User not authenticated');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit (we'll compress anyway)
      setError('Image file too large (max 50MB)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      
      // Compress the image to WebP format
      const compressedBlob = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 900,
        quality: 0.8,
        format: 'webp'
      });
      
      console.log(`Compressed size: ${(compressedBlob.size / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Compression ratio: ${((file.size - compressedBlob.size) / file.size * 100).toFixed(1)}%`);

      // Upload compressed image to Firebase Storage
      const timestamp = Date.now();
      const compressedFileName = getCompressedFileName(file.name, 'webp');
      const storagePath = `desktopImages/${user.uid}/${timestamp}-${compressedFileName}`;
      const storageRef = ref(storage, storagePath);
      
      const snapshot = await uploadBytes(storageRef, compressedBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Default size based on natural image dimensions or reasonable default
      const defaultSize = { width: 200, height: 150 };

      // Save metadata to Firestore using user subcollection
      const imageData = {
        name: file.name, // Keep original name for display
        compressedName: compressedFileName,
        url: downloadURL,
        position,
        size: defaultSize,
        uploadedAt: new Date().toISOString(),
        storagePath,
        originalSize: file.size,
        compressedSize: compressedBlob.size,
        compressionRatio: ((file.size - compressedBlob.size) / file.size * 100).toFixed(1)
      };

      const userImagesRef = collection(db, 'users', user.uid, 'desktopImages');
      const docRef = await addDoc(userImagesRef, imageData);
      
      // Add to local state
      setImages(prev => [...prev, {
        id: docRef.id,
        ...imageData
      }]);

    } catch (err: any) {
      console.error('Error adding image:', err);
      if (err.message?.includes('compress')) {
        setError(`Failed to compress image: ${err.message}`);
      } else if (err.message?.includes('upload')) {
        setError(`Failed to upload image: ${err.message}`);
      } else {
        setError(`Failed to add image: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateImagePosition = useCallback(async (id: string, position: { x: number; y: number }) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Update in Firestore
      const imageDoc = doc(db, 'users', user.uid, 'desktopImages', id);
      await updateDoc(imageDoc, { position });
    } catch (err: any) {
      console.error('Error updating image position:', err);
      setError(`Failed to update position: ${err.message}`);
    }
  }, []);

  const updateImagePositionLocal = useCallback((id: string, position: { x: number; y: number }) => {
    // Update local state immediately for smooth UI
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, position } : img
    ));
  }, []);

  const updateImageSize = useCallback(async (id: string, size: { width: number; height: number }) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Update in Firestore
      const imageDoc = doc(db, 'users', user.uid, 'desktopImages', id);
      await updateDoc(imageDoc, { size });
    } catch (err: any) {
      console.error('Error updating image size:', err);
      setError(`Failed to update size: ${err.message}`);
    }
  }, []);

  const updateImageSizeLocal = useCallback((id: string, size: { width: number; height: number }) => {
    // Update local state immediately for smooth UI
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, size } : img
    ));
  }, []);

  const updateImageAspectRatio = useCallback(async (id: string, aspectRatio: number) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Update in Firestore
      const imageDoc = doc(db, 'users', user.uid, 'desktopImages', id);
      await updateDoc(imageDoc, { aspectRatio });
      
      // Update local state
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, aspectRatio } : img
      ));
    } catch (err: any) {
      console.error('Error updating image aspect ratio:', err);
      // Don't show error to user for this as it's not critical
    }
  }, []);

  const deleteImage = useCallback(async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const imageToDelete = images.find(img => img.id === id);
      if (!imageToDelete) return;

      // Delete from Firebase Storage
      const storageRef = ref(storage, imageToDelete.storagePath);
      await deleteObject(storageRef);

      // Delete from Firestore
      await deleteDoc(doc(db, 'users', user.uid, 'desktopImages', id));
      
      // Remove from local state
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err: any) {
      console.error('Error deleting image:', err);
      setError(`Failed to delete image: ${err.message}`);
    }
  }, [images]);

  // Load images when user changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadImages();
      } else {
        setImages([]);
      }
    });

    return () => unsubscribe();
  }, [loadImages]);

  return {
    images,
    loading,
    error,
    addImage,
    updateImagePosition,
    updateImagePositionLocal,
    updateImageSize,
    updateImageSizeLocal,
    updateImageAspectRatio,
    deleteImage,
    loadImages
  };
};
