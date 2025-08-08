import React, { CSSProperties } from 'react';

interface ElaborateBorderProps {
  children: React.ReactNode;
  theme?: 'medieval' | 'gothic' | 'renaissance' | 'celtic';
  size?: 'small' | 'medium' | 'large';
  ornamentLevel?: 'minimal' | 'decorative' | 'elaborate';
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export const ElaborateBorder: React.FC<ElaborateBorderProps> = ({
  children,
  theme = 'medieval',
  size = 'medium',
  ornamentLevel = 'decorative',
  className = '',
  style = {},
  onClick
}) => {
  const themes = {
    medieval: {
      primary: '#8B4513',
      secondary: '#DAA520',
      accent: '#CD853F',
      light: '#F5DEB3',
      dark: '#654321'
    },
    gothic: {
      primary: '#2F2F2F',
      secondary: '#FFD700',
      accent: '#8B0000',
      light: '#D3D3D3',
      dark: '#000000'
    },
    renaissance: {
      primary: '#B8860B',
      secondary: '#FF6347',
      accent: '#4169E1',
      light: '#FFFACD',
      dark: '#8B4513'
    },
    celtic: {
      primary: '#228B22',
      secondary: '#FFD700',
      accent: '#4169E1',
      light: '#F0FFF0',
      dark: '#006400'
    }
  };

  const sizes = {
    small: { border: 8, corner: 12, font: '8px' },
    medium: { border: 12, corner: 16, font: '10px' },
    large: { border: 16, corner: 20, font: '12px' }
  };

  const currentTheme = themes[theme];
  const currentSize = sizes[size];

  const getCornerOrnament = (position: 'tl' | 'tr' | 'bl' | 'br') => {
    const ornaments = {
      minimal: {
        tl: '◢', tr: '◣', bl: '◥', br: '◤'
      },
      decorative: {
        tl: '❈', tr: '❋', bl: '❦', br: '❧'
      },
      elaborate: {
        tl: '⚜', tr: '❃', bl: '✠', br: '◊'
      }
    };

    const positions = {
      tl: { top: '-4px', left: '-4px' },
      tr: { top: '-4px', right: '-4px' },
      bl: { bottom: '-4px', left: '-4px' },
      br: { bottom: '-4px', right: '-4px' }
    };

    return (
      <div
        style={{
          position: 'absolute',
          ...positions[position],
          width: `${currentSize.corner}px`,
          height: `${currentSize.corner}px`,
          background: `radial-gradient(circle, ${currentTheme.secondary} 0%, ${currentTheme.primary} 70%, ${currentTheme.dark} 100%)`,
          border: `2px solid ${currentTheme.dark}`,
          borderRadius: ornamentLevel === 'elaborate' ? '50%' : '20%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: currentSize.font,
          color: currentTheme.light,
          fontFamily: "'Jacquard 12', monospace",
          fontWeight: 'bold',
          textShadow: `1px 1px 0px ${currentTheme.dark}`,
          boxShadow: `inset 1px 1px 0px ${currentTheme.light}, inset -1px -1px 0px ${currentTheme.dark}`,
          zIndex: 10,
        }}
      >
        {ornaments[ornamentLevel][position]}
      </div>
    );
  };

  const getEdgeDecoration = (edge: 'top' | 'right' | 'bottom' | 'left') => {
    const edgeStyles = {
      top: {
        position: 'absolute' as const,
        top: '0px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '4px',
        background: `linear-gradient(90deg, transparent 0%, ${currentTheme.secondary} 20%, ${currentTheme.primary} 50%, ${currentTheme.secondary} 80%, transparent 100%)`,
        borderRadius: '2px'
      },
      bottom: {
        position: 'absolute' as const,
        bottom: '0px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '4px',
        background: `linear-gradient(90deg, transparent 0%, ${currentTheme.secondary} 20%, ${currentTheme.primary} 50%, ${currentTheme.secondary} 80%, transparent 100%)`,
        borderRadius: '2px'
      },
      left: {
        position: 'absolute' as const,
        left: '0px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '4px',
        height: '60%',
        background: `linear-gradient(180deg, transparent 0%, ${currentTheme.secondary} 20%, ${currentTheme.primary} 50%, ${currentTheme.secondary} 80%, transparent 100%)`,
        borderRadius: '2px'
      },
      right: {
        position: 'absolute' as const,
        right: '0px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '4px',
        height: '60%',
        background: `linear-gradient(180deg, transparent 0%, ${currentTheme.secondary} 20%, ${currentTheme.primary} 50%, ${currentTheme.secondary} 80%, transparent 100%)`,
        borderRadius: '2px'
      }
    };

    return <div style={edgeStyles[edge]} />;
  };

  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    minWidth: `${currentSize.border * 4}px`,
    minHeight: `${currentSize.border * 4}px`,
    cursor: onClick ? 'pointer' : undefined,
    ...style,
  };

  const outerBorderStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${currentTheme.light} 0%, ${currentTheme.primary} 50%, ${currentTheme.dark} 100%)`,
    border: `3px solid ${currentTheme.dark}`,
    borderRadius: '4px',
  };

  const innerBorderStyle: CSSProperties = {
    position: 'absolute',
    top: '6px',
    left: '6px',
    right: '6px',
    bottom: '6px',
    background: '#c0c0c0',
    border: `2px solid`,
    borderColor: `#ffffff #808080 #808080 #ffffff`,
    borderRadius: '2px',
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    padding: `${currentSize.border}px`,
    margin: `${currentSize.border + 4}px`,
    zIndex: 1,
    fontFamily: "'Pixelify Sans', monospace",
    fontSize: '11px',
  };

  return (
    <div
      className={className}
      onClick={onClick}
      style={containerStyle}
    >
      {/* Outer ornate border */}
      <div style={outerBorderStyle} />
      
      {/* Inner Windows 95 border */}
      <div style={innerBorderStyle} />
      
      {/* Edge decorations */}
      {ornamentLevel === 'elaborate' && (
        <>
          {getEdgeDecoration('top')}
          {getEdgeDecoration('right')}
          {getEdgeDecoration('bottom')}
          {getEdgeDecoration('left')}
        </>
      )}
      
      {/* Corner ornaments */}
      {getCornerOrnament('tl')}
      {getCornerOrnament('tr')}
      {getCornerOrnament('bl')}
      {getCornerOrnament('br')}
      
      {/* Content */}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};
