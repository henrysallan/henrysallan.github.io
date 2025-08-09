import { useState, useCallback, useRef } from 'react';

interface SyncState {
  isActive: boolean;
  pendingOperations: number;
}

export const useSyncStatus = () => {
  const [syncState, setSyncState] = useState<SyncState>({
    isActive: false,
    pendingOperations: 0
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startSync = useCallback(() => {
    setSyncState(prev => ({
      isActive: true,
      pendingOperations: prev.pendingOperations + 1
    }));

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const endSync = useCallback(() => {
    setSyncState(prev => {
      const newPendingOperations = Math.max(0, prev.pendingOperations - 1);
      
      // If no more pending operations, schedule to hide the sync indicator
      if (newPendingOperations === 0) {
        timeoutRef.current = setTimeout(() => {
          setSyncState(current => ({
            ...current,
            isActive: false
          }));
        }, 100); // Small delay to allow the completion animation
      }

      return {
        isActive: prev.isActive,
        pendingOperations: newPendingOperations
      };
    });
  }, []);

  return {
    isActive: syncState.isActive,
    startSync,
    endSync
  };
};

export default useSyncStatus;
