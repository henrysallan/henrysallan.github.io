import React, { useState } from 'react';
import { Input95, Button95 } from '../Windows95UI';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      setQuery('');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '4px', 
      alignItems: 'center',
      fontFamily: "'Pixelify Sans', monospace"
    }}>
      <span style={{ fontSize: '16px' }}>🔍</span>
      <Input95
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search Google..."
        style={{ flex: 1, width: '300px' }}
      />
      <Button95 onClick={handleSearch}>Go</Button95>
    </div>
  );
};