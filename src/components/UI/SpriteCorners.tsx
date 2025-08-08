import React, { CSSProperties, useState, useEffect } from 'react';

type CornerStyle = 'fleur-de-lis' | 'gothic' | 'celtic' | 'baroque' | 'runes' | 'carved';
type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface SpriteCornerProps {
  style: CornerStyle;
  position: CornerPosition;
  size?: number;
  className?: string;
  customStyle?: CSSProperties;
}

export const SpriteCorner: React.FC<SpriteCornerProps> = ({
  style,
  position,
  size = 32,
  className = '',
  customStyle = {}
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Dynamic import of the image
        const imageModule = await import(`../../assets/ornaments/corners/${style}/${position}.png`);
        setImageSrc(imageModule.default);
      } catch (error) {
        console.warn(`Failed to load ornament: ${style}/${position}.png`, error);
        setImageSrc(null);
      }
    };

    loadImage();
  }, [style, position]);

  const getPositionStyle = (): CSSProperties => {
    const offset = -size / 2;
    switch (position) {
      case 'top-left':
        return { top: offset, left: offset };
      case 'top-right':
        return { top: offset, right: offset };
      case 'bottom-left':
        return { bottom: offset, left: offset };
      case 'bottom-right':
        return { bottom: offset, right: offset };
    }
  };

  if (!imageSrc) {
    return null; // Don't render if image failed to load
  }

  return (
    <img
      src={imageSrc}
      alt={`${style} ${position} ornament`}
      className={className}
      onLoad={() => setImageLoaded(true)}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        ...getPositionStyle(),
        imageRendering: 'pixelated', // Preserve sharp pixel art
        opacity: imageLoaded ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out',
        zIndex: 10,
        pointerEvents: 'none', // Don't interfere with clicks
        ...customStyle,
      }}
    />
  );
};

interface WithSpriteCornersProps {
  children: React.ReactNode;
  cornerStyle: CornerStyle;
  cornerSize?: number;
  showCorners?: boolean[];
  className?: string;
  style?: CSSProperties;
}

export const WithSpriteCorners: React.FC<WithSpriteCornersProps> = ({
  children,
  cornerStyle,
  cornerSize = 32,
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
        <SpriteCorner
          style={cornerStyle}
          position="top-left"
          size={cornerSize}
        />
      )}
      
      {showCorners[1] && (
        <SpriteCorner
          style={cornerStyle}
          position="top-right"
          size={cornerSize}
        />
      )}
      
      {showCorners[2] && (
        <SpriteCorner
          style={cornerStyle}
          position="bottom-left"
          size={cornerSize}
        />
      )}
      
      {showCorners[3] && (
        <SpriteCorner
          style={cornerStyle}
          position="bottom-right"
          size={cornerSize}
        />
      )}
    </div>
  );
};
