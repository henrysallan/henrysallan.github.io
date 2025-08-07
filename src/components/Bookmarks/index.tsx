import React, { useState } from 'react';
import { Button95, Input95 } from '../Windows95UI';
import { colors } from '../../styles/colors';
import { useBookmarks } from '../../hooks/useBookmarks';

export const Bookmarks: React.FC = () => {
  const { bookmarks, addBookmark } = useBookmarks(); // Removed unused removeBookmark
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '' });

  const handleAdd = () => {
    if (newLink.name && newLink.url) {
      addBookmark({ ...newLink, icon: '🔗' });
      setNewLink({ name: '', url: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {bookmarks.map((link, idx) => (
        <Button95 
          key={idx}
          onClick={() => window.open(link.url, '_blank')}
          style={{ 
            textAlign: 'left',
            justifyContent: 'flex-start',
            padding: '4px 8px'
          }}
        >
          <span style={{ marginRight: '6px' }}>{link.icon}</span>
          {link.name}
        </Button95>
      ))}
      
      {showAddForm ? (
        <div style={{ 
          border: `2px solid`,
          borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`,
          padding: '4px',
          background: colors.windowBg
        }}>
          <Input95
            value={newLink.name}
            onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
            placeholder="Name"
            style={{ width: '100%', marginBottom: '4px' }}
          />
          <Input95
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            placeholder="URL"
            style={{ width: '100%', marginBottom: '4px' }}
          />
          <div style={{ display: 'flex', gap: '4px' }}>
            <Button95 onClick={handleAdd} style={{ fontSize: '10px', padding: '2px 6px' }}>OK</Button95>
            <Button95 onClick={() => setShowAddForm(false)} style={{ fontSize: '10px', padding: '2px 6px' }}>Cancel</Button95>
          </div>
        </div>
      ) : (
        <Button95 onClick={() => setShowAddForm(true)} style={{ marginTop: '8px' }}>
          ➕ Add Bookmark
        </Button95>
      )}
    </div>
  );
};