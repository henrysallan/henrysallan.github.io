import React, { useState } from 'react';
import { colors } from '../../styles/colors';

// By extending React.ButtonHTMLAttributes, our component accepts all standard button props like `title`, `onClick`, etc.
interface Button95Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
}

export const Button95: React.FC<Button95Props> = ({ 
  children, 
  style = {}, 
  disabled = false,
  active = false,
  ...props // Collect all other props
}) => {
  const [pressed, setPressed] = useState(false);
  
  return (
    <button
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        background: disabled ? colors.button : colors.button, // FIX: Use a valid color
        border: `1px solid`,
        borderColor: pressed || active
          ? `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`
          : `${colors.borderLight} ${colors.borderDark} ${colors.borderDark} ${colors.borderLight}`,
        padding: '4px 8px',
        borderRadius: '4px',
        fontFamily: '"MS Sans Serif", Geneva, sans-serif',
        fontSize: '12px',
        cursor: disabled ? 'default' : 'pointer',
        userSelect: 'none',
        color: disabled ? '#808080' : colors.text,
        ...style
      }}
      {...props} // Spread the collected props onto the button element
    >
      {children}
    </button>
  );
};