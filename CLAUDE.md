# Claude Instructions for Canvas Project

## Project Overview
Interactive Canvas API learning tool with live code preview.

## Key Commands
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - Linting

## Architecture
See `ARCHITECTURE.md` for detailed architecture documentation.

## Code Patterns
- Use React.memo for performance-critical components
- State changes should flow through App.tsx
- All persistence handled via useLocalStorage hook
- Preview generation is debounced (see generatePreview.ts)

## Testing
- Test UI changes in actual browser
- Verify localStorage persistence works
- Check panel drag-and-drop functionality
- Test with multiple JS files
