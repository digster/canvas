import type { LayoutMode } from '../types';

interface LayoutToggleProps {
  mode: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

export function LayoutToggle({ mode, onChange }: LayoutToggleProps) {
  return (
    <div className="layout-toggle">
      <button
        className={`layout-toggle-btn ${mode === 'grid' ? 'active' : ''}`}
        onClick={() => onChange('grid')}
        title="Grid Layout (4 panels)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
      </button>
      <button
        className={`layout-toggle-btn ${mode === 'split' ? 'active' : ''}`}
        onClick={() => onChange('split')}
        title="Split Layout (Editor | Preview)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="6" height="14" rx="1" />
          <rect x="9" y="1" width="6" height="14" rx="1" />
        </svg>
      </button>
    </div>
  );
}
