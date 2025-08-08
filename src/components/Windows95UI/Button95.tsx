import React, { useState } from 'react';
import { colors } from '../../styles/colors';

interface Button95Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
}

export const Button95: React.FC<Button95Props> = ({ 
  children, 
  style = {}, 
  disabled = false,
  active = false,
  ...props 
}) => {
  const [pressed, setPressed] = useState(false);
  
  return (
    <button
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        background: colors.button,
        border: `2px solid`,
        borderColor: pressed || active
          ? `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`
          : `${colors.borderLight} ${colors.borderDark} ${colors.borderDark} ${colors.borderLight}`,
        padding: '4px 8px',
        fontFamily: "'MS Sans Serif', 'Pixelated MS Sans Serif', Arial, sans-serif",
        fontSize: '12px',
        cursor: 'pointer',
        userSelect: 'none',
        color: disabled ? '#808080' : colors.text,
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
};