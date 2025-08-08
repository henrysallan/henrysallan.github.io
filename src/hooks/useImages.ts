import { useState, useCallback, useEffect } from 'react';
import { auth } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

interface ImageData {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  userId: string;
}

export const useImages = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const imagesRef = collection(db, 'images');
      const q = query(
        imagesRef, 
        where('userId', '==', user.uid),
        orderBy('uploadedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const imageList: ImageData[] = [];
      snapshot.forEach((doc) => {
        imageList.push({ id: doc.id, ...doc.data() } as ImageData);
      });
      
      setImages(imageList);
    } catch (error) {
      console.error('Error loading images:', error);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to upload images');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const imageRef = ref(storage, `images/${user.uid}/${filename}`);

      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save metadata to Firestore
      const imageData = {
        name: file.name,
        url: downloadURL,
        uploadedAt: new Date().toISOString(),
        userId: user.uid,
        storagePath: `images/${user.uid}/${filename}`
      };

      await addDoc(collection(db, 'images'), imageData);
      
      // Reload images
      await loadImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  }, [loadImages]);

  const deleteImage = useCallback(async (imageId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Find the image in our local state to get storage path
      const image = images.find(img => img.id === imageId);
      if (!image) return;

      // Delete from Firebase Storage
      const imageRef = ref(storage, `images/${user.uid}/${image.name}`);
      await deleteObject(imageRef);

      // Delete from Firestore
      await deleteDoc(doc(db, 'images', imageId));

      // Remove from local state
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    } finally {
      setLoading(false);
    }
  }, [images]);

  // Load images when component mounts
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  return {
    images,
    loading,
    error,
    uploadImage,
    deleteImage,
    loadImages
  };
};
