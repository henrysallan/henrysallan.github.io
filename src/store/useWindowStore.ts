import { create } from 'zustand';
import { WindowState, WindowType, Position } from '../types/index';
import { firestoreService } from '../services/firestoreService';

interface WindowStore {
  windows: WindowState[];
  activeWindow: string | null;
  userId: string | null;
  setUserId: (userId: string | null) => void;
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
  bookmarks: 'Bookmarks',
  calendar: 'Calendar'
};

const defaultSizes: Record<WindowType, { width: number; height: number }> = {
  search: { width: 400, height: 100 },
  rss: { width: 350, height: 400 },
  notes: { width: 300, height: 350 },
  ai: { width: 280, height: 250 },
  bookmarks: { width: 200, height: 250 },
  calendar: { width: 320, height: 420 }
};

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindow: null,
  userId: null,

  setUserId: (userId) => set({ userId }),

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

  saveLayout: async () => {
    const { windows, userId } = get();
    if (userId) {
      await firestoreService.saveLayout(userId, windows);
      alert('Layout saved!');
    }
  },

  loadLayout: async () => {
    const { userId } = get();
    if (userId) {
      const saved = await firestoreService.loadLayout(userId);
      if (saved) {
        set({ windows: saved });
      }
    }
  },

  clearAll: () => {
    if (confirm('Clear all windows? This cannot be undone.')) {
      set({ windows: [], activeWindow: null });
      const { userId } = get();
      if(userId) {
        // Also clear the layout in Firestore
        firestoreService.saveLayout(userId, []);
      }
    }
  }
}));