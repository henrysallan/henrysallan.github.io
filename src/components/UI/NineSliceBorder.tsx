import React, { CSSProperties } from 'react';

interface NineSliceBorderProps {
  children: React.ReactNode;
  borderStyle?: 'raised' | 'inset' | 'window' | 'button' | 'textbox';
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
}

export const NineSliceBorder: React.FC<NineSliceBorderProps> = ({
  children,
  borderStyle = 'raised',
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
    blue: '#0000ff'
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
          borderWidth: 2
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
          borderWidth: 2
        };
      
      case 'window':
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
          borderWidth: 2
        };
      
      case 'button':
        return {
          outerTop: disabled ? colors.dark : colors.light,
          outerLeft: disabled ? colors.dark : colors.light,
          outerRight: disabled ? colors.light : colors.black,
          outerBottom: disabled ? colors.light : colors.black,
          innerTop: disabled ? colors.medium : colors.medium,
          innerLeft: disabled ? colors.medium : colors.medium,
          innerRight: disabled ? colors.medium : colors.dark,
          innerBottom: disabled ? colors.medium : colors.dark,
          background: disabled ? colors.medium : colors.medium,
          borderWidth: 2
        };
      
      case 'textbox':
        return {
          outerTop: colors.black,
          outerLeft: colors.black,
          outerRight: colors.light,
          outerBottom: colors.light,
          innerTop: colors.dark,
          innerLeft: colors.dark,
          innerRight: colors.medium,
          innerBottom: colors.medium,
          background: colors.light,
          borderWidth: 2
        };
      
      default:
        return {
          outerTop: colors.medium,
          outerLeft: colors.medium,
          outerRight: colors.medium,
          outerBottom: colors.medium,
          innerTop: colors.medium,
          innerLeft: colors.medium,
          innerRight: colors.medium,
          innerBottom: colors.medium,
          background: colors.medium,
          borderWidth: 1
        };
    }
  };

  const config = getBorderConfig();

  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    minWidth: config.borderWidth * 4,
    minHeight: config.borderWidth * 4,
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
    borderWidth: '1px',
    borderTopColor: config.outerTop,
    borderLeftColor: config.outerLeft,
    borderRightColor: config.outerRight,
    borderBottomColor: config.outerBottom,
    backgroundColor: config.background,
  };

  const innerBorderStyle: CSSProperties = config.borderWidth > 1 ? {
    position: 'absolute',
    top: '1px',
    left: '1px',
    right: '1px',
    bottom: '1px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderTopColor: config.innerTop,
    borderLeftColor: config.innerLeft,
    borderRightColor: config.innerRight,
    borderBottomColor: config.innerBottom,
  } : {};

  const contentStyle: CSSProperties = {
    position: 'relative',
    padding: borderStyle === 'textbox' ? '2px 4px' : '4px',
    margin: `${config.borderWidth}px`,
    zIndex: 1,
    fontFamily: "'Pixelify Sans', monospace",
    fontSize: '11px',
    color: borderStyle === 'textbox' ? colors.black : undefined,
  };

  return (
    <div
      className={className}
      onClick={onClick}
      style={containerStyle}
    >
      {/* Outer border */}
      <div style={outerBorderStyle} />
      
      {/* Inner border (if borderWidth > 1) */}
      {config.borderWidth > 1 && <div style={innerBorderStyle} />}
      
      {/* Content */}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};
