import React from 'react';
import { colors } from '../../styles/colors';

interface TextArea95Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea95: React.FC<TextArea95Props> = ({ style = {}, ...props }) => (
  <textarea
    style={{
      background: colors.textLight,
      border: `2px solid`,
      borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`,
      padding: '4px',
      fontFamily: "'Jacquard 12', 'MS Sans Serif', monospace",
      fontSize: '12px',
      resize: 'none',
      outline: 'none',
      ...style
    }}
    {...props}
  />
);