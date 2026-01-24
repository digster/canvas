# Canvas Learning Tool

A modern, interactive canvas learning tool similar to JSFiddle, built with React, TypeScript, and Monaco Editor.

## Features

- **Live Code Editing**: Edit HTML, CSS, and JavaScript in real-time with Monaco Editor (the same editor that powers VSCode)
- **Dual Layout Modes**: Switch between Grid mode (4 draggable panels) and Split mode (tabbed editor + preview)
- **Auto-Save**: Your work is automatically saved to browser localStorage as you type
- **Export/Import**: Save your projects as JSON files and load them later
- **Resizable Panes**: Drag the borders between panes to adjust their sizes to your preference
- **Draggable Panels**: Click and drag the grip icon in any panel header to reorder panels (Grid mode)
- **Closable Panels**: Close any panel you don't need with the × button, and reopen it from the header menu (Grid mode)
- **Instant Preview**: See your canvas creations update automatically as you type
- **Syntax Highlighting**: Full syntax highlighting and IntelliSense for HTML, CSS, and JavaScript
- **Error Handling**: JavaScript errors are displayed in the preview pane
- **Modern UI**: Clean, dark-themed interface with a responsive layout

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or another port if 5173 is in use).

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

The tool consists of four panels that you can customize to your workflow:

1. **HTML Editor**: Define your canvas element and any other HTML structure
2. **CSS Editor**: Style your canvas and page elements
3. **JavaScript Editor**: Write your canvas drawing code
4. **Preview**: See your canvas come to life in real-time

**Customization Tips:**

- **Layout Toggle**: Use the Grid/Split toggle in the header to switch between layouts:
  - **Grid Mode**: 4-panel layout with drag-and-drop reordering
  - **Split Mode**: Tabbed editor on left, preview on right
- **Auto-Save**: Your work is automatically saved to browser localStorage - close and reopen the app anytime
- **Export Project**: Click the "Export" button to download your project as a JSON file
- **Import Project**: Click the "Import" button to load a previously exported project
- **Clear Code**: Click the "Clear" button to reset all code to the default example
- **Resize Panes**:
  - Drag the **horizontal borders** between left/right panels in each row to adjust widths
  - Drag the **vertical border** between top and bottom rows to adjust heights
  - Resize handles turn blue when you hover over them
- **Reorder Panels**: Click and drag the grip icon (⋮⋮) in any panel header to reorder panels (Grid mode only)
- **Close Panels**: Click the × button to close any panel you don't need at the moment (Grid mode only)
- **Reopen Panels**: Closed panels appear as buttons in the header - click to reopen them
- **Auto-Preview**: The preview updates automatically after 300ms of inactivity for a smooth editing experience
- **Responsive Layout**: Panels adapt to your screen size and custom arrangements

## Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Monaco Editor**: Full-featured code editor (same as VS Code)
- **react-resizable-panels**: Resizable split-pane layout
- **dnd-kit**: Modern drag and drop for reordering panels

## Project Structure

```
src/
├── components/
│   ├── CodeEditor.tsx       # Monaco editor wrapper
│   ├── DraggablePanel.tsx   # Draggable panel wrapper
│   ├── FileTabs.tsx         # Tab interface for JS files
│   ├── LayoutToggle.tsx     # Grid/Split mode toggle
│   ├── Preview.tsx          # Live preview iframe
│   ├── SplitLayout.tsx      # Split mode layout container
│   └── TabbedEditor.tsx     # Tabbed editor for split mode
├── hooks/
│   └── useLocalStorage.ts   # localStorage persistence hook
├── utils/
│   ├── generatePreview.ts   # HTML generation logic
│   └── fileOperations.ts    # Export/import functionality
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                  # Main application
├── App.css                  # Application styles
└── main.tsx                 # Entry point
```

## License

MIT
