import { useState, useEffect, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CodeEditor } from './components/CodeEditor';
import { Preview } from './components/Preview';
import { DraggablePanel } from './components/DraggablePanel';
import { generatePreview } from './utils/generatePreview';
import type { PanelId, PanelState } from './types';
import './App.css';

const DEFAULT_HTML = `<canvas id="myCanvas" width="600" height="400"></canvas>`;

const DEFAULT_CSS = `canvas {
  border: 2px solid #333;
  background: #fff;
  display: block;
  margin: 0 auto;
}`;

const DEFAULT_JS = `const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Draw a rectangle
ctx.fillStyle = '#4CAF50';
ctx.fillRect(50, 50, 150, 100);

// Draw a circle
ctx.beginPath();
ctx.arc(350, 100, 75, 0, Math.PI * 2);
ctx.fillStyle = '#2196F3';
ctx.fill();

// Draw text
ctx.font = '24px Arial';
ctx.fillStyle = '#333';
ctx.fillText('Canvas Learning Tool', 150, 250);

// Draw a line
ctx.beginPath();
ctx.moveTo(50, 300);
ctx.lineTo(550, 300);
ctx.strokeStyle = '#FF5722';
ctx.lineWidth = 3;
ctx.stroke();`;

const INITIAL_PANELS: PanelState[] = [
  { id: 'html', label: 'HTML', visible: true, position: 0 },
  { id: 'css', label: 'CSS', visible: true, position: 1 },
  { id: 'javascript', label: 'JavaScript', visible: true, position: 2 },
  { id: 'preview', label: 'Preview', visible: true, position: 3 },
];

