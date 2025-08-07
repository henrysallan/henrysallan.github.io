import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Window95 } from '../Windows95UI';
import { Position } from '../../types';

interface DraggableWindowProps {
  id: string;
  title: string;
  position: Position;
  onPositionChange: (id: string, position: Position) => void;
  onClose: (id: string) => void;
  children: React.ReactNode;
  zIndex: number;
}

export const DraggableWindow: React.FC<DraggableWindowProps> = ({
  id,
  title,
  position,
  onPositionChange,
  onClose,
  children,
  zIndex
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    onPositionChange(id, {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart.x, dragStart.y, id, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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

  return (
    <div
      ref={windowRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: zIndex,
        cursor: isDragging ? 'move' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      <Window95 title={title} onClose={() => onClose(id)}>
        {children}
      </Window95>
    </div>
  );
};