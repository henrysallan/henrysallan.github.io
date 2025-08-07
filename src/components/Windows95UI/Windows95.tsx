import React, { CSSProperties } from 'react';
import { colors } from '../../styles/colors';

interface Window95Props {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  style?: CSSProperties;
}

export const Window95: React.FC<Window95Props> = ({ 
  title, 
  children, 
  onClose, 
  style = {} 
}) => (
  <div className="win95-window" style={{
    background: colors.windowBg,
    border: `1px solid ${colors.borderDark}`, // Softer border
    borderRadius: '8px', // Rounded corners
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)', // Modern shadow
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"MS Sans Serif", Geneva, sans-serif',
    fontSize: '12px',
    overflow: 'hidden', // Ensures children conform to rounded corners
    ...style
  }}>
    <div className="no-select" style={{
      background: colors.windowHeader, // Solid color, no gradient
      color: colors.textLight,
      padding: '4px 8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'move'
    }}>
      <span style={{ fontWeight: 'bold' }}>{title}</span>
      {onClose && (
        <button 
          onClick={onClose}
          style={{
            background: colors.button,
            border: `1px solid ${colors.borderDark}`,
            borderRadius: '4px',
            color: colors.text,
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontFamily: 'Arial',
            lineHeight: '1'
          }}
        >
          ×
        </button>
      )}
    </div>
    <div style={{
      flex: 1,
      padding: '8px',
      overflow: 'auto'
    }}>
      {children}
    </div>
  </div>
);