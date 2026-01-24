export type PanelId = 'html' | 'css' | 'javascript' | 'preview';

export type LayoutMode = 'grid' | 'split';

export interface PanelState {
  id: PanelId;
  label: string;
  visible: boolean;
  position: number;
}

export interface JavaScriptFile {
  id: string;
  name: string;
  content: string;
}

export interface ProjectData {
  html: string;
  css: string;
  jsFiles: JavaScriptFile[];
  timestamp: number;
  version: string;
}

