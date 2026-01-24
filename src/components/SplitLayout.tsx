import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { UnifiedEditor } from './UnifiedEditor';
import { Preview } from './Preview';
import type { JavaScriptFile } from '../types';

interface SplitLayoutProps {
  html: string;
  css: string;
  jsFiles: JavaScriptFile[];
  srcDoc: string;
  onHtmlChange: (value: string) => void;
  onCssChange: (value: string) => void;
  onJsFilesChange: (files: JavaScriptFile[]) => void;
}

export function SplitLayout({
  html,
  css,
  jsFiles,
  srcDoc,
  onHtmlChange,
  onCssChange,
  onJsFilesChange,
}: SplitLayoutProps) {
  return (
    <div className="split-layout">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50} minSize={25}>
          <UnifiedEditor
            html={html}
            css={css}
            jsFiles={jsFiles}
            onHtmlChange={onHtmlChange}
            onCssChange={onCssChange}
            onJsFilesChange={onJsFilesChange}
          />
        </Panel>
        <PanelResizeHandle className="resize-handle resize-handle-horizontal" />
        <Panel defaultSize={50} minSize={25}>
          <div className="split-preview-container">
            <div className="split-preview-header">
              <span className="preview-label">PREVIEW</span>
            </div>
            <Preview srcDoc={srcDoc} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
