import { create } from 'zustand';
import { WindowState, WindowType, Position } from '../types';
import { layoutService } from '../services/layout';

interface WindowStore {
  windows: WindowState[];
  activeWindow: string | null;
  
  addWindow: (type: WindowType) => void;
  removeWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: Position) => void;
  focusWindow: (id: string) => void;
  saveLayout: () => void;
  loadLayout: () => void;
  clearAll: () => void;
}

const windowTitles: Record<WindowType, string> = {
  search: 'Search',
  rss: 'RSS Feed',
  notes: 'Quick Notes',
  ai: 'AI Assistant',
  bookmarks: 'Bookmarks'
};

const defaultSizes: Record<WindowType, { width: number; height: number }> = {
  search: { width: 400, height: 100 },
  rss: { width: 350, height: 300 },
  notes: { width: 300, height: 300 },
  ai: { width: 280, height: 250 },
  bookmarks: { width: 200, height: 200 }
};

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindow: null,

  addWindow: (type) => {
    const newWindow: WindowState = {
      id: `${type}-${Date.now()}`,
      type,
      title: windowTitles[type],
      position: { 
        x: 100 + Math.random() * 200, 
        y: 100 + Math.random() * 100 
      },
      size: defaultSizes[type]
    };
    
    set(state => ({
      windows: [...state.windows, newWindow],
      activeWindow: newWindow.id
    }));
  },

  removeWindow: (id) => {
    set(state => ({
      windows: state.windows.filter(w => w.id !== id),
      activeWindow: state.activeWindow === id ? null : state.activeWindow
    }));
  },

  updateWindowPosition: (id, position) => {
    set(state => ({
      windows: state.windows.map(w => 
        w.id === id ? { ...w, position } : w
      )
    }));
  },

  focusWindow: (id) => {
    set({ activeWindow: id });
  },

  saveLayout: () => {
    const { windows } = get();
    layoutService.saveLayout(windows);
  },

  loadLayout: () => {
    const saved = layoutService.loadLayout();
    if (saved) {
      set({ windows: saved });
    }
  },

  clearAll: () => {
    if (confirm('Clear all windows?')) {
      set({ windows: [], activeWindow: null });
    }
  }
}));