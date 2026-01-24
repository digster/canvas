# Architecture

## Overview

Canvas Learning Tool is an interactive browser-based code editor designed for teaching the HTML Canvas API. It provides a split-pane interface where users can write HTML, CSS, and JavaScript code while seeing live preview results.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Monaco Editor | Code editing (VS Code engine) |
| react-resizable-panels | Resizable split panes |
| dnd-kit | Drag-and-drop panel reordering |

## Directory Structure

```
src/
├── components/           # React components
│   ├── CodeEditor.tsx    # Monaco editor wrapper
│   ├── Preview.tsx       # iframe preview renderer
│   ├── DraggablePanel.tsx # Drag-and-drop panel wrapper
│   └── FileTabs.tsx      # Tab interface for JS files
├── hooks/
│   └── useLocalStorage.ts # Persistence hook
├── utils/
│   ├── generatePreview.ts # HTML generation for iframe
│   └── fileOperations.ts  # File CRUD operations
├── types/
│   └── index.ts          # TypeScript definitions
├── App.tsx               # Main application component
└── main.tsx              # Entry point
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      User Input                              │
│              (Code changes in Monaco Editor)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    State Update                              │
│         (React state for HTML, CSS, JS files)               │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────────┐   ┌─────────────────────────────────┐
│  localStorage Sync  │   │    Debounced Preview Generation │
│  (useLocalStorage)  │   │      (generatePreview util)     │
└─────────────────────┘   └─────────────────┬───────────────┘
                                            │
                                            ▼
                          ┌─────────────────────────────────┐
                          │      iframe Render              │
                          │   (Preview component)           │
                          └─────────────────────────────────┘
```

## Key Architectural Patterns

### 1. Memoized Components
Components use `React.memo` and `useMemo` to prevent unnecessary re-renders, critical for smooth editor performance.

### 2. Custom useLocalStorage Hook
All code state persists to localStorage automatically. The hook handles:
- Initial state hydration from storage
- Debounced writes to prevent performance issues
- Serialization/deserialization

### 3. 2x2 Grid Panel Layout
The UI uses a flexible grid of four panels:
- HTML Editor
- CSS Editor
- JavaScript Editor (with file tabs)
- Live Preview

Panels can be reordered via drag-and-drop using dnd-kit.

### 4. Multiple JS File Support
JavaScript code is organized into multiple files managed through tabs:
- Files stored as array in state
- Active file tracked separately
- All JS files concatenated in order for preview generation

### 5. Preview Generation
The `generatePreview` utility constructs a complete HTML document:
```
<!DOCTYPE html>
<html>
<head>
  <style>{CSS content}</style>
</head>
<body>
  {HTML content}
  <script>{All JS files concatenated}</script>
</body>
</html>
```

## Build & Development

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Key Files

- `src/App.tsx` - Main component orchestrating state and layout
- `src/components/CodeEditor.tsx` - Monaco editor integration
- `src/utils/generatePreview.ts` - Preview HTML generation logic
- `src/hooks/useLocalStorage.ts` - Persistence layer
