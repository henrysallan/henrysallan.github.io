import React, { useState, useEffect } from 'react';

interface SyncStatusProps {
  isVisible: boolean;
  duration?: number; // Duration of the sync animation in ms
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ 
  isVisible, 
  duration = 1000 
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setIsComplete(false);
      return;
    }

    // Start the progress animation
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        setIsComplete(true);
        // Keep the green state for a bit longer
        setTimeout(() => {
          setIsComplete(false);
          setProgress(0);
        }, 1500); // Increased from 1000ms to 1500ms for better visibility
      } else {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isVisible, duration]);

  if (!isVisible && !isComplete && progress === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '200px',
        height: '32px',
        background: '#c0c0c0',
        border: '2px outset #c0c0c0',
        padding: '4px',
        zIndex: 10000,
        fontFamily: "'Pixelify Sans', monospace",
        fontSize: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
      }}
    >
      <div style={{ 
        color: '#000000', 
        textAlign: 'center',
        height: '12px',
        lineHeight: '12px'
      }}>
        {isComplete ? '✓ Synced to server' : 'Syncing changes...'}
      </div>
      
      <div
        style={{
          width: '100%',
          height: '12px',
          background: '#808080',
          border: '1px inset #c0c0c0',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: isComplete ? '#00ff00' : '#0080ff',
            transition: isComplete ? 'background-color 0.3s ease' : 'none',
            borderRight: progress > 0 && progress < 100 ? '1px solid #0060d0' : 'none'
          }}
        />
      </div>
    </div>
  );
};

export default SyncStatus;
