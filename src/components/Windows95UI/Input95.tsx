import React from 'react';
import { colors } from '../../styles/colors';

interface Input95Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input95: React.FC<Input95Props> = ({ style = {}, ...props }) => (
  <input
    type="text"
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
  />
);