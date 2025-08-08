import React, { CSSProperties } from 'react';

interface ScalableBorderProps {
  children: React.ReactNode;
  borderStyle?: 'raised' | 'inset' | 'flat';
  borderWidth?: number;
  cornerRadius?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export const ScalableBorder: React.FC<ScalableBorderProps> = ({
  children,
  borderStyle = 'raised',
  borderWidth = 2,
  cornerRadius = 0,
  className = '',
  style = {},
  onClick
}) => {
  const colors = {
    light: '#ffffff',
    medium: '#c0c0c0',
    dark: '#808080',
    black: '#000000'
  };

  const getBorderColors = () => {
    switch (borderStyle) {
      case 'raised':
        return {
          top: colors.light,
          left: colors.light,
          right: colors.black,
          bottom: colors.black,
          topInner: borderWidth > 1 ? colors.medium : colors.light,
          leftInner: borderWidth > 1 ? colors.medium : colors.light,
          rightInner: borderWidth > 1 ? colors.dark : colors.black,
          bottomInner: borderWidth > 1 ? colors.dark : colors.black,
        };
      case 'inset':
        return {
          top: colors.black,
          left: colors.black,
          right: colors.light,
          bottom: colors.light,
          topInner: borderWidth > 1 ? colors.dark : colors.black,
          leftInner: borderWidth > 1 ? colors.dark : colors.black,
          rightInner: borderWidth > 1 ? colors.medium : colors.light,
          bottomInner: borderWidth > 1 ? colors.medium : colors.light,
        };
      case 'flat':
        return {
          top: colors.dark,
          left: colors.dark,
          right: colors.dark,
          bottom: colors.dark,
          topInner: colors.dark,
          leftInner: colors.dark,
          rightInner: colors.dark,
          bottomInner: colors.dark,
        };
      default:
        return {
          top: colors.medium,
          left: colors.medium,
          right: colors.medium,
          bottom: colors.medium,
          topInner: colors.medium,
          leftInner: colors.medium,
          rightInner: colors.medium,
          bottomInner: colors.medium,
        };
    }
  };

  const borderColors = getBorderColors();

  // For complex borders with multiple layers
  if (borderWidth > 2) {
    return (
      <div
        className={className}
        onClick={onClick}
        style={{
          position: 'relative',
          backgroundColor: colors.medium,
          ...style,
        }}
      >
        {/* Outer border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderStyle: 'solid',
            borderWidth: '1px',
            borderTopColor: borderColors.top,
            borderLeftColor: borderColors.left,
            borderRightColor: borderColors.right,
            borderBottomColor: borderColors.bottom,
            borderRadius: cornerRadius,
          }}
        />
        
        {/* Inner border */}
        <div
          style={{
            position: 'absolute',
            top: '1px',
            left: '1px',
            right: '1px',
            bottom: '1px',
            borderStyle: 'solid',
            borderWidth: `${borderWidth - 1}px`,
            borderTopColor: borderColors.topInner,
            borderLeftColor: borderColors.leftInner,
            borderRightColor: borderColors.rightInner,
            borderBottomColor: borderColors.bottomInner,
            borderRadius: Math.max(0, cornerRadius - 1),
          }}
        />
        
        {/* Content area */}
        <div
          style={{
            position: 'relative',
            margin: `${borderWidth}px`,
            zIndex: 1,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // Simple border for borderWidth <= 2
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        borderStyle: 'solid',
        borderWidth: `${borderWidth}px`,
        borderTopColor: borderColors.top,
        borderLeftColor: borderColors.left,
        borderRightColor: borderColors.right,
        borderBottomColor: borderColors.bottom,
        backgroundColor: colors.medium,
        borderRadius: cornerRadius,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
