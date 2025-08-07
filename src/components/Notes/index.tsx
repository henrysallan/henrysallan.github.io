import React, { useState } from 'react';
import { TextArea95, Button95 } from '../Windows95UI';
import { colors } from '../../styles/colors';
import { useNotes } from '../../hooks/useNotes';

export const Notes: React.FC = () => {
  const [note, setNote] = useState('');
  const { notes, saveNote } = useNotes();

  const handleSave = async () => {
    if (note.trim()) {
      await saveNote(note);
      setNote('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      <TextArea95
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Type your note here..."
        style={{ minHeight: '80px' }}
      />
      <Button95 onClick={handleSave}>
        📝 Save Note
      </Button95>
      {notes.length > 0 && (
        <div style={{ 
          flex: 1,
          overflow: 'auto',
          border: `2px solid`,
          borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`,
          padding: '4px',
          background: colors.textLight
        }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>Recent Notes:</div>
          {notes.map((n, idx) => (
            <div key={idx} style={{ 
              fontSize: '10px', 
              borderBottom: `1px solid ${colors.border}`, 
              padding: '4px 0',
              marginBottom: '4px'
            }}>
              <div style={{ color: '#666', fontSize: '9px' }}>{n.timestamp}</div>
              <div>{n.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};