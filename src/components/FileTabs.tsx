import { useState } from 'react';
import type { JavaScriptFile } from '../types';

interface FileTabsProps {
  files: JavaScriptFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onAddFile: () => void;
  onRenameFile: (id: string, newName: string) => void;
  onDeleteFile: (id: string) => void;
}

export function FileTabs({
  files,
  activeFileId,
  onSelectFile,
  onAddFile,
  onRenameFile,
  onDeleteFile,
}: FileTabsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartRename = (file: JavaScriptFile) => {
    setEditingId(file.id);
    setEditingName(file.name);
  };

  const handleFinishRename = (id: string) => {
    if (editingName.trim() && editingName !== files.find(f => f.id === id)?.name) {
      onRenameFile(id, editingName.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleFinishRename(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (files.length > 1) {
      if (window.confirm('Are you sure you want to delete this file?')) {
        onDeleteFile(id);
      }
    } else {
      alert('Cannot delete the last JavaScript file');
    }
  };

  return (
    <div className="file-tabs">
      <div className="tabs-container">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-tab ${file.id === activeFileId ? 'active' : ''}`}
            onClick={() => onSelectFile(file.id)}
          >
            {editingId === file.id ? (
              <input
                type="text"
                className="file-tab-input"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleFinishRename(file.id)}
                onKeyDown={(e) => handleKeyDown(e, file.id)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                <span 
                  className="file-tab-name"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleStartRename(file);
                  }}
                  title="Double-click to rename"
                >
                  {file.name}
                </span>
                {files.length > 1 && (
                  <button
                    className="file-tab-close"
                    onClick={(e) => handleDelete(e, file.id)}
                    title="Delete file"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 7.293l2.146-2.147.708.708L8.707 8l2.147 2.146-.708.708L8 8.707l-2.146 2.147-.708-.708L7.293 8 5.146 5.854l.708-.708L8 7.293z"/>
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
        ))}
        <button
          className="file-tab-add"
          onClick={onAddFile}
          title="Add new JavaScript file"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3.5v9m-4.5-4.5h9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

