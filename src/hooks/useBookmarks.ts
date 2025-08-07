import { useState, useEffect, useCallback } from 'react';
import { Bookmark } from '../types';
import { firestoreService } from '../services/firestoreService';
import { useWindowStore } from '../store/useWindowStore';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const userId = useWindowStore(state => state.userId);

  const loadBookmarks = useCallback(async () => {
    if (userId) {
      const saved = await firestoreService.getBookmarks(userId);
      setBookmarks(saved);
    }
  }, [userId]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const addBookmark = async (bookmark: Omit<Bookmark, 'id'>) => {
    if (userId) {
      await firestoreService.addBookmark(userId, bookmark);
      loadBookmarks();
    }
  };

  const removeBookmark = async (id: string) => {
    if (userId) {
      await firestoreService.removeBookmark(userId, id);
      loadBookmarks();
    }
  };

  return { bookmarks, addBookmark, removeBookmark };
};