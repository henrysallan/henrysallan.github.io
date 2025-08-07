import React, { CSSProperties } from 'react';
import { colors } from '../../styles/colors';

interface Input95Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: CSSProperties;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input95: React.FC<Input95Props> = ({ 
  value, 
  onChange, 
  placeholder, 
  style = {}, 
  onKeyPress 
}) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    onKeyPress={onKeyPress}
    placeholder={placeholder}
    style={{
      background: colors.textLight,
      border: `2px solid`,
      borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`,
      padding: '2px 4px',
      fontFamily: '"MS Sans Serif", Geneva, sans-serif',
      fontSize: '11px',
      outline: 'none',
      ...style
    }}
  />
);