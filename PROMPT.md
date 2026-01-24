# Development Prompts Log

This file tracks prompts used during development with Claude.

---

## 2026-01-24: Create Documentation Files

**Prompt:**
Create the three missing documentation files required by CLAUDE.md instructions:
1. `ARCHITECTURE.md` - Project architecture documentation
2. `CLAUDE.md` - Project-specific Claude instructions
3. `PROMPT.md` - Development prompts log

**Outcome:**
- Created comprehensive ARCHITECTURE.md with project overview, tech stack, directory structure, data flow diagram, and key patterns
- Created CLAUDE.md with project-specific instructions
- Created PROMPT.md (this file) to track development prompts

---

## 2026-01-24: Layout Toggle Feature

**Prompt:**
Implement a layout toggle feature with two modes:
- **Grid Mode** (existing): 4 separate draggable panes in 2x2 grid
- **Split Mode** (new): 2 panes - tabbed code editors on left, preview on right

**Outcome:**
- Added `LayoutMode` and `EditorTabId` types to `types/index.ts`
- Created `LayoutToggle.tsx` - segmented button control with grid/split icons
- Created `TabbedEditor.tsx` - combined editor with HTML/CSS/JS tabs, shows FileTabs when JavaScript is active
- Created `SplitLayout.tsx` - split mode container using react-resizable-panels
- Updated `App.tsx` to integrate layout toggle with localStorage persistence
- Added CSS styles for layout toggle, editor tabs, and split layout
- Updated ARCHITECTURE.md and README.md documentation

**Files Changed:**
- `src/types/index.ts`
- `src/components/LayoutToggle.tsx` (new)
- `src/components/TabbedEditor.tsx` (new)
- `src/components/SplitLayout.tsx` (new)
- `src/App.tsx`
- `src/App.css`
- `ARCHITECTURE.md`
- `README.md`

---

## 2026-01-24: Unified Editor for Split Mode

**Prompt:**
Modify split mode to show a single unified editor (like editing one HTML file) instead of separate HTML/CSS/JS tabs. The unified document format combines:
- CSS in `<style>` tags within `<head>`
- HTML body content in `<body>`
- Each JS file as a `<script>` block with `<!-- filename.js -->` comment above

**Outcome:**
- Created `unifiedDocument.ts` utility with `combineToUnified()` and `parseFromUnified()` functions
- Created `UnifiedEditor.tsx` component replacing TabbedEditor
- Updated `SplitLayout.tsx` with simplified props interface
- Updated `App.tsx` to pass `onJsFilesChange` callback
- Removed `EditorTabId` type (no longer needed)
- Updated CSS styles (renamed tabbed-editor to unified-editor)
- Deleted `TabbedEditor.tsx` (replaced)
- Updated ARCHITECTURE.md documentation

**Files Changed:**
- `src/utils/unifiedDocument.ts` (new)
- `src/components/UnifiedEditor.tsx` (new)
- `src/components/SplitLayout.tsx`
- `src/App.tsx`
- `src/App.css`
- `src/types/index.ts`
- `src/components/TabbedEditor.tsx` (deleted)
- `ARCHITECTURE.md`

---

<!-- Template for future entries:

## YYYY-MM-DD: Brief Title

**Prompt:**
[Description of what was requested]

**Outcome:**
[What was accomplished]

---

-->
