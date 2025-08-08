import React, { CSSProperties } from 'react';
import { WithOrnateCorners } from '../UI/OrnateCorners';
import { Window95 } from '../Windows95UI/Windows95';

interface MedievalWindowProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  style?: CSSProperties;
  cornerStyle?: 'fleurDeLis' | 'celtic' | 'gothic' | 'baroque' | 'runes';
  cornerSize?: number;
  cornerColor?: string;
  theme?: 'gold' | 'silver' | 'bronze' | 'emerald' | 'ruby';
}

export const MedievalWindow: React.FC<MedievalWindowProps> = ({
  title,
  children,
  onClose,
  style = {},
  cornerStyle = 'fleurDeLis',
  cornerSize = 20,
  cornerColor,
  theme = 'gold'
}) => {
  const themeColors = {
    gold: '#DAA520',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
    emerald: '#50C878',
    ruby: '#AA0000'
  };

  const finalCornerColor = cornerColor || themeColors[theme];

  return (
    <WithOrnateCorners
      cornerStyle={cornerStyle}
      cornerSize={cornerSize}
      cornerColor={finalCornerColor}
    >
      <Window95
        title={title}
        onClose={onClose}
        style={{
          minWidth: '300px',
          minHeight: '200px',
          ...style
        }}
      >
        {children}
      </Window95>
    </WithOrnateCorners>
  );
};
