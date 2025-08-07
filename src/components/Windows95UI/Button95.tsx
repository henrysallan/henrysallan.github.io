import React, { useState, CSSProperties } from 'react';
import { colors } from '../../styles/colors';

interface Button95Props {
  children: React.ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
  active?: boolean;
}

export const Button95: React.FC<Button95Props> = ({ 
  children, 
  onClick, 
  style = {}, 
  disabled = false,
  active = false 
}) => {
  const [pressed, setPressed] = useState(false);
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        background: disabled ? colors.border : colors.button,
        border: `2px solid`,
        borderColor: pressed || active
          ? `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`
          : `${colors.borderLight} ${colors.borderDark} ${colors.borderDark} ${colors.borderLight}`,
        padding: '4px 12px',
        fontFamily: '"MS Sans Serif", Geneva, sans-serif',
        fontSize: '11px',
        cursor: disabled ? 'default' : 'pointer',
        userSelect: 'none',
        color: disabled ? '#808080' : colors.text,
        ...style
      }}
    >
      {children}
    </button>
  );
};