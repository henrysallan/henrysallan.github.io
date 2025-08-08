import React, { useState, useRef, useCallback } from 'react';
import { colors } from '../../styles/colors';
import { useImages } from '../../hooks/useImages';

export const ImageGallery: React.FC = () => {
  const { images, loading, error, uploadImage, deleteImage } = useImages();
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    for (const file of imageFiles) {
      await uploadImage(file);
    }
  }, [uploadImage]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    for (const file of imageFiles) {
      await uploadImage(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [uploadImage]);

  const handleDeleteClick = useCallback(async (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteImage(imageId);
  }, [deleteImage]);

  if (loading && images.length === 0) {
    return (
      <div style={{ 
        padding: '16px', 
        textAlign: 'center', 
        color: colors.text,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Loading images...
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      color: colors.text 
    }}>
      {/* Upload Area */}
      <div
        style={{
          border: `2px ${isDragging ? 'solid' : 'dashed'} ${colors.borderDark}`,
          borderColor: isDragging ? colors.borderDark : '#999',
          padding: '12px',
          margin: '8px',
          textAlign: 'center',
          background: isDragging ? colors.windowHeader : colors.textLight,
          cursor: 'pointer',
          fontSize: '11px'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isDragging ? (
          <div>📁 Drop images here!</div>
        ) : (
          <div>
            <div>📸 Drag & drop images</div>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
              or click to browse
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          padding: '8px', 
          color: 'red', 
          fontSize: '10px',
          background: colors.textLight,
          margin: '0 8px 8px 8px',
          border: `1px solid ${colors.borderDark}`
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Image Grid */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '8px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '8px',
        alignContent: 'start'
      }}>
        {images.map((image: any) => (
          <div
            key={image.id}
            style={{
              position: 'relative',
              aspectRatio: '1',
              border: `2px solid ${colors.borderDark}`,
              borderColor: `${colors.borderLight} ${colors.borderDark} ${colors.borderDark} ${colors.borderLight}`,
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoveredImage(image.id)}
            onMouseLeave={() => setHoveredImage(null)}
          >
            <img
              src={image.url}
              alt={image.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onClick={() => window.open(image.url, '_blank')}
            />
            
            {/* Delete button - appears on hover in top-right */}
            {hoveredImage === image.id && (
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '16px',
                  height: '16px',
                  background: 'red',
                  color: 'white',
                  border: `1px solid ${colors.borderDark}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  userSelect: 'none'
                }}
                onClick={(e) => handleDeleteClick(image.id, e)}
                title="Delete image"
              >
                ×
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {images.length > 0 && (
        <div style={{ 
          padding: '4px 8px', 
          borderTop: `1px solid ${colors.borderDark}`,
          fontSize: '10px',
          color: '#666',
          textAlign: 'center'
        }}>
          {images.length} image{images.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};
