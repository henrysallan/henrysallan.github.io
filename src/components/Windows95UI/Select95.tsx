import React, { CSSProperties } from 'react';
import { colors } from '../../styles/colors';

interface Select95Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  style?: CSSProperties;
}

export const Select95: React.FC<Select95Props> = ({ 
  value, 
  onChange, 
  children, 
  style = {} 
}) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      background: colors.textLight,
      border: `2px solid`,
      borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`,
      padding: '2px',
      fontFamily: '"MS Sans Serif", Geneva, sans-serif',
      fontSize: '11px',
      outline: 'none',
      ...style
    }}
  >
    {children}
  </select>
);