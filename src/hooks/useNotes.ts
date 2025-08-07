import { useState, useEffect } from 'react';
import { Note } from '../types';
import { notesService } from '../services/notes';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const loadNotes = async () => {
      const savedNotes = await notesService.getNotes();
      setNotes(savedNotes);
    };
    loadNotes();
  }, []);

  const saveNote = async (text: string) => {
    const newNote = await notesService.saveNote(text);
    setNotes([newNote, ...notes].slice(0, 5));
  };

  return { notes, saveNote };
};