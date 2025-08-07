import React, { CSSProperties } from 'react';
import { colors } from '../../styles/colors';

interface TextArea95Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  style?: CSSProperties;
}

export const TextArea95: React.FC<TextArea95Props> = ({ 
  value, 
  onChange, 
  placeholder, 
  style = {} 
}) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      background: colors.textLight,
      border: `2px solid`,
      borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`,
      padding: '4px',
      fontFamily: '"MS Sans Serif", Geneva, sans-serif',
      fontSize: '11px',
      resize: 'none',
      outline: 'none',
      ...style
    }}
  />
);