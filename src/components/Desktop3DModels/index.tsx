import React, { useState, useCallback, useEffect } from 'react';
import { useDesktop3DModels, Desktop3DModel } from '../../hooks/useDesktop3DModels';
import { ThreeDViewer } from '../ThreeDViewer';
import { debounce } from '../../utils/debounce';

interface Draggable3DModelProps {
  id: string;
  model: Desktop3DModel;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onPositionChangeLocal: (id: string, position: { x: number; y: number }) => void;
  onDelete: (id: string) => void;
}

const Draggable3DModel: React.FC<Draggable3DModelProps> = ({
  id,
  model,
  onPositionChange,
  onPositionChangeLocal,
  onDelete
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [size] = useState({ width: 400, height: 328 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && !(e.target as Element).classList.contains('drag-handle')) {
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - model.position.x,
      y: e.clientY - model.position.y
    });
  }, [model.position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };
    
    onPositionChangeLocal(id, newPosition);
  }, [isDragging, dragStart, id, onPositionChangeLocal]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onPositionChange(id, model.position);
    }
  }, [isDragging, id, model.position, onPositionChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const modelStyle: React.CSSProperties = {
    position: 'absolute',
    left: model.position.x,
    top: model.position.y,
    width: size.width,
    height: size.height,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 9999 : 1000,
    userSelect: 'none',
    background: '#c0c0c0',
    border: '2px outset #c0c0c0',
    borderRadius: '0'
  };

  const headerStyle: React.CSSProperties = {
    background: '#008080',
    color: '#ffffff',
    padding: '4px 8px',
    fontSize: '11px',
    fontFamily: "'Pixelify Sans', monospace",
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #404040',
    cursor: 'grab'
  };

  return (
    <div style={modelStyle} onMouseDown={handleMouseDown} className="desktop-3d-model">
      {/* Header */}
      <div style={headerStyle} className="drag-handle">
        <span title={model.name}>
          🎲 {model.name.length > 25 ? model.name.substring(0, 25) + '...' : model.name}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '12px',
            cursor: 'pointer'
          }}
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* 3D Viewer */}
      <div style={{ width: '100%', height: 'calc(100% - 28px)' }}>
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
    </div>
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

  const [dragOver, setDragOver] = useState(false);
  const [localPositions, setLocalPositions] = useState<Record<string, { x: number; y: number }>>({});

  // Debounced position update to Firestore
  const debouncedPositionUpdate = useCallback(
    debounce((id: string, position: { x: number; y: number }) => {
      updateModelPosition(id, position);
    }, 500),
    [updateModelPosition]
  );

  const handlePositionChangeLocal = useCallback((id: string, position: { x: number; y: number }) => {
    setLocalPositions(prev => ({ ...prev, [id]: position }));
  }, []);

  const handlePositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    debouncedPositionUpdate(id, position);
  }, [debouncedPositionUpdate]);

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
    const glbFiles = files.filter(file => 
      file.type === 'model/gltf-binary' || 
      file.name.toLowerCase().endsWith('.glb') ||
      file.name.toLowerCase().endsWith('.gltf')
    );

    if (glbFiles.length === 0) {
      alert('Please drop GLB or GLTF files only');
      return;
    }

    for (const file of glbFiles) {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left - 200, // Center the viewer
        y: e.clientY - rect.top - 150
      };

      await uploadModel(file, position);
    }
  }, [uploadModel]);

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
        return (
          <Draggable3DModel
            key={model.id}
            id={model.id}
            model={{ ...model, position }}
            onPositionChange={handlePositionChange}
            onPositionChangeLocal={handlePositionChangeLocal}
            onDelete={deleteModel}
          />
        );
      })}
    </>
  );
};

export default Desktop3DModels;
