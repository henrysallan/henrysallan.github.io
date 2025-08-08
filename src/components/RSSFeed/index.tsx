import React from 'react';
import { colors } from '../../styles/colors';
import { useRSSFeed } from '../../hooks/useRSSFeed';

export const RSSFeed: React.FC = () => {
  const { articles, loading, error } = useRSSFeed();

  if (loading) {
    return <div style={{ padding: '8px' }}>Loading feeds...</div>;
  }

  if (error) {
    return <div style={{ padding: '8px', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ 
      height: '100%', 
      overflowY: 'auto', 
      background: '#ffffff', 
      color: '#000000', 
      fontFamily: "'Pixelify Sans', monospace",
      border: `2px solid`, 
      borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}` 
    }}>
      {articles.map((article, idx) => (
        <div 
          key={idx} 
          style={{
            borderBottom: `1px solid ${colors.borderDark}`,
            padding: '8px',
            cursor: 'pointer',
          }}
          onClick={() => window.open(article.link, '_blank')}
        >
          <div style={{ 
            fontWeight: 'bold', 
            marginBottom: '2px', 
            fontSize: '12px', 
            color: '#000000',
            fontFamily: "'Pixelify Sans', monospace"
          }}>
            {article.title}
          </div>
          <div style={{ 
            color: '#000000', 
            fontSize: '11px', 
            marginBottom: '4px', 
            maxHeight: '4.5em', 
            overflow: 'hidden',
            fontFamily: "'Pixelify Sans', monospace"
          }}>
            {article.description}
          </div>
          <div style={{ 
            color: '#666666', 
            fontSize: '10px', 
            fontStyle: 'italic', 
            display: 'flex', 
            justifyContent: 'space-between',
            fontFamily: "'Pixelify Sans', monospace"
          }}>
            <span>— {article.source}</span>
            {article.pubDate && <span>{new Date(article.pubDate).toLocaleDateString()}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};