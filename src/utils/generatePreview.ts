import type { JavaScriptFile } from '../types';

export function generatePreview(html: string, css: string, jsFiles: JavaScriptFile[]): string {
  // Concatenate all JavaScript files with file name comments
  const combinedJs = jsFiles.map(file => 
    `// === ${file.name} ===\n${file.content}`
  ).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 16px;
      font-family: system-ui, -apple-system, sans-serif;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    try {
      ${combinedJs}
    } catch (error) {
      console.error('JavaScript Error:', error);
      document.body.innerHTML += '<div style="color: red; padding: 10px; background: #fee; margin-top: 10px; border: 1px solid red; border-radius: 4px;"><strong>Error:</strong> ' + error.message + '</div>';
    }
  </script>
</body>
</html>`;
}

