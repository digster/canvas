import { useState, useEffect, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { CodeEditor } from './components/CodeEditor';
import { Preview } from './components/Preview';
import { generatePreview } from './utils/generatePreview';
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

function App() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [srcDoc, setSrcDoc] = useState('');

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Canvas Learning Tool</h1>
        <p>Edit HTML, CSS, and JavaScript to see your canvas creations come to life!</p>
      </header>
      
      <div className="editor-grid">
        <PanelGroup direction="vertical">
          <Panel defaultSize={50} minSize={20}>
            <PanelGroup direction="horizontal">
              <Panel defaultSize={50} minSize={20}>
                <CodeEditor
                  language="html"
                  value={html}
                  onChange={setHtml}
                  label="HTML"
                />
              </Panel>
              <PanelResizeHandle className="resize-handle resize-handle-horizontal" />
              <Panel defaultSize={50} minSize={20}>
                <CodeEditor
                  language="css"
                  value={css}
                  onChange={setCss}
                  label="CSS"
                />
              </Panel>
            </PanelGroup>
          </Panel>
          <PanelResizeHandle className="resize-handle resize-handle-vertical" />
          <Panel defaultSize={50} minSize={20}>
            <PanelGroup direction="horizontal">
              <Panel defaultSize={50} minSize={20}>
                <CodeEditor
                  language="javascript"
                  value={js}
                  onChange={setJs}
                  label="JavaScript"
                />
              </Panel>
              <PanelResizeHandle className="resize-handle resize-handle-horizontal" />
              <Panel defaultSize={50} minSize={20}>
                <Preview srcDoc={srcDoc} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default App;
