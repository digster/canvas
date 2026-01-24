import type { JavaScriptFile } from '../types';

/**
 * Combines separate HTML, CSS, and JS files into a unified HTML document.
 * This creates a single editable document that looks like a complete HTML file.
 */
export function combineToUnified(
  html: string,
  css: string,
  jsFiles: JavaScriptFile[]
): string {
  const lines: string[] = [];

  lines.push('<!DOCTYPE html>');
  lines.push('<html>');
  lines.push('<head>');

  // Add CSS in style tag if not empty
  if (css.trim()) {
    lines.push('  <style>');
    // Indent CSS content
    const cssLines = css.split('\n');
    cssLines.forEach(line => {
      lines.push(line ? `    ${line}` : '');
    });
    lines.push('  </style>');
  }

  lines.push('</head>');
  lines.push('<body>');

  // Add HTML content (body content)
  if (html.trim()) {
    const htmlLines = html.split('\n');
    htmlLines.forEach(line => {
      lines.push(line ? `  ${line}` : '');
    });
  }

  // Add each JS file as a separate script block with identifying comment
  jsFiles.forEach((file, index) => {
    if (index === 0 && html.trim()) {
      lines.push('');
    }
    lines.push(`  <!-- ${file.name} -->`);
    lines.push('  <script>');
    const jsLines = file.content.split('\n');
    jsLines.forEach(line => {
      lines.push(line ? `    ${line}` : '');
    });
    lines.push('  </script>');
    if (index < jsFiles.length - 1) {
      lines.push('');
    }
  });

  lines.push('</body>');
  lines.push('</html>');

  return lines.join('\n');
}

/**
 * Parse result from parseFromUnified
 */
export interface ParsedDocument {
  html: string;
  css: string;
  jsFiles: JavaScriptFile[];
}

/**
 * Parses a unified HTML document back into separate HTML, CSS, and JS parts.
 * Handles malformed documents gracefully.
 */
export function parseFromUnified(unified: string): ParsedDocument {
  const result: ParsedDocument = {
    html: '',
    css: '',
    jsFiles: [],
  };

  // Extract CSS from <style> tags in <head>
  const styleMatch = unified.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (styleMatch) {
    result.css = dedentContent(styleMatch[1]);
  }

  // Extract all script blocks with their preceding comments
  const scriptRegex = /(?:<!--\s*([^>]+\.js)\s*-->\s*)?<script[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  let scriptIndex = 0;

  while ((scriptMatch = scriptRegex.exec(unified)) !== null) {
    const filename = scriptMatch[1] || `script${scriptIndex > 0 ? scriptIndex + 1 : ''}.js`;
    const content = dedentContent(scriptMatch[2]);

    result.jsFiles.push({
      id: `js-${Date.now()}-${scriptIndex}`,
      name: filename.trim(),
      content,
    });
    scriptIndex++;
  }

  // If no JS files found, create a default empty one
  if (result.jsFiles.length === 0) {
    result.jsFiles.push({
      id: `js-${Date.now()}`,
      name: 'main.js',
      content: '',
    });
  }

  // Extract HTML body content (excluding script tags and their comments)
  const bodyMatch = unified.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    let bodyContent = bodyMatch[1];

    // Remove script blocks and their preceding comments
    bodyContent = bodyContent.replace(/<!--\s*[^>]+\.js\s*-->\s*<script[^>]*>[\s\S]*?<\/script>/gi, '');
    bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    result.html = dedentContent(bodyContent);
  }

  return result;
}

/**
 * Remove common leading whitespace from content (dedent).
 * Preserves relative indentation within the content.
 */
function dedentContent(content: string): string {
  const lines = content.split('\n');

  // Find minimum indentation (ignoring empty lines)
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    const match = line.match(/^(\s*)/);
    if (match) {
      minIndent = Math.min(minIndent, match[1].length);
    }
  }

  if (minIndent === Infinity || minIndent === 0) {
    return content.trim();
  }

  // Remove the minimum indentation from all lines
  const dedented = lines.map(line => {
    if (line.trim().length === 0) return '';
    return line.slice(minIndent);
  });

  // Trim leading/trailing empty lines
  while (dedented.length > 0 && dedented[0].trim() === '') {
    dedented.shift();
  }
  while (dedented.length > 0 && dedented[dedented.length - 1].trim() === '') {
    dedented.pop();
  }

  return dedented.join('\n');
}
