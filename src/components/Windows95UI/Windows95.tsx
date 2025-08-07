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
    border: `2px solid ${colors.borderLight}`,
    borderRightColor: colors.borderDark,
    borderBottomColor: colors.borderDark,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"MS Sans Serif", Geneva, sans-serif',
    fontSize: '11px',
    ...style
  }}>
    <div className="no-select" style={{
      background: `linear-gradient(to right, ${colors.windowHeader}, ${colors.windowHeaderActive})`,
      color: colors.textLight,
      padding: '2px 4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'move'
    }}>
      <span style={{ fontWeight: 'bold', fontSize: '11px' }}>{title}</span>
      <div style={{ display: 'flex', gap: '2px' }}>
        {onClose && (
          <button 
            onClick={onClose}
            className="win95-button"
            style={{
              background: colors.button,
              border: `1px solid`,
              borderColor: `${colors.borderLight} ${colors.borderDark} ${colors.borderDark} ${colors.borderLight}`,
              padding: '0 6px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'Arial',
              lineHeight: '16px'
            }}
          >
            ×
          </button>
        )}
      </div>
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