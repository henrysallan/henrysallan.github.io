import React, { useEffect, useState } from 'react';
import { DraggableWindow } from './components/Layout/DraggableWindow';
import { Taskbar } from './components/Layout/Taskbar';
import { SearchBar } from './components/SearchBar';
import { RSSFeed } from './components/RSSFeed';
import { Notes } from './components/Notes';
import { AILauncher } from './components/AILauncher';
import { Bookmarks } from './components/Bookmarks';
import { useWindowStore } from './store/useWindowStore';
import { WindowType } from './types';
import { colors } from './styles/colors';
import './styles/windows95.css';

const componentMap: Record<WindowType, React.ComponentType> = {
  search: SearchBar,
  rss: RSSFeed,
  notes: Notes,
  ai: AILauncher,
  bookmarks: Bookmarks
};

const desktopIcons: { type: WindowType; icon: string; label: string }[] = [
  { type: 'search', icon: '🔍', label: 'Search' },
  { type: 'rss', icon: '📰', label: 'RSS Feed' },
  { type: 'notes', icon: '📝', label: 'Notes' }
];

function App() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  const {
    windows,
    activeWindow,
    addWindow,
    removeWindow,
    updateWindowPosition,
    focusWindow,
    saveLayout,
    loadLayout,
    clearAll
  } = useWindowStore();

  useEffect(() => {
    loadLayout();
  }, [loadLayout]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveLayout = () => {
    saveLayout();
    alert('Layout saved successfully!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.desktop,
      fontFamily: '"MS Sans Serif", Geneva, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Desktop Icons */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {desktopIcons.map(({ type, icon, label }) => (
          <div
            key={type}
            style={{
              textAlign: 'center',
              color: colors.textLight,
              cursor: 'pointer'
            }}
            onDoubleClick={() => addWindow(type)}
          >
            <div style={{ fontSize: '32px' }}>{icon}</div>
            <div style={{ fontSize: '11px', textShadow: '1px 1px 1px black' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Windows */}
      {windows.map((window) => {
        const Component = componentMap[window.type];
        return (
          <div
            key={window.id}
            onClick={() => focusWindow(window.id)}
            style={{ zIndex: activeWindow === window.id ? 1000 : 100 }}
          >
            <DraggableWindow
              id={window.id}
              title={window.title}
              position={window.position}
              onPositionChange={updateWindowPosition}
              onClose={removeWindow}
              zIndex={activeWindow === window.id ? 1000 : 100}
            >
              <div style={{ width: window.size.width, height: window.size.height }}>
                <Component />
              </div>
            </DraggableWindow>
          </div>
        );
      })}

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        activeWindow={activeWindow}
        onAddWindow={addWindow}
        onFocusWindow={focusWindow}
        onSaveLayout={handleSaveLayout}
        onClearAll={clearAll}
        currentTime={currentTime}
      />
    </div>
  );
}

export default App;