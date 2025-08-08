import React, { CSSProperties } from 'react';

interface OrnateCornerProps {
  style?: 'fleurDeLis' | 'celtic' | 'gothic' | 'baroque' | 'runes';
  size?: number;
  color?: string;
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

export const OrnateCorner: React.FC<OrnateCornerProps> = ({
  style = 'fleurDeLis',
  size = 16,
  color = '#DAA520',
  position
}) => {
  const getSymbol = () => {
    switch (style) {
      case 'fleurDeLis':
        return '⚜';
      case 'celtic':
        return '❋';
      case 'gothic':
        return '✠';
      case 'baroque':
        return '❦';
      case 'runes':
        return 'ᚱ';
      default:
        return '◆';
    }
  };

  const getPositionStyle = (): CSSProperties => {
    const baseOffset = -size / 2;
    switch (position) {
      case 'topLeft':
        return { top: baseOffset, left: baseOffset };
      case 'topRight':
        return { top: baseOffset, right: baseOffset };
      case 'bottomLeft':
        return { bottom: baseOffset, left: baseOffset };
      case 'bottomRight':
        return { bottom: baseOffset, right: baseOffset };
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        ...getPositionStyle(),
        background: `radial-gradient(circle, ${color} 0%, #8B4513 70%, #654321 100%)`,
        border: '2px solid #654321',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.6}px`,
        color: '#F5DEB3',
        fontFamily: "'Jacquard 12', monospace",
        fontWeight: 'bold',
        textShadow: '1px 1px 0px #654321',
        boxShadow: 'inset 1px 1px 0px rgba(245, 222, 179, 0.5), inset -1px -1px 0px rgba(101, 67, 33, 0.8)',
        zIndex: 10,
      }}
    >
      {getSymbol()}
    </div>
  );
};

interface WithOrnateCornersProps {
  children: React.ReactNode;
  cornerStyle?: 'fleurDeLis' | 'celtic' | 'gothic' | 'baroque' | 'runes';
  cornerSize?: number;
  cornerColor?: string;
  showCorners?: boolean[];
  className?: string;
  style?: CSSProperties;
}

export const WithOrnateCorners: React.FC<WithOrnateCornersProps> = ({
  children,
  cornerStyle = 'fleurDeLis',
  cornerSize = 16,
  cornerColor = '#DAA520',
  showCorners = [true, true, true, true],
  className = '',
  style = {}
}) => {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
      
      {showCorners[0] && (
        <OrnateCorner
          style={cornerStyle}
          size={cornerSize}
          color={cornerColor}
          position="topLeft"
        />
      )}
      
      {showCorners[1] && (
        <OrnateCorner
          style={cornerStyle}
          size={cornerSize}
          color={cornerColor}
          position="topRight"
        />
      )}
      
      {showCorners[2] && (
        <OrnateCorner
          style={cornerStyle}
          size={cornerSize}
          color={cornerColor}
          position="bottomLeft"
        />
      )}
      
      {showCorners[3] && (
        <OrnateCorner
          style={cornerStyle}
          size={cornerSize}
          color={cornerColor}
          position="bottomRight"
        />
      )}
    </div>
  );
};
