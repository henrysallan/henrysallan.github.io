import React, { CSSProperties } from 'react';

export type BorderStyle = 'raised' | 'inset' | 'flat';
export type BorderSize = 1 | 2 | 3 | 4;

interface BorderBoxProps {
  children: React.ReactNode;
  style?: BorderStyle;
  size?: BorderSize;
  className?: string;
  customStyle?: CSSProperties;
  onClick?: () => void;
}

export const BorderBox: React.FC<BorderBoxProps> = ({
  children,
  style = 'raised',
  size = 2,
  className = '',
  customStyle = {},
  onClick
}) => {
  const getBorderStyles = (): CSSProperties => {
    const lightColor = '#ffffff';
    const mediumColor = '#c0c0c0';
    const darkColor = '#808080';
    const blackColor = '#000000';

    switch (style) {
      case 'raised':
        return {
          borderStyle: 'solid',
          borderWidth: `${size}px`,
          borderTopColor: lightColor,
          borderLeftColor: lightColor,
          borderRightColor: size > 1 ? blackColor : darkColor,
          borderBottomColor: size > 1 ? blackColor : darkColor,
          backgroundColor: mediumColor,
        };
      
      case 'inset':
        return {
          borderStyle: 'solid',
          borderWidth: `${size}px`,
          borderTopColor: size > 1 ? blackColor : darkColor,
          borderLeftColor: size > 1 ? blackColor : darkColor,
          borderRightColor: lightColor,
          borderBottomColor: lightColor,
          backgroundColor: mediumColor,
        };
      
      case 'flat':
        return {
          borderStyle: 'solid',
          borderWidth: `${size}px`,
          borderColor: darkColor,
          backgroundColor: mediumColor,
        };
      
      default:
        return {};
    }
  };

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        ...getBorderStyles(),
        ...customStyle,
      }}
    >
      {children}
    </div>
  );
};
