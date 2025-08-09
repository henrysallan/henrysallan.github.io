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
  const [resizeDirection, setResizeDirection] = useState<string>('');
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
    const target = e.target as HTMLElement;
    const direction = target.classList.contains('resize-se') ? 'se' 
                     : target.classList.contains('resize-e') ? 'e'
                     : target.classList.contains('resize-s') ? 's'
                     : 'se';
    
    setIsResizing(true);
    setResizeDirection(direction);
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
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = size.width;
      let newHeight = size.height;
      
      if (resizeDirection.includes('e')) {
        newWidth = Math.max(200, resizeStart.width + deltaX);
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(150, resizeStart.height + deltaY);
      }
      
      onSizeChange(id, {
        width: newWidth,
        height: newHeight
      });
    }
  }, [isDragging, isResizing, dragStart.x, dragStart.y, resizeStart, resizeDirection, id, onPositionChange, onSizeChange, size.width, size.height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection('');
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
        cursor: isDragging ? 'move' : 'default',
        pointerEvents: 'auto',
        outline: isResizing ? '2px dashed #0000ff' : 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      <Window95 title={title} onClose={() => onClose(id)}>
        {children}
      </Window95>
      
      {/* Resize handles */}
      
      {/* Bottom-right corner resize handle (invisible but functional) */}
      <div
        className="resize-handle resize-se"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '12px',
          height: '12px',
          cursor: 'se-resize',
          background: 'transparent',
          userSelect: 'none',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
        onMouseDown={handleResizeMouseDown}
      />

      {/* Right edge resize handle (invisible but functional) */}
      <div
        className="resize-handle resize-e"
        style={{
          position: 'absolute',
          top: '20px',
          right: 0,
          width: '6px',
          height: 'calc(100% - 32px)',
          cursor: 'e-resize',
          userSelect: 'none',
          zIndex: 999,
          pointerEvents: 'auto',
          background: 'transparent'
        }}
        onMouseDown={handleResizeMouseDown}
      />

      {/* Bottom edge resize handle (invisible but functional) */}
      <div
        className="resize-handle resize-s"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '20px',
          width: 'calc(100% - 32px)',
          height: '6px',
          cursor: 's-resize',
          userSelect: 'none',
          zIndex: 999,
          pointerEvents: 'auto',
          background: 'transparent'
        }}
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};