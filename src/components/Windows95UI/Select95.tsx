import React from 'react';
import { colors } from '../../styles/colors';

interface Select95Props extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select95: React.FC<Select95Props> = ({ children, style = {}, ...props }) => (
  <select
    style={{
      background: colors.textLight,
      border: `2px solid`,
      borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`,
      padding: '4px',
      fontFamily: "'Pixelify Sans', monospace",
      fontSize: '12px',
      outline: 'none',
      ...style
    }}
    {...props}
  >
    {children}
  </select>
);