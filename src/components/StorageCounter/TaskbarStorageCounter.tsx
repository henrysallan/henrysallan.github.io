import React from 'react';
import { colors } from '../../styles/colors';
import { useStorageUsage } from '../../hooks/useStorageUsage';

export const TaskbarStorageCounter: React.FC = () => {
  const { totalBytes, imageCount, modelCount, isLoading, error, formatBytes } = useStorageUsage();

  if (error) {
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
          minWidth: '60px',
          height: '20px',
          color: '#800000'
        }}
        title={`Storage Error: ${error}`}
      >
        <span>💾</span>
        <span>Error</span>
      </div>
    );
  }

  if (isLoading) {
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
          minWidth: '60px',
          height: '20px'
        }}
        title="Loading storage usage..."
      >
        <span>💾</span>
        <span>...</span>
      </div>
    );
  }

  const totalItems = imageCount + modelCount;
  const title = totalItems > 0 
    ? `Storage Usage:\n${formatBytes(totalBytes)} total\n${imageCount} images, ${modelCount} 3D models`
    : `Storage Usage:\nNo files uploaded yet\nDrag & drop images or GLB files to start`;

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
        minWidth: '70px',
        height: '20px',
        color: '#000000'
      }}
      title={title}
    >
      <span style={{ fontSize: '11px' }}>💾</span>
      <span style={{ fontWeight: 'bold' }}>
        {totalBytes > 0 ? formatBytes(totalBytes) : '0 B'}
      </span>
      {totalItems > 0 && (
        <span style={{ color: '#666666', fontSize: '9px' }}>
          ({totalItems})
        </span>
      )}
    </div>
  );
};

export default TaskbarStorageCounter;
