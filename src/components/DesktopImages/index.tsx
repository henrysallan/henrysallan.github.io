import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDesktopImages } from '../../hooks/useDesktopImages';
import { useSyncContext } from '../../contexts/SyncContext';
import { debounce } from '../../utils/debounce';

interface DraggableImageProps {
  id: string;
  src: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  storedAspectRatio?: number;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onPositionChangeLocal: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onSizeChangeLocal: (id: string, size: { width: number; height: number }) => void;
  onAspectRatioUpdate: (id: string, aspectRatio: number) => void;
  onDelete: (id: string) => void;
}

const DraggableImage: React.FC<DraggableImageProps> = ({
  id,
  src,
  position,
  size,
  storedAspectRatio,
  onPositionChange,
  onPositionChangeLocal,
  onSizeChange,
  onSizeChangeLocal,
  onAspectRatioUpdate,
  onDelete
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(storedAspectRatio || null);
  const { startSync, endSync } = useSyncContext();

  // Create debounced versions of the database update functions
  const debouncedPositionUpdate = useMemo(
    () => debounce((id: string, position: { x: number; y: number }) => {
      startSync();
      onPositionChange(id, position);
      setTimeout(endSync, 1200); // Increased from 800ms to 1200ms for better visibility
    }, 500), // 500ms delay
    [onPositionChange, startSync, endSync]
  );

  const debouncedSizeUpdate = useMemo(
    () => debounce((id: string, size: { width: number; height: number }) => {
      startSync();
      onSizeChange(id, size);
      setTimeout(endSync, 1200); // Increased from 800ms to 1200ms for better visibility
    }, 500), // 500ms delay
    [onSizeChange, startSync, endSync]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'IMG') {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      // Update UI immediately for smooth dragging
      onPositionChangeLocal(id, newPosition);
      // Debounce database update
      debouncedPositionUpdate(id, newPosition);
    }
  }, [isDragging, dragStart, id, onPositionChangeLocal, debouncedPositionUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleResizeMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth, newHeight;
      
      if (aspectRatio) {
        // Maintain aspect ratio - use the diagonal distance for more intuitive resizing
        const diagonal = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const sign = (deltaX + deltaY) > 0 ? 1 : -1; // Determine if growing or shrinking
        
        const scaleFactor = 1 + (diagonal * sign) / Math.max(startWidth, startHeight);
        
        newWidth = Math.max(50, startWidth * scaleFactor);
        newHeight = Math.max(50 / aspectRatio, newWidth / aspectRatio);
      } else {
        // Fallback to free resize if aspect ratio not loaded yet
        newWidth = Math.max(50, startWidth + deltaX);
        newHeight = Math.max(50, startHeight + deltaY);
      }
      
      const newSize = { width: newWidth, height: newHeight };
      // Update UI immediately for smooth resizing
      onSizeChangeLocal(id, newSize);
      // Debounce database update
      debouncedSizeUpdate(id, newSize);
    };

    const handleResizeUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeUp);
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeUp);
  }, [id, size, aspectRatio, onSizeChangeLocal, debouncedSizeUpdate]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 500,
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt="Desktop image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none'
        }}
        draggable={false}
        onLoad={(e) => {
          const img = e.target as HTMLImageElement;
          const ratio = img.naturalWidth / img.naturalHeight;
          setAspectRatio(ratio);
          
          // Save aspect ratio to database if not already stored
          if (!storedAspectRatio && ratio) {
            startSync();
            onAspectRatioUpdate(id, ratio);
            setTimeout(endSync, 1200); // Increased from 800ms
          }
        }}
      />
      
      {/* Delete button - appears on hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '20px',
            height: '20px',
            background: 'red',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 1
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          ×
        </div>
      )}

      {/* Resize handle */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '12px',
            height: '12px',
            background: '#666',
            cursor: 'nw-resize'
          }}
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};

export const DesktopImages: React.FC = () => {
  const { 
    images, 
    loading, 
    error, 
    addImage, 
    updateImagePosition, 
    updateImagePositionLocal,
    updateImageSize, 
    updateImageSizeLocal,
    updateImageAspectRatio,
    deleteImage 
  } = useDesktopImages();

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer?.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    // Only process image files here - the Desktop3DModels component should handle 3D files
    // But we need to let it know about the drop event somehow...
    if (imageFiles.length === 0) {
      // If no image files, dispatch a custom event for other components
      const customEvent = new CustomEvent('non-image-files-dropped', {
        detail: { files, originalEvent: e }
      });
      document.dispatchEvent(customEvent);
      return;
    }

    for (const file of imageFiles) {
      // Calculate drop position relative to the screen
      const dropPosition = {
        x: e.clientX - 100, // Offset so image appears under cursor
        y: e.clientY - 100
      };
      
      await addImage(file, dropPosition);
    }
  }, [addImage]);

  // Add document-level event listeners to prevent default browser behavior
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      // Check if dragging files
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault();
        e.stopPropagation();
        // Only hide the indicator if we're leaving the document
        if (!e.relatedTarget) {
          setIsDragOver(false);
        }
      }
    };

    const handleDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
      }
    };

    // Add event listeners to document
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    return () => {
      // Cleanup event listeners
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, [handleDrop]);

  if (loading) {
    return null; // Don't show loading for desktop images
  }

  return (
    <>
      {/* Drag over overlay */}
      {isDragOver && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 100, 255, 0.1)',
            border: '3px dashed #0066ff',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 100, 255, 0.9)',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: "'Jacquard 12', 'MS Sans Serif', monospace"
            }}
          >
            📸 Drop images here!
          </div>
        </div>
      )}

      {/* Render all desktop images */}
      {images.map((image: any) => (
        <DraggableImage
          key={image.id}
          id={image.id}
          src={image.url}
          position={image.position}
          size={image.size}
          storedAspectRatio={image.aspectRatio}
          onPositionChange={updateImagePosition}
          onPositionChangeLocal={updateImagePositionLocal}
          onSizeChange={updateImageSize}
          onSizeChangeLocal={updateImageSizeLocal}
          onAspectRatioUpdate={updateImageAspectRatio}
          onDelete={deleteImage}
        />
      ))}

      {/* Loading indicator */}
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            zIndex: 10001,
            fontFamily: "'Jacquard 12', 'MS Sans Serif', monospace",
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          🗜️ Compressing and uploading image...
        </div>
      )}

      {/* Error display */}
      {error && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'red',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 1000,
            maxWidth: '300px'
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </>
  );
};
