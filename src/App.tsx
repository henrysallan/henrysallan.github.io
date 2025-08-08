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
import { Login } from './components/Login';
import { useWindowStore } from './store/useWindowStore';
import { WindowType } from './types';
import { colors } from './styles/colors';

const componentMap: Record<WindowType, React.ComponentType> = {
  search: SearchBar,
  rss: RSSFeed,
  notes: Notes,
  ai: AILauncher,
  bookmarks: Bookmarks
};

function App() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    windows,
    activeWindow,
    addWindow,
    removeWindow,
    updateWindowPosition,
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
    return <div style={{ background: colors.desktop, height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.desktop,
      fontFamily: "'MS Sans Serif', 'Pixelated MS Sans Serif', Arial, sans-serif",
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
              onPositionChange={updateWindowPosition}
              onClose={() => removeWindow(window.id)}
              zIndex={activeWindow === window.id ? 1000 : 100}
            >
              <div style={{ width: window.size.width, height: window.size.height }}>
                <Component />
              </div>
            </DraggableWindow>
          </div>
        );
      })}

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
}

export default App;