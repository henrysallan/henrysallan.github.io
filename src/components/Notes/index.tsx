import React, { useState } from 'react';
import { TextArea95, Button95 } from '../Windows95UI';
import { colors } from '../../styles/colors';
import { useNotes } from '../../hooks/useNotes';

export const Notes: React.FC = () => {
  const [note, setNote] = useState('');
  const { notes, saveNote } = useNotes();

  const handleSave = async () => {
    await saveNote(note);
    setNote('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      <TextArea95
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Type your note here..."
        style={{ height: '80px' }}
      />
      <Button95 onClick={handleSave} disabled={!note.trim()}>
        📝 Save Note
      </Button95>
      <div style={{ 
        flex: 1,
        overflow: 'auto',
        border: `2px solid`,
        borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`,
        padding: '4px',
        background: colors.textLight
      }}>
        {notes.map((n) => (
          <div key={n.id} style={{ borderBottom: `1px solid ${colors.borderDark}`, padding: '4px 0', marginBottom: '4px' }}>
            <div style={{ color: '#666', fontSize: '10px' }}>{new Date(n.timestamp).toLocaleString()}</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{n.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
