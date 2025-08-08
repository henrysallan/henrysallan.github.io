import React from 'react';
import { Button95 } from '../Windows95UI';
import { colors } from '../../styles/colors';
import { WindowState, WindowType } from '../../types/index';

interface TaskbarProps {
  windows: WindowState[];
  activeWindow: string | null;
  onAddWindow: (type: WindowType) => void;
  onFocusWindow: (id: string) => void;
  onSaveLayout: () => void;
  onClearAll: () => void;
  onLogout: () => void;
  currentTime: string;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindow,
  onAddWindow,
  onFocusWindow,
  onSaveLayout,
  onClearAll,
  onLogout,
  currentTime
}) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '32px',
      background: colors.windowBg,
      borderTop: `2px solid ${colors.borderLight}`,
      display: 'flex',
      alignItems: 'center',
      padding: '2px',
      gap: '4px',
      zIndex: 2000
    }}>
      <Button95 onClick={() => onAddWindow('search')} title="Search">🔍</Button95>
      <Button95 onClick={() => onAddWindow('rss')} title="RSS Feed">📰</Button95>
      <Button95 onClick={() => onAddWindow('notes')} title="Notes">📝</Button95>
      <Button95 onClick={() => onAddWindow('ai')} title="AI Launcher">🤖</Button95>
      <Button95 onClick={() => onAddWindow('bookmarks')} title="Bookmarks">🔖</Button95>
      <Button95 onClick={() => onAddWindow('calendar')} title="Calendar">📅</Button95>
      <Button95 onClick={() => onAddWindow('uidemo')} title="UI Demo">🎨</Button95>

      <div style={{ width: '2px', height: '28px', borderLeft: `1px solid ${colors.borderDark}`, borderRight: `1px solid ${colors.borderLight}`, margin: '0 2px' }} />

      <div style={{ flex: 1, display: 'flex', gap: '2px', overflow: 'hidden' }}>
        {windows.map(w => (
          <Button95 
            key={w.id}
            onClick={() => onFocusWindow(w.id)}
            active={activeWindow === w.id}
            style={{ flexShrink: 1, minWidth: '60px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {w.title}
          </Button95>
        ))}
      </div>

      <div style={{ 
        padding: '2px 8px', 
        border: `2px solid`, 
        borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`, 
        fontSize: '11px', 
        fontFamily: "'Pixelify Sans', monospace",
        color: '#000000',
        backgroundColor: '#c0c0c0',
        minWidth: '80px', 
        textAlign: 'center' 
      }}>
        {currentTime}
      </div>
       <Button95 onClick={onSaveLayout} title="Save Layout">💾</Button95>
      <Button95 onClick={onClearAll} title="Clear All Windows">🗑️</Button95>
      <Button95 onClick={onLogout} title="Logout">Logout</Button95>
    </div>
  );
};