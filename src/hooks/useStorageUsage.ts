import { useState, useEffect, useCallback } from 'react';
import { ref, listAll, getMetadata } from 'firebase/storage';
import { storage, auth } from '../config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useSyncContext } from '../contexts/SyncContext';

interface StorageUsage {
  totalBytes: number;
  imageBytes: number;
  modelBytes: number;
  imageCount: number;
  modelCount: number;
  isLoading: boolean;
  error: string | null;
}

export const useStorageUsage = () => {
  const [user, setUser] = useState<User | null>(null);
  const { storageChangeListeners } = useSyncContext();
  const [usage, setUsage] = useState<StorageUsage>({
    totalBytes: 0,
    imageBytes: 0,
    modelBytes: 0,
    imageCount: 0,
    modelCount: 0,
    isLoading: true,
    error: null
  });

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const calculateStorageUsage = useCallback(async () => {
    if (!user) {
      setUsage(prev => ({ 
        ...prev, 
        totalBytes: 0,
        imageBytes: 0,
        modelBytes: 0,
        imageCount: 0,
        modelCount: 0,
        isLoading: false,
        error: null
      }));
      return;
    }

    try {
      setUsage(prev => ({ ...prev, isLoading: true, error: null }));

      let totalImageBytes = 0;
      let totalModelBytes = 0;
      let imageCount = 0;
      let modelCount = 0;

      // Calculate image storage usage
      try {
        const imagesRef = ref(storage, `desktop-images/${user.uid}`);
        const imagesList = await listAll(imagesRef);
        
        for (const itemRef of imagesList.items) {
          try {
            const metadata = await getMetadata(itemRef);
            totalImageBytes += metadata.size || 0;
            imageCount++;
          } catch (error) {
            console.warn('Could not get metadata for image:', itemRef.name, error);
          }
        }
      } catch (error: any) {
        if (error?.code === 'storage/object-not-found' || error?.code === 'storage/unauthorized') {
          console.log('No images folder found or no permission - this is normal for new users');
        } else {
          console.warn('Could not list images:', error);
        }
      }

      // Calculate 3D models storage usage
      try {
        const modelsRef = ref(storage, `desktop-3d-models/${user.uid}`);
        const modelsList = await listAll(modelsRef);
        
        for (const itemRef of modelsList.items) {
          try {
            const metadata = await getMetadata(itemRef);
            totalModelBytes += metadata.size || 0;
            modelCount++;
          } catch (error) {
            console.warn('Could not get metadata for model:', itemRef.name, error);
          }
        }
      } catch (error: any) {
        if (error?.code === 'storage/object-not-found' || error?.code === 'storage/unauthorized') {
          console.log('No models folder found or no permission - this is normal for new users');
        } else {
          console.warn('Could not list models:', error);
        }
      }

      const totalBytes = totalImageBytes + totalModelBytes;

      setUsage({
        totalBytes,
        imageBytes: totalImageBytes,
        modelBytes: totalModelBytes,
        imageCount,
        modelCount,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error calculating storage usage:', error);
      setUsage(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to calculate storage usage'
      }));
    }
  }, [user]);

  // Calculate usage on mount and when user changes (with a small delay for auth)
  useEffect(() => {
    if (user) {
      // Small delay to ensure auth is fully ready
      const timer = setTimeout(() => {
        calculateStorageUsage();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      calculateStorageUsage();
    }
  }, [calculateStorageUsage, user]);

  // Listen for storage changes
  useEffect(() => {
    storageChangeListeners.add(calculateStorageUsage);
    return () => {
      storageChangeListeners.delete(calculateStorageUsage);
    };
  }, [storageChangeListeners, calculateStorageUsage]);

  // Format bytes for display
  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  return {
    ...usage,
    formatBytes,
    refreshUsage: calculateStorageUsage
  };
};

export default useStorageUsage;
