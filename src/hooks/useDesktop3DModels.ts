import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '../config/firebase';
import { debounce } from '../utils/debounce';

export interface Desktop3DModel {
  id: string;
  name: string;
  url: string;
  position: { x: number; y: number };
  windowId: string;
  createdAt: Date;
  storageRef: string;
}

const STORAGE_PATH = 'desktop-3d-models';

// Debounced position update
const debouncedUpdatePosition = debounce(async (userId: string, modelId: string, position: { x: number; y: number }) => {
  try {
    const modelRef = doc(db, 'users', userId, 'desktop3DModels', modelId);
    await updateDoc(modelRef, { position });
  } catch (error) {
    console.error('Error updating 3D model position:', error);
  }
}, 500);

export const useDesktop3DModels = () => {
  const [models, setModels] = useState<Desktop3DModel[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load models from Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setModels([]);
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'desktop3DModels'), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const modelsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Desktop3DModel[];
      
      setModels(modelsData);
    }, (error) => {
      console.error('Error loading 3D models:', error);
      setError('Failed to load 3D models');
    });

    return unsubscribe;
  }, []);

  const uploadModel = useCallback(async (file: File, position: { x: number; y: number }) => {
    const user = auth.currentUser;
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      // Validate file type
      const isValidType = file.type === 'model/gltf-binary' || 
                         file.name.toLowerCase().endsWith('.glb') ||
                         file.name.toLowerCase().endsWith('.gltf');
      
      if (!isValidType) {
        throw new Error('Please upload GLB or GLTF files only');
      }

      // Validate file size (max 50MB for 3D models)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 50MB.');
      }

      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `${STORAGE_PATH}/${fileName}`);

      // Upload to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            setError('Failed to upload 3D model');
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              // Generate unique window ID
              const windowId = `model-window-${timestamp}`;
              
              // Save model data to user's subcollection
              await addDoc(collection(db, 'users', user.uid, 'desktop3DModels'), {
                name: file.name,
                url: downloadURL,
                position,
                windowId,
                createdAt: new Date(),
                storageRef: fileName,
              });

              resolve();
            } catch (firestoreError) {
              console.error('Firestore error:', firestoreError);
              setError('Failed to save 3D model data');
              reject(firestoreError);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error uploading 3D model:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload 3D model');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const updateModelPosition = useCallback((modelId: string, position: { x: number; y: number }) => {
    const user = auth.currentUser;
    if (!user) return;

    // Update local state immediately for responsive UI
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, position } : model
    ));
    
    // Debounced update to Firestore
    debouncedUpdatePosition(user.uid, modelId, position);
  }, []);

  const deleteModel = useCallback(async (modelId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const model = models.find(m => m.id === modelId);
      if (!model) return;

      // Delete from user's subcollection
      await deleteDoc(doc(db, 'users', user.uid, 'desktop3DModels', modelId));
      
      // Delete from Storage
      try {
        const storageRef = ref(storage, `${STORAGE_PATH}/${model.storageRef}`);
        await deleteObject(storageRef);
      } catch (storageError) {
        console.warn('Storage deletion failed (file may not exist):', storageError);
      }
      
    } catch (error) {
      console.error('Error deleting 3D model:', error);
      setError('Failed to delete 3D model');
    }
  }, [models]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    models,
    uploading,
    uploadProgress,
    uploadModel,
    updateModelPosition,
    deleteModel,
    error,
  };
};
