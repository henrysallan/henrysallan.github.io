import React, { CSSProperties } from 'react';

interface MedievalBorderProps {
  children: React.ReactNode;
  borderStyle?: 'raised' | 'inset' | 'window' | 'ornate';
  cornerStyle?: 'simple' | 'gothic' | 'carved' | 'jeweled' | 'scrollwork';
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
}

export const MedievalBorder: React.FC<MedievalBorderProps> = ({
  children,
  borderStyle = 'raised',
  cornerStyle = 'gothic',
  className = '',
  style = {},
  onClick,
  disabled = false
}) => {
  const colors = {
    light: '#ffffff',
    medium: '#c0c0c0',
    dark: '#808080',
    black: '#000000',
    gold: '#ffd700',
    bronze: '#cd7f32',
    silver: '#c0c0c0'
  };

  const getBorderConfig = () => {
    switch (borderStyle) {
      case 'raised':
        return {
          outerTop: colors.light,
          outerLeft: colors.light,
          outerRight: colors.black,
          outerBottom: colors.black,
          innerTop: colors.medium,
          innerLeft: colors.medium,
          innerRight: colors.dark,
          innerBottom: colors.dark,
          background: colors.medium,
        };
      case 'inset':
        return {
          outerTop: colors.black,
          outerLeft: colors.black,
          outerRight: colors.light,
          outerBottom: colors.light,
          innerTop: colors.dark,
          innerLeft: colors.dark,
          innerRight: colors.medium,
          innerBottom: colors.medium,
          background: colors.medium,
        };
      case 'ornate':
        return {
          outerTop: colors.gold,
          outerLeft: colors.gold,
          outerRight: colors.bronze,
          outerBottom: colors.bronze,
          innerTop: colors.light,
          innerLeft: colors.light,
          innerRight: colors.dark,
          innerBottom: colors.dark,
          background: colors.medium,
        };
      default:
        return {
          outerTop: colors.light,
          outerLeft: colors.light,
          outerRight: colors.black,
          outerBottom: colors.black,
          innerTop: colors.medium,
          innerLeft: colors.medium,
          innerRight: colors.dark,
          innerBottom: colors.dark,
          background: colors.medium,
        };
    }
  };

  const getCornerDecoration = (position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => {
    const baseStyle: CSSProperties = {
      position: 'absolute',
      width: '16px',
      height: '16px',
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Jacquard 12', monospace",
      fontWeight: 'bold',
      zIndex: 10,
      textShadow: '1px 1px 0px rgba(0,0,0,0.3)',
    };

    const positionStyles = {
      topLeft: { top: '-2px', left: '-2px' },
      topRight: { top: '-2px', right: '-2px' },
      bottomLeft: { bottom: '-2px', left: '-2px' },
      bottomRight: { bottom: '-2px', right: '-2px' }
    };

    let symbol = '';
    let color = colors.gold;

    switch (cornerStyle) {
      case 'gothic':
        const gothicSymbols = ['⚜', '❋', '✠', '◊'];
        symbol = gothicSymbols[['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].indexOf(position)];
        color = borderStyle === 'ornate' ? colors.gold : colors.dark;
        break;
      case 'carved':
        const carvedSymbols = ['◢', '◣', '◥', '◤'];
        symbol = carvedSymbols[['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].indexOf(position)];
        color = colors.dark;
        break;
      case 'jeweled':
        const jeweledSymbols = ['◆', '◇', '♦', '❖'];
        symbol = jeweledSymbols[['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].indexOf(position)];
        color = borderStyle === 'ornate' ? colors.gold : colors.bronze;
        break;
      case 'scrollwork':
        const scrollSymbols = ['❦', '❧', '❦', '❧'];
        symbol = scrollSymbols[['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].indexOf(position)];
        color = colors.bronze;
        break;
      default: // simple
        symbol = '●';
        color = colors.dark;
        break;
    }

    return (
      <div
        style={{
          ...baseStyle,
          ...positionStyles[position],
          color,
          background: borderStyle === 'ornate' ? 
            `radial-gradient(circle, ${colors.light} 0%, ${colors.medium} 100%)` : 
            colors.medium,
          borderRadius: '50%',
          border: `1px solid ${colors.dark}`,
        }}
      >
        {symbol}
      </div>
    );
  };

  const config = getBorderConfig();

  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    minWidth: '40px',
    minHeight: '40px',
    cursor: onClick ? 'pointer' : undefined,
    ...style,
  };

  const outerBorderStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderStyle: 'solid',
    borderWidth: '2px',
    borderTopColor: config.outerTop,
    borderLeftColor: config.outerLeft,
    borderRightColor: config.outerRight,
    borderBottomColor: config.outerBottom,
    backgroundColor: config.background,
  };

  const innerBorderStyle: CSSProperties = {
    position: 'absolute',
    top: '2px',
    left: '2px',
    right: '2px',
    bottom: '2px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderTopColor: config.innerTop,
    borderLeftColor: config.innerLeft,
    borderRightColor: config.innerRight,
    borderBottomColor: config.innerBottom,
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    padding: '8px 12px',
    margin: '6px',
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
      {/* Outer border */}
      <div style={outerBorderStyle} />
      
      {/* Inner border */}
      <div style={innerBorderStyle} />
      
      {/* Corner decorations */}
      {getCornerDecoration('topLeft')}
      {getCornerDecoration('topRight')}
      {getCornerDecoration('bottomLeft')}
      {getCornerDecoration('bottomRight')}
      
      {/* Content */}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};
