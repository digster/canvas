export function generatePreview(html: string, css: string, js: string): string {
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
      ${js}
    } catch (error) {
      console.error('JavaScript Error:', error);
      document.body.innerHTML += '<div style="color: red; padding: 10px; background: #fee; margin-top: 10px; border: 1px solid red; border-radius: 4px;"><strong>Error:</strong> ' + error.message + '</div>';
    }
  </script>
</body>
</html>`;
}

