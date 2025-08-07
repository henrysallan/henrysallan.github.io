export interface WindowState {
  id: string;
  type: WindowType;
  title: string;
  position: Position;
  size: { width: number; height: number };
}

export type WindowType = 'search' | 'rss' | 'notes' | 'ai' | 'bookmarks';

export interface Position {
  x: number;
  y: number;
}

export interface RSSArticle {
  title: string;
  link: string;
  description: string;
  source: string;
  pubDate: string;
}

export interface Note {
  id?: string;
  text: string;
  timestamp: string;
}

export interface Bookmark {
  id?: string;
  name: string;
  url: string;
  icon: string;
}

export interface AIModel {
  id: string;
  name: string;
  url: string;
}

// This empty export is crucial. It tells TypeScript that this file is a module,
// not a global script, which resolves "File is not a module" errors.
export {};