import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type ReactNode, memo } from 'react';

interface DraggablePanelProps {
  id: string;
  children: ReactNode;
  onClose: () => void;
  label: string;
}

export const DraggablePanel = memo(function DraggablePanel({ id, children, onClose, label }: DraggablePanelProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
  });

  // Don't apply transform while dragging - only when settling into new position
  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`draggable-panel ${isDragging ? 'dragging' : ''}`}
    >
      <div className="panel-header-controls">
        <div className="panel-drag-handle" {...attributes} {...listeners}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 3h2v2H5V3zm4 0h2v2H9V3zM5 7h2v2H5V7zm4 0h2v2H9V7zm-4 4h2v2H5v-2zm4 0h2v2H9v-2z"/>
          </svg>
          <span className="panel-title">{label}</span>
        </div>
        <button 
          className="panel-close-btn"
          onClick={onClose}
          title="Close panel"
          aria-label={`Close ${label} panel`}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"/>
          </svg>
        </button>
      </div>
      <div className="panel-content" style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
        {children}
      </div>
    </div>
  );
});

