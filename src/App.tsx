import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './config/firebase';
import { DraggableWindow } from './components/Layout/DraggableWindow';
import { Taskbar } from './components/Layout/Taskbar';
import { SearchBar } from './components/SearchBar';
import { RSSFeed } from './components/RSSFeed';
import { Notes } from './components/Notes';
import { AILauncher } from './components/AILauncher';
import { Bookmarks } from './components/Bookmarks';
import { Calendar } from './components/Calendar';
import { DesktopImages } from './components/DesktopImages';
import { Desktop3DModels } from './components/Desktop3DModels';
import { UIDemo } from './components/UIDemo';
import { Login } from './components/Login';
import { SyncProvider } from './contexts/SyncContext';
import { useWindowStore } from './store/useWindowStore';
import { WindowType } from './types/index';
import { colors } from './styles/colors';

const componentMap: Record<WindowType, React.ComponentType> = {
  search: SearchBar,
  rss: RSSFeed,
  notes: Notes,
  ai: AILauncher,
  bookmarks: Bookmarks,
  calendar: Calendar,
  uidemo: UIDemo
};

const AppContent: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    windows,
    activeWindow,
    addWindow,
    removeWindow,
    updateWindowPosition,
    updateWindowSize,
    focusWindow,
    saveLayout,
    loadLayout,
    clearAll,
    setUserId
  } = useWindowStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserId(currentUser?.uid || null);
      setIsLoading(false);
      if (currentUser) {
        loadLayout();
      }
    });
    return () => unsubscribe();
  }, [loadLayout, setUserId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const handleLogout = async () => {
    await signOut(auth);
  };

  if (isLoading) {
    return <div style={{ 
      background: colors.desktop, 
      height: '100vh', 
      color: '#000000', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      fontFamily: "'Pixelify Sans', monospace"
    }}>
      Loading...
    </div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.desktop,
      fontFamily: "'Pixelify Sans', monospace",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {windows.map((window) => {
        const Component = componentMap[window.type];
        return (
          <div
            key={window.id}
            onClick={() => focusWindow(window.id)}
          >
            <DraggableWindow
              id={window.id}
              title={window.title}
              position={window.position}
              size={window.size}
              onPositionChange={updateWindowPosition}
              onSizeChange={updateWindowSize}
              onClose={() => removeWindow(window.id)}
              zIndex={activeWindow === window.id ? 1000 : 100}
            >
              <Component />
            </DraggableWindow>
          </div>
        );
      })}

      {/* Desktop Images - draggable images directly on desktop */}
      <DesktopImages />

      {/* Desktop 3D Models - draggable 3D viewers directly on desktop */}
      <Desktop3DModels />

      <Taskbar
        windows={windows}
        activeWindow={activeWindow}
        onAddWindow={addWindow}
        onFocusWindow={focusWindow}
        onSaveLayout={saveLayout}
        onClearAll={clearAll}
        onLogout={handleLogout}
        currentTime={currentTime}
      />
    </div>
  );
};

function App() {
  return (
    <SyncProvider>
      <AppContent />
    </SyncProvider>
  );
}

export default App;