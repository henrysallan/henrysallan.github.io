import React, { createContext, useContext, ReactNode } from 'react';
import { useSyncStatus } from '../hooks/useSyncStatus';

interface SyncContextType {
  isActive: boolean;
  startSync: () => void;
  endSync: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const syncStatus = useSyncStatus();

  return (
    <SyncContext.Provider value={syncStatus}>
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
