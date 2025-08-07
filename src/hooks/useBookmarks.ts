import { useState, useEffect } from 'react';
import { Bookmark } from '../types';
import { bookmarksService } from '../services/bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      const saved = await bookmarksService.getBookmarks();
      setBookmarks(saved);
    };
    loadBookmarks();
  }, []);

  const addBookmark = async (bookmark: Bookmark) => {
    const updated = await bookmarksService.addBookmark(bookmark);
    setBookmarks(updated);
  };

  const removeBookmark = async (url: string) => {
    const updated = await bookmarksService.removeBookmark(url);
    setBookmarks(updated);
  };

  return { bookmarks, addBookmark, removeBookmark };
};