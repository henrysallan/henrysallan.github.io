import { WindowState } from '../types';

class LayoutService {
  private STORAGE_KEY = 'win95_layout';

  saveLayout(windows: WindowState[]): void {
    const layoutData = {
      windows,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(layoutData));
  }

  loadLayout(): WindowState[] | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.windows;
      } catch (e) {
        console.error('Failed to load layout:', e);
        return null;
      }
    }
    return null;
  }

  clearLayout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const layoutService = new LayoutService();