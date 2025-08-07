import React from 'react';
import { Button95 } from '../Windows95UI';
import { colors } from '../../styles/colors';
import { WindowState, WindowType } from '../../types';

interface TaskbarProps {
  windows: WindowState[];
  activeWindow: string | null;
  onAddWindow: (type: WindowType) => void;
  onFocusWindow: (id: string) => void;
  onSaveLayout: () => void;
  onClearAll: () => void;
  currentTime: string;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindow,
  onAddWindow,
  onFocusWindow,
  onSaveLayout,
  onClearAll,
  currentTime
}) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '28px',
      background: colors.windowBg,
      borderTop: `2px solid ${colors.borderLight}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 2px',
      gap: '2px',
      zIndex: 2000
    }}>
      {/* Start Button */}
      <Button95 style={{ 
        fontWeight: 'bold', 
        padding: '2px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span style={{ 
          display: 'inline-block',
          width: '16px',
          height: '14px',
          background: `linear-gradient(to right, #ff0000 25%, #00ff00 25% 50%, #0000ff 50% 75%, #ffff00 75%)`,
          marginRight: '2px'
        }}></span>
        Start
      </Button95>

      <div style={{ 
        width: '1px', 
        height: '20px', 
        background: colors.borderDark,
        margin: '0 2px'
      }} />

      {/* Quick Launch */}
      <Button95 onClick={() => onAddWindow('search')} style={{ padding: '2px 6px', fontSize: '14px' }}>🔍</Button95>
      <Button95 onClick={() => onAddWindow('rss')} style={{ padding: '2px 6px', fontSize: '14px' }}>📰</Button95>
      <Button95 onClick={() => onAddWindow('notes')} style={{ padding: '2px 6px', fontSize: '14px' }}>📝</Button95>
      <Button95 onClick={() => onAddWindow('ai')} style={{ padding: '2px 6px', fontSize: '14px' }}>🤖</Button95>
      <Button95 onClick={() => onAddWindow('bookmarks')} style={{ padding: '2px 6px', fontSize: '14px' }}>🔖</Button95>

      <div style={{ 
        width: '1px', 
        height: '20px', 
        background: colors.borderDark,
        margin: '0 4px'
      }} />

      {/* Window List */}
      <div style={{ flex: 1, display: 'flex', gap: '2px' }}>
        {windows.map(w => (
          <Button95 
            key={w.id}
            onClick={() => onFocusWindow(w.id)}
            style={{ 
              padding: '2px 8px',
              maxWidth: '150px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              background: activeWindow === w.id ? '#dfdfdf' : colors.button
            }}
          >
            {w.title}
          </Button95>
        ))}
      </div>

      {/* System Tray */}
      <Button95 onClick={onSaveLayout} style={{ padding: '2px 6px' }}>💾</Button95>
      <Button95 onClick={onClearAll} style={{ padding: '2px 6px' }}>🗑️</Button95>
      
      {/* Clock */}
      <div style={{ 
        padding: '2px 8px',
        border: `2px solid`,
        borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`,
        background: colors.windowBg,
        fontSize: '11px',
        minWidth: '80px',
        textAlign: 'center'
      }}>
        {currentTime}
      </div>
    </div>
  );
};