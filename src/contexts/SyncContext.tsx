import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useSyncStatus } from '../hooks/useSyncStatus';

interface SyncContextType {
  isActive: boolean;
  startSync: () => void;
  endSync: () => void;
  onStorageChange: () => void; // Notify when storage has changed
  storageChangeListeners: Set<() => void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const syncStatus = useSyncStatus();
  const [storageChangeListeners] = useState(() => new Set<() => void>());

  const onStorageChange = () => {
    storageChangeListeners.forEach((listener: () => void) => listener());
  };

  const contextValue = {
    ...syncStatus,
    onStorageChange,
    storageChangeListeners
  };

  return (
    <SyncContext.Provider value={contextValue}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSyncContext = () => {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  return context;
};

export default SyncContext;
