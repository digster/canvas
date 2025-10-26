export type PanelId = 'html' | 'css' | 'javascript' | 'preview';

export interface PanelState {
  id: PanelId;
  label: string;
  visible: boolean;
  position: number;
}

