import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Center } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  url: string;
  scale?: number;
}

// 3D Model component
const Model: React.FC<ModelProps> = ({ url, scale = 1 }) => {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  
  // Auto-rotate the model
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Center>
      <group ref={group} scale={scale}>
        <primitive object={scene.clone()} />
      </group>
    </Center>
  );
};

// Loading component
const ModelLoader: React.FC = () => (
  <Html center>
    <div style={{
      color: '#000000',
      fontFamily: "'Pixelify Sans', monospace",
      fontSize: '12px',
      textAlign: 'center',
      background: '#c0c0c0',
      padding: '8px',
      border: '2px outset #c0c0c0'
    }}>
      Loading 3D Model...
    </div>
  </Html>
);

// Error component
const ModelError: React.FC<{ error: string }> = ({ error }) => (
  <Html center>
    <div style={{
      color: '#800000',
      fontFamily: "'Pixelify Sans', monospace",
      fontSize: '10px',
      textAlign: 'center',
      background: '#c0c0c0',
      padding: '8px',
      border: '2px inset #c0c0c0',
      maxWidth: '200px'
    }}>
      ⚠️ Error loading model:<br/>
      {error}
    </div>
  </Html>
);

export interface ThreeDViewerProps {
  modelUrl: string;
  modelName: string;
  onClose?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  modelUrl,
  modelName,
  onClose,
  style = {},
  className = ''
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleError = (err: any) => {
    console.error('3D Model loading error:', err);
    setError(err.message || 'Failed to load 3D model');
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const containerStyle: React.CSSProperties = {
    width: isFullscreen ? '80vw' : '400px',
    height: isFullscreen ? '80vh' : '300px',
    background: '#c0c0c0',
    border: '2px outset #c0c0c0',
    borderRadius: '0',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Pixelify Sans', monospace",
    ...style
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
    borderBottom: '1px solid #404040'
  };

  const canvasStyle: React.CSSProperties = {
    width: '100%',
    height: 'calc(100% - 28px)', // Account for header
    background: 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <span title={modelName}>
          🎲 {modelName.length > 25 ? modelName.substring(0, 25) + '...' : modelName}
        </span>
        <div>
          <button
            onClick={handleFullscreen}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
              marginRight: '8px'
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? '🗗' : '🗖'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
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
          )}
        </div>
      </div>

      {/* 3D Canvas */}
      <div style={canvasStyle}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          onError={handleError}
          gl={{ 
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          
          <Suspense fallback={<ModelLoader />}>
            {error ? (
              <ModelError error={error} />
            ) : (
              <Model url={modelUrl} />
            )}
          </Suspense>
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={20}
          />
        </Canvas>
      </div>
    </div>
  );
};

// Preload GLB files for better performance
useGLTF.preload = (url: string) => {
  return useGLTF(url);
};

export default ThreeDViewer;
