import { Bookmark } from '../types';

class BookmarksService {
  private STORAGE_KEY = 'win95_bookmarks';
  
  private defaultBookmarks: Bookmark[] = [
    { name: 'GitHub', url: 'https://github.com', icon: '📁' },
    { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: '📰' },
    { name: 'Reddit', url: 'https://reddit.com', icon: '🗨️' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '💻' }
  ];

  async getBookmarks(): Promise<Bookmark[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : this.defaultBookmarks;
  }

  async addBookmark(bookmark: Bookmark): Promise<Bookmark[]> {
    const bookmarks = await this.getBookmarks();
    const updated = [...bookmarks, bookmark];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  async removeBookmark(url: string): Promise<Bookmark[]> {
    const bookmarks = await this.getBookmarks();
    const updated = bookmarks.filter(b => b.url !== url);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
}

export const bookmarksService = new BookmarksService();