function App() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [srcDoc, setSrcDoc] = useState(() => generatePreview(DEFAULT_HTML, DEFAULT_CSS, DEFAULT_JS));
  const [panels, setPanels] = useState<PanelState[]>(INITIAL_PANELS);
  const [activeId, setActiveId] = useState<PanelId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Debounced preview update
  const updatePreview = useCallback(() => {
    setSrcDoc(generatePreview(html, css, js));
  }, [html, css, js]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updatePreview();
    }, 300);

    return () => clearTimeout(timeout);
  }, [updatePreview]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as PanelId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPanels((items) => {
        // Don't reorder the array - just update the position values
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        // Create new array with updated positions
        return items.map((item, index) => {
          if (index === oldIndex) {
            return { ...item, position: newIndex };
          } else if (index === newIndex) {
            return { ...item, position: oldIndex };
          } else if (oldIndex < newIndex && index > oldIndex && index <= newIndex) {
            return { ...item, position: item.position - 1 };
          } else if (oldIndex > newIndex && index >= newIndex && index < oldIndex) {
            return { ...item, position: item.position + 1 };
          }
          return item;
        });
      });
    }
    
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleClosePanel = (panelId: PanelId) => {
    setPanels((items) =>
      items.map((item) =>
        item.id === panelId ? { ...item, visible: false } : item
      )
    );
  };

  const handleOpenPanel = (panelId: PanelId) => {
    setPanels((items) =>
      items.map((item) =>
        item.id === panelId ? { ...item, visible: true } : item
      )
    );
  };

  const visiblePanels = panels.filter((p) => p.visible);
  const hiddenPanels = panels.filter((p) => !p.visible);

  // Sort visible panels by position for sortable context
  const sortedVisiblePanels = [...visiblePanels].sort((a, b) => a.position - b.position);

  // Stable refs for editors to prevent remounting
  const htmlEditorKey = 'html-editor';
  const cssEditorKey = 'css-editor';
  const jsEditorKey = 'javascript-editor';
  const previewKey = 'preview-pane';

  const renderPanel = (panel: PanelState) => {
    switch (panel.id) {
      case 'html':
        return (
          <DraggablePanel
            key={htmlEditorKey}
            id={panel.id}
            label={panel.label}
            onClose={() => handleClosePanel(panel.id)}
          >
            <CodeEditor
              key={htmlEditorKey}
              language="html"
              value={html}
              onChange={setHtml}
              label=""
            />
          </DraggablePanel>
        );
      case 'css':
        return (
          <DraggablePanel
            key={cssEditorKey}
            id={panel.id}
            label={panel.label}
            onClose={() => handleClosePanel(panel.id)}
          >
            <CodeEditor
              key={cssEditorKey}
              language="css"
              value={css}
              onChange={setCss}
              label=""
            />
          </DraggablePanel>
        );
      case 'javascript':
        return (
          <DraggablePanel
            key={jsEditorKey}
            id={panel.id}
            label={panel.label}
            onClose={() => handleClosePanel(panel.id)}
          >
            <CodeEditor
              key={jsEditorKey}
              language="javascript"
              value={js}
              onChange={setJs}
              label=""
            />
          </DraggablePanel>
        );
      case 'preview':
        return (
          <DraggablePanel
            key={previewKey}
            id={panel.id}
            label={panel.label}
            onClose={() => handleClosePanel(panel.id)}
          >
            <Preview key={previewKey} srcDoc={srcDoc} />
          </DraggablePanel>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Canvas Learning Tool</h1>
          <p>Edit HTML, CSS, and JavaScript to see your canvas creations come to life!</p>
        </div>
        {hiddenPanels.length > 0 && (
          <div className="hidden-panels-menu">
            <span className="menu-label">Show:</span>
            {hiddenPanels.map((panel) => (
              <button
                key={panel.id}
                className="show-panel-btn"
                onClick={() => handleOpenPanel(panel.id)}
                title={`Show ${panel.label} panel`}
              >
                {panel.label}
              </button>
            ))}
          </div>
        )}
      </header>
      
      <div className="editor-grid">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={sortedVisiblePanels.map((p) => p.id)}
            strategy={rectSortingStrategy}
          >
            <PanelGroup direction="vertical" className="panels-container">
              {/* Top Row - always render if there are panels */}
              {sortedVisiblePanels.length > 0 && (
                <Panel defaultSize={50} minSize={20} className="panel-row">
                  <PanelGroup direction="horizontal">
                    {sortedVisiblePanels[0] && (
                      <Panel key={`panel-top-left`} defaultSize={50} minSize={15}>
                        {renderPanel(sortedVisiblePanels[0])}
                      </Panel>
                    )}
                    {sortedVisiblePanels.length >= 2 && (
                      <>
                        <PanelResizeHandle className="resize-handle resize-handle-horizontal" />
                        <Panel key={`panel-top-right`} defaultSize={50} minSize={15}>
                          {renderPanel(sortedVisiblePanels[1])}
                        </Panel>
                      </>
                    )}
                  </PanelGroup>
                </Panel>
              )}
              
              {/* Vertical Resize Handle between rows */}
              {sortedVisiblePanels.length >= 3 && (
                <PanelResizeHandle className="resize-handle resize-handle-vertical" />
              )}
              
              {/* Bottom Row - only if we have 3+ panels */}
              {sortedVisiblePanels.length >= 3 && (
                <Panel defaultSize={50} minSize={20} className="panel-row">
                  <PanelGroup direction="horizontal">
                    <Panel key={`panel-bottom-left`} defaultSize={50} minSize={15}>
                      {renderPanel(sortedVisiblePanels[2])}
                    </Panel>
                    {sortedVisiblePanels.length >= 4 && (
                      <>
                        <PanelResizeHandle className="resize-handle resize-handle-horizontal" />
                        <Panel key={`panel-bottom-right`} defaultSize={50} minSize={15}>
                          {renderPanel(sortedVisiblePanels[3])}
                        </Panel>
                      </>
                    )}
                  </PanelGroup>
                </Panel>
              )}
            </PanelGroup>
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeId ? (
              <div className="draggable-panel drag-overlay">
                <div className="panel-header-controls">
                  <div className="panel-drag-handle">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M5 3h2v2H5V3zm4 0h2v2H9V3zM5 7h2v2H5V7zm4 0h2v2H9V7zm-4 4h2v2H5v-2zm4 0h2v2H9v-2z"/>
                    </svg>
                    <span className="panel-title">
                      {visiblePanels.find(p => p.id === activeId)?.label}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default App;
