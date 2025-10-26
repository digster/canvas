export interface ProjectData {
  html: string;
  css: string;
  js: string;
  timestamp: number;
  version: string;
}

export function exportProject(html: string, css: string, js: string): void {
  const projectData: ProjectData = {
    html,
    css,
    js,
    timestamp: Date.now(),
    version: '1.0.0',
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
        const data = JSON.parse(event.target?.result as string) as ProjectData;
        
        // Validate the data structure
        if (!data.html || !data.css || !data.js) {
          throw new Error('Invalid project file format');
        }

        resolve(data);
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

