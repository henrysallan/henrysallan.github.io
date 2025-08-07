import { Note } from '../types';

class NotesService {
  private STORAGE_KEY = 'win95_notes';

  async getNotes(): Promise<Note[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async saveNote(text: string): Promise<Note> {
    const note: Note = {
      text,
      timestamp: new Date().toLocaleString()
    };
    
    const notes = await this.getNotes();
    const updated = [note, ...notes].slice(0, 10);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    
    // TODO: Sync with Firebase/Notion
    
    return note;
  }
}

export const notesService = new NotesService();