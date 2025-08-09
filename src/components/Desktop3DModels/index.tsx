import React, { useState, useCallback, useEffect } from 'react';
import { useDesktop3DModels, Desktop3DModel } from '../../hooks/useDesktop3DModels';
import { ThreeDViewer } from '../ThreeDViewer';
import { DraggableWindow } from '../Layout/DraggableWindow';
import { useSyncContext } from '../../contexts/SyncContext';
import { debounce } from '../../utils/debounce';
import { Position, Size } from '../../types/index';

interface Draggable3DModelProps {
  id: string;
  model: Desktop3DModel;
  initialSize?: { width: number; height: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onPositionChangeLocal: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onSizeChangeLocal: (id: string, size: { width: number; height: number }) => void;
  onDelete: (id: string) => void;
}

const Draggable3DModel: React.FC<Draggable3DModelProps> = ({
  id,
  model,
  initialSize = { width: 400, height: 328 },
  onPositionChange,
  onPositionChangeLocal,
  onSizeChange,
  onSizeChangeLocal,
  onDelete
}) => {
  const [size, setSize] = useState<Size>(initialSize);

  const handlePositionChange = useCallback((_windowId: string, position: Position) => {
    onPositionChangeLocal(id, position);
    onPositionChange(id, position);
  }, [id, onPositionChange, onPositionChangeLocal]);

  const handleSizeChange = useCallback((_windowId: string, newSize: Size) => {
    setSize(newSize);
    onSizeChangeLocal(id, newSize);
    onSizeChange(id, newSize);
  }, [id, onSizeChange, onSizeChangeLocal]);

  const handleClose = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <DraggableWindow
      id={id}
      title={`🎲 ${model.name.length > 25 ? model.name.substring(0, 25) + '...' : model.name}`}
      position={model.position}
      size={size}
      onPositionChange={handlePositionChange}
      onSizeChange={handleSizeChange}
      onClose={handleClose}
      zIndex={1000}
    >
      <div style={{ width: '100%', height: '100%' }}>
        <ThreeDViewer
          modelUrl={model.url}
          modelName={model.name}
          style={{ 
            width: '100%', 
            height: '100%',
            border: 'none' 
          }}
        />
      </div>
    </DraggableWindow>
  );
};

export const Desktop3DModels: React.FC = () => {
  const {
    models,
    uploading,
    uploadProgress,
    uploadModel,
    updateModelPosition,
    deleteModel,
    error
  } = useDesktop3DModels();

  const { startSync, endSync } = useSyncContext();
  const [dragOver, setDragOver] = useState(false);
  const [localPositions, setLocalPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [localSizes, setLocalSizes] = useState<Record<string, { width: number; height: number }>>({});

  // Debounced position update to Firestore
  const debouncedPositionUpdate = useCallback(
    debounce((id: string, position: { x: number; y: number }) => {
      startSync();
      updateModelPosition(id, position);
      setTimeout(endSync, 1200); // Increased from 800ms for better visibility
    }, 500),
    [updateModelPosition, startSync, endSync]
  );

  // For now, we'll just store sizes locally since the backend doesn't support size persistence
  const debouncedSizeUpdate = useCallback(
    debounce((_id: string, _size: { width: number; height: number }) => {
      // Could implement size persistence in the future
      console.log('Size update - not persisted to backend yet');
    }, 500),
    []
  );

  const handlePositionChangeLocal = useCallback((id: string, position: { x: number; y: number }) => {
    setLocalPositions(prev => ({ ...prev, [id]: position }));
  }, []);

  const handlePositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    debouncedPositionUpdate(id, position);
  }, [debouncedPositionUpdate]);

  const handleSizeChangeLocal = useCallback((id: string, size: { width: number; height: number }) => {
    setLocalSizes(prev => ({ ...prev, [id]: size }));
  }, []);

  const handleSizeChange = useCallback((id: string, size: { width: number; height: number }) => {
    debouncedSizeUpdate(id, size);
  }, [debouncedSizeUpdate]);

  // Process files for 3D models
  const processFiles = useCallback(async (files: File[], clientX: number, clientY: number) => {
    const glbFiles = files.filter(file => 
      file.type === 'model/gltf-binary' || 
      file.name.toLowerCase().endsWith('.glb') ||
      file.name.toLowerCase().endsWith('.gltf')
    );

    if (glbFiles.length === 0) {
      return;
    }

    for (const file of glbFiles) {
      const position = {
        x: clientX - 200, // Center the viewer
        y: clientY - 150
      };
      
      await uploadModel(file, position);
    }
  }, [uploadModel]);

  // Listen for non-image files dropped by DesktopImages component
  useEffect(() => {
    const handleNonImageDrop = (e: CustomEvent) => {
      const { files, originalEvent } = e.detail;
      processFiles(files, originalEvent.clientX, originalEvent.clientY);
    };

    document.addEventListener('non-image-files-dropped', handleNonImageDrop as EventListener);
    
    return () => {
      document.removeEventListener('non-image-files-dropped', handleNonImageDrop as EventListener);
    };
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files, e.clientX, e.clientY);
  }, [processFiles]);

  return (
    <>
      {/* Drop zone overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: dragOver ? 9999 : -1,
          background: dragOver ? 'rgba(0, 128, 128, 0.3)' : 'transparent',
          border: dragOver ? '4px dashed #008080' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: dragOver ? 'auto' : 'none',
          transition: 'all 0.2s ease',
          fontFamily: "'Pixelify Sans', monospace"
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dragOver && (
          <div style={{
            background: '#c0c0c0',
            border: '2px outset #c0c0c0',
            padding: '20px',
            fontSize: '16px',
            color: '#000000',
            textAlign: 'center',
            borderRadius: '0'
          }}>
            🎲 Drop GLB/GLTF files to create 3D viewers
          </div>
        )}
      </div>

      {/* Upload progress */}
      {uploading && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#c0c0c0',
          border: '2px outset #c0c0c0',
          padding: '12px',
          zIndex: 10000,
          fontFamily: "'Pixelify Sans', monospace",
          fontSize: '11px'
        }}>
          <div style={{ marginBottom: '8px' }}>Uploading 3D Model...</div>
          <div style={{
            width: '200px',
            height: '20px',
            background: '#808080',
            border: '1px inset #c0c0c0'
          }}>
            <div style={{
              width: `${uploadProgress}%`,
              height: '100%',
              background: '#008080',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ marginTop: '4px', textAlign: 'center' }}>
            {Math.round(uploadProgress)}%
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#c0c0c0',
          border: '2px inset #c0c0c0',
          padding: '12px',
          zIndex: 10000,
          color: '#800000',
          fontFamily: "'Pixelify Sans', monospace",
          fontSize: '10px',
          maxWidth: '300px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* 3D Model viewers */}
      {models.map((model: Desktop3DModel) => {
        const position = localPositions[model.id] || model.position;
        const initialSize = localSizes[model.id] || { width: 400, height: 328 };
        return (
          <Draggable3DModel
            key={model.id}
            id={model.id}
            model={{ ...model, position }}
            initialSize={initialSize}
            onPositionChange={handlePositionChange}
            onPositionChangeLocal={handlePositionChangeLocal}
            onSizeChange={handleSizeChange}
            onSizeChangeLocal={handleSizeChangeLocal}
            onDelete={deleteModel}
          />
        );
      })}
    </>
  );
};

export default Desktop3DModels;
