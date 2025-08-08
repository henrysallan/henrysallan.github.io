import { Key } from 'react';

export interface WindowState {
  id: string;
  type: WindowType;
  title: string;
  position: Position;
  size: Size;
}

export type WindowType = 'search' | 'rss' | 'notes' | 'ai' | 'bookmarks' | 'calendar' | 'uidemo';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface RSSArticle {
  title: string;
  description: string;
  link: string;
  source: string;
  pubDate?: string;
}

export interface Note {
  id?: string;
  text: string;
  timestamp: string;
}

export interface Bookmark {
  id: Key | null | undefined;
  name: string;
  url: string;
  icon: string;
}

export interface AIModel {
  id: string;
  name: string;
  url: string;
}

export {};