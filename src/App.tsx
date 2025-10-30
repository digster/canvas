import { useState, useEffect, useCallback, useRef } from 'react';
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
import { FileTabs } from './components/FileTabs';
import { generatePreview } from './utils/generatePreview';
import { exportProject, importProject } from './utils/fileOperations';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { PanelId, PanelState, JavaScriptFile } from './types';
import './App.css';

const DEFAULT_HTML = `<canvas id="myCanvas" width="600" height="400"></canvas>`;

const DEFAULT_CSS = `canvas {
  border: 2px solid #333;
  background: #fff;
  display: block;
  margin: 0 auto;
}`;

const DEFAULT_JS_FILES: JavaScriptFile[] = [
  {
    id: crypto.randomUUID(),
    name: 'main.js',
    content: `const canvas = document.getElementById('myCanvas');
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
ctx.stroke();`
  }
];

const INITIAL_PANELS: PanelState[] = [
  { id: 'html', label: 'HTML', visible: true, position: 0 },
  { id: 'css', label: 'CSS', visible: true, position: 1 },
  { id: 'javascript', label: 'JavaScript', visible: true, position: 2 },
  { id: 'preview', label: 'Preview', visible: true, position: 3 },
];

function App() {
  // Use localStorage for persistence
  const [html, setHtml] = useLocalStorage('canvas-html', DEFAULT_HTML);
  const [css, setCss] = useLocalStorage('canvas-css', DEFAULT_CSS);
  const [jsFiles, setJsFiles] = useLocalStorage('canvas-js-files', DEFAULT_JS_FILES);
  const [activeFileId, setActiveFileId] = useLocalStorage('canvas-active-file-id', jsFiles[0]?.id || '');
  const [srcDoc, setSrcDoc] = useState(() => generatePreview(html, css, jsFiles));
  const [panels, setPanels] = useState<PanelState[]>(INITIAL_PANELS);
  const [activeId, setActiveId] = useState<PanelId | null>(null);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setSrcDoc(generatePreview(html, css, jsFiles));
  }, [html, css, jsFiles]);

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

  const handleExport = () => {
    exportProject(html, css, jsFiles);
    showSaveMessage('Project exported successfully!');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importProject(file);
      setHtml(data.html);
      setCss(data.css);
      setJsFiles(data.jsFiles);
      setActiveFileId(data.jsFiles[0]?.id || '');
      showSaveMessage('Project imported successfully!');
    } catch (error) {
      showSaveMessage('Error importing project: ' + (error as Error).message);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all code? This will reset to the default example.')) {
      setHtml(DEFAULT_HTML);
      setCss(DEFAULT_CSS);
      setJsFiles(DEFAULT_JS_FILES);
      setActiveFileId(DEFAULT_JS_FILES[0].id);
      showSaveMessage('Code cleared and reset to default');
    }
  };

  // JavaScript file management handlers
  const handleAddJsFile = () => {
    const newFile: JavaScriptFile = {
      id: crypto.randomUUID(),
      name: `script${jsFiles.length + 1}.js`,
      content: '// New JavaScript file\n'
    };
    setJsFiles([...jsFiles, newFile]);
    setActiveFileId(newFile.id);
    showSaveMessage(`Created ${newFile.name}`);
  };

  const handleDeleteJsFile = (id: string) => {
    if (jsFiles.length <= 1) {
      return; // Don't delete the last file
    }
    const updatedFiles = jsFiles.filter(f => f.id !== id);
    setJsFiles(updatedFiles);
    // If we deleted the active file, switch to the first file
    if (activeFileId === id) {
      setActiveFileId(updatedFiles[0].id);
    }
    showSaveMessage('File deleted');
  };

  const handleRenameJsFile = (id: string, newName: string) => {
    setJsFiles(jsFiles.map(f => 
      f.id === id ? { ...f, name: newName.endsWith('.js') ? newName : `${newName}.js` } : f
    ));
    showSaveMessage('File renamed');
  };

  const handleUpdateJsFile = (content: string) => {
    setJsFiles(jsFiles.map(f => 
      f.id === activeFileId ? { ...f, content } : f
    ));
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

  const showSaveMessage = (message: string) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(''), 3000);
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
        const activeFile = jsFiles.find(f => f.id === activeFileId) || jsFiles[0];
        return (
          <DraggablePanel
            key={jsEditorKey}
            id={panel.id}
            label={panel.label}
            onClose={() => handleClosePanel(panel.id)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <FileTabs
                files={jsFiles}
                activeFileId={activeFileId}
                onSelectFile={setActiveFileId}
                onAddFile={handleAddJsFile}
                onRenameFile={handleRenameJsFile}
                onDeleteFile={handleDeleteJsFile}
              />
              <div style={{ flex: 1, minHeight: 0 }}>
                <CodeEditor
                  key={activeFileId}
                  language="javascript"
                  value={activeFile?.content || ''}
                  onChange={handleUpdateJsFile}
                  label=""
                />
              </div>
            </div>
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
        <div className="header-left">
          <div>
            <h1>Canvas Learning Tool</h1>
            <p>Edit HTML, CSS, and JavaScript to see your canvas creations come to life!</p>
          </div>
          {saveMessage && <div className="save-message">{saveMessage}</div>}
        </div>
        <div className="header-right">
          <div className="file-operations">
            <button
              className="operation-btn"
              onClick={handleExport}
              title="Export project to JSON file"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.5 1.5v7.793l2.146-2.147.708.708L8 11.207 4.646 7.854l.708-.708L7.5 9.293V1.5h1zM2 14.5h12v1H2v-1z"/>
              </svg>
              Export
            </button>
            <button
              className="operation-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Import project from JSON file"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M7.5 14.5V6.707L5.354 8.854l-.708-.708L8 4.793l3.354 3.353-.708.708L8.5 6.707V14.5h-1zM2 2.5h12v-1H2v1z"/>
              </svg>
              Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
            <button
              className="operation-btn clear-btn"
              onClick={handleClear}
              title="Clear all code and reset to default"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 13c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z"/>
                <path d="M11.854 4.146l-.708.708L8 8l-3.146-3.146-.708.708L7.293 8.707 4.146 11.854l.708.708L8 9.414l3.146 3.146.708-.708L8.707 8.707z"/>
              </svg>
              Clear
            </button>
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
        </div>
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
