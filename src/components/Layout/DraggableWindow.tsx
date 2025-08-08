import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Window95 } from '../Windows95UI/Windows95';
import { Position, Size } from '../../types/index';

interface DraggableWindowProps {
  id: string;
  title: string;
  position: Position;
  size: Size;
  onPositionChange: (id: string, position: Position) => void;
  onSizeChange: (id: string, size: Size) => void;
  onClose: (id: string) => void;
  children: React.ReactNode;
  zIndex: number;
}

export const DraggableWindow: React.FC<DraggableWindowProps> = ({
  id,
  title,
  position,
  size,
  onPositionChange,
  onSizeChange,
  onClose,
  children,
  zIndex
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      onPositionChange(id, {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (isResizing) {
      const newWidth = Math.max(200, resizeStart.width + (e.clientX - resizeStart.x));
      const newHeight = Math.max(150, resizeStart.height + (e.clientY - resizeStart.y));
      onSizeChange(id, {
        width: newWidth,
        height: newHeight
      });
    }
  }, [isDragging, isResizing, dragStart.x, dragStart.y, resizeStart, id, onPositionChange, onSizeChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={windowRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: zIndex,
        cursor: isDragging ? 'move' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      <Window95 title={title} onClose={() => onClose(id)}>
        {children}
      </Window95>
      
      {/* Resize handle */}
      <div
        className="resize-handle"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '16px',
          height: '16px',
          cursor: 'se-resize',
          background: `linear-gradient(135deg, transparent 0%, transparent 30%, #808080 30%, #808080 35%, transparent 35%, transparent 65%, #808080 65%, #808080 70%, transparent 70%)`,
          userSelect: 'none'
        }}
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};