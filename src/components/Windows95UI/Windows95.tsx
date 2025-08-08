import React, { CSSProperties } from 'react';
import { colors } from '../../styles/colors';
import { Button95 } from './Button95';

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
  <div style={{
    background: colors.windowBg,
    border: `2px solid`,
    borderColor: `${colors.borderLight} ${colors.borderDark} ${colors.borderDark} ${colors.borderLight}`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Pixelify Sans', monospace",
    fontSize: '12px',
    ...style
  }}>
    <div style={{
      background: colors.windowHeader,
      color: colors.text,
      padding: '2px 4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'move',
      userSelect: 'none',
      fontFamily: "'Jacquard 12', monospace"
    }}>
      <span style={{ fontWeight: 'bold' }}>{title}</span>
      {onClose && (
        <Button95 
          onClick={onClose}
          style={{
            width: '20px',
            height: '20px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial',
            lineHeight: '1'
          }}
        >
          ×
        </Button95>
      )}
    </div>
    <div style={{
      flex: 1,
      padding: '8px',
      overflow: 'auto',
      color: colors.text
    }}>
      {children}
    </div>
  </div>
);