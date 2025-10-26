# Canvas Learning Tool

A modern, interactive canvas learning tool similar to JSFiddle, built with React, TypeScript, and Monaco Editor.

## Features

- **Live Code Editing**: Edit HTML, CSS, and JavaScript in real-time with Monaco Editor (the same editor that powers VSCode)
- **Instant Preview**: See your canvas creations update automatically as you type
- **Syntax Highlighting**: Full syntax highlighting and IntelliSense for HTML, CSS, and JavaScript
- **Error Handling**: JavaScript errors are displayed in the preview pane
- **Modern UI**: Clean, dark-themed interface with a responsive grid layout

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

1. **HTML Editor** (Top Left): Define your canvas element and any other HTML structure
2. **CSS Editor** (Top Right): Style your canvas and page elements
3. **JavaScript Editor** (Bottom Left): Write your canvas drawing code
4. **Preview** (Bottom Right): See your canvas come to life in real-time

The preview updates automatically after 300ms of inactivity to provide smooth editing experience.

## Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Monaco Editor**: Full-featured code editor
- **CSS Grid**: Responsive layout system

## Project Structure

```
src/
├── components/
│   ├── CodeEditor.tsx    # Monaco editor wrapper
│   └── Preview.tsx       # Live preview iframe
├── utils/
│   └── generatePreview.ts # HTML generation logic
├── App.tsx               # Main application
├── App.css              # Application styles
└── main.tsx             # Entry point
```

## License

MIT
