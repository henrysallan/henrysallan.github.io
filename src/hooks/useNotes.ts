import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import { firestoreService } from '../services/firestoreService';
import { useWindowStore } from '../store/useWindowStore';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const userId = useWindowStore(state => state.userId);

  const loadNotes = useCallback(async () => {
    if (userId) {
      const savedNotes = await firestoreService.getNotes(userId);
      setNotes(savedNotes);
    }
  }, [userId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const saveNote = async (text: string) => {
    if (userId) {
      await firestoreService.saveNote(userId, text);
      loadNotes(); // Reload notes to show the new one
    }
  };

  return { notes, saveNote };
};