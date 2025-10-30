import type { ProjectData, JavaScriptFile } from '../types';

export function exportProject(html: string, css: string, jsFiles: JavaScriptFile[]): void {
  const projectData: ProjectData = {
    html,
    css,
    jsFiles,
    timestamp: Date.now(),
    version: '2.0.0',
  };

  const blob = new Blob([JSON.stringify(projectData, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `canvas-project-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importProject(file: File): Promise<ProjectData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as any;
        
        // Handle legacy format (version 1.0.0) with single js string
        if (data.version === '1.0.0' && data.js && typeof data.js === 'string') {
          const projectData: ProjectData = {
            html: data.html,
            css: data.css,
            jsFiles: [{
              id: crypto.randomUUID(),
              name: 'script.js',
              content: data.js
            }],
            timestamp: data.timestamp || Date.now(),
            version: '2.0.0'
          };
          resolve(projectData);
          return;
        }

        // Validate the new data structure (version 2.0.0)
        if (!data.html || !data.css || !Array.isArray(data.jsFiles)) {
          throw new Error('Invalid project file format');
        }

        // Validate jsFiles array
        if (data.jsFiles.length === 0 || !data.jsFiles.every((f: any) => f.id && f.name && typeof f.content === 'string')) {
          throw new Error('Invalid JavaScript files in project');
        }

        resolve(data as ProjectData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

