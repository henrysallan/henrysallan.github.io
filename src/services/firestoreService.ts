import { doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { WindowState, Note, Bookmark } from '../types';

class FirestoreService {
  // --- Layout Management ---
  async saveLayout(userId: string, windows: WindowState[]): Promise<void> {
    const layoutRef = doc(db, 'layouts', userId);
    await setDoc(layoutRef, { windows, timestamp: new Date() });
  }

  async loadLayout(userId: string): Promise<WindowState[] | null> {
    const layoutRef = doc(db, 'layouts', userId);
    const docSnap = await getDoc(layoutRef);
    if (docSnap.exists()) {
      return docSnap.data().windows as WindowState[];
    }
    return null;
  }

  // --- Notes Management ---
  async getNotes(userId: string): Promise<Note[]> {
    const notesCol = collection(db, 'users', userId, 'notes');
    const q = query(notesCol, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
  }

  async saveNote(userId: string, text: string): Promise<Note> {
    const newNote = {
      text,
      timestamp: new Date().toISOString()
    };
    const notesCol = collection(db, 'users', userId, 'notes');
    const docRef = await addDoc(notesCol, newNote);
    return { id: docRef.id, ...newNote };
  }

  // --- Bookmarks Management ---
  async getBookmarks(userId: string): Promise<Bookmark[]> {
    const bookmarksCol = collection(db, 'users', userId, 'bookmarks');
    const snapshot = await getDocs(bookmarksCol);
    if (snapshot.empty) {
        return [ // Return default bookmarks for new users
            { name: 'GitHub', url: 'https://github.com', icon: '📁' },
            { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: '📰' },
        ];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bookmark));
  }

  async addBookmark(userId: string, bookmark: Omit<Bookmark, 'id'>): Promise<Bookmark> {
    const bookmarksCol = collection(db, 'users', userId, 'bookmarks');
    const docRef = await addDoc(bookmarksCol, bookmark);
    return { id: docRef.id, ...bookmark };
  }

  async removeBookmark(userId: string, bookmarkId: string): Promise<void> {
    const bookmarkRef = doc(db, 'users', userId, 'bookmarks', bookmarkId);
    await deleteDoc(bookmarkRef);
  }
}

export const firestoreService = new FirestoreService();