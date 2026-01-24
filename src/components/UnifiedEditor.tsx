import { useState, useEffect, useRef, useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { combineToUnified, parseFromUnified } from '../utils/unifiedDocument';
import type { JavaScriptFile } from '../types';

interface UnifiedEditorProps {
  html: string;
  css: string;
  jsFiles: JavaScriptFile[];
  onHtmlChange: (value: string) => void;
  onCssChange: (value: string) => void;
  onJsFilesChange: (files: JavaScriptFile[]) => void;
}

export function UnifiedEditor({
  html,
  css,
  jsFiles,
  onHtmlChange,
  onCssChange,
  onJsFilesChange,
}: UnifiedEditorProps) {
  // Track whether we're updating from external props vs internal edits
  const isInternalUpdate = useRef(false);
  const parseTimeoutRef = useRef<number | null>(null);

  // Generate the unified document from props
  const [unifiedContent, setUnifiedContent] = useState(() =>
    combineToUnified(html, css, jsFiles)
  );

  // Update unified content when props change (external updates)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const newUnified = combineToUnified(html, css, jsFiles);
    setUnifiedContent(newUnified);
  }, [html, css, jsFiles]);

  // Parse unified document and update parent state (debounced)
  const parseAndUpdate = useCallback(
    (content: string) => {
      if (parseTimeoutRef.current) {
        window.clearTimeout(parseTimeoutRef.current);
      }

      parseTimeoutRef.current = window.setTimeout(() => {
        const parsed = parseFromUnified(content);

        isInternalUpdate.current = true;

        // Only update if values actually changed
        if (parsed.html !== html) {
          onHtmlChange(parsed.html);
        }
        if (parsed.css !== css) {
          onCssChange(parsed.css);
        }

        // For JS files, check if content actually changed
        const jsChanged =
          parsed.jsFiles.length !== jsFiles.length ||
          parsed.jsFiles.some((file, i) => {
            const existing = jsFiles[i];
            return !existing || file.content !== existing.content || file.name !== existing.name;
          });

        if (jsChanged) {
          // Preserve existing IDs where possible based on position
          const updatedFiles = parsed.jsFiles.map((file, i) => ({
            ...file,
            id: jsFiles[i]?.id || file.id,
          }));
          onJsFilesChange(updatedFiles);
        }

        parseTimeoutRef.current = null;
      }, 150); // Debounce parsing by 150ms
    },
    [html, css, jsFiles, onHtmlChange, onCssChange, onJsFilesChange]
  );

  // Handle editor changes
  const handleChange = useCallback(
    (value: string) => {
      setUnifiedContent(value);
      parseAndUpdate(value);
    },
    [parseAndUpdate]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (parseTimeoutRef.current) {
        window.clearTimeout(parseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="unified-editor">
      <div className="unified-editor-header">
        <span className="editor-label">UNIFIED DOCUMENT</span>
      </div>
      <div className="unified-editor-content">
        <CodeEditor
          key="unified-editor"
          language="html"
          value={unifiedContent}
          onChange={handleChange}
          label=""
        />
      </div>
    </div>
  );
}
