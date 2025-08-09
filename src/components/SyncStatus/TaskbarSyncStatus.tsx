import React, { useState, useEffect } from 'react';
import { colors } from '../../styles/colors';

interface TaskbarSyncStatusProps {
  isActive: boolean;
  duration?: number;
}

export const TaskbarSyncStatus: React.FC<TaskbarSyncStatusProps> = ({ 
  isActive, 
  duration = 1000 
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showGreen, setShowGreen] = useState(false);

  useEffect(() => {
    if (!isActive) {
      if (progress > 0) {
        // If we were syncing and now stopped, show completion
        setProgress(100);
        setIsComplete(true);
        setShowGreen(true);
        
        // Keep green for a bit, then reset
        setTimeout(() => {
          setShowGreen(false);
          setIsComplete(false);
          setProgress(0);
        }, 2000);
      }
      return;
    }

    // Reset completion state when starting new sync
    setIsComplete(false);
    setShowGreen(false);

    // Start the progress animation
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress < 100 && isActive) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isActive, duration, progress]);

  const getStatusColor = () => {
    if (showGreen || isComplete) return '#00aa00';
    if (isActive && progress > 0) return '#0080ff';
    return '#00aa00'; // Default to green when idle
  };

  const getStatusText = () => {
    if (showGreen || (isComplete && !isActive)) return '✓';
    if (isActive && progress > 0) return '↻';
    return '✓'; // Default to checkmark when idle
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 6px',
        border: `2px solid`,
        borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`,
        fontSize: '10px',
        fontFamily: "'Pixelify Sans', monospace",
        backgroundColor: '#c0c0c0',
        minWidth: '50px',
        height: '20px'
      }}
      title={isActive ? 'Syncing changes...' : 'All changes synced'}
    >
      <span style={{ 
        color: getStatusColor(),
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {getStatusText()}
      </span>
      
      {/* Mini progress bar */}
      <div
        style={{
          flex: 1,
          height: '6px',
          background: '#808080',
          border: '1px inset #c0c0c0',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: isActive ? `${progress}%` : '100%',
            height: '100%',
            background: getStatusColor(),
            transition: isActive ? 'none' : 'width 0.3s ease'
          }}
        />
      </div>
    </div>
  );
};

export default TaskbarSyncStatus;
