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
    <div style={{ height: '100%', overflowY: 'auto', background: colors.textLight, border: `2px solid`, borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}` }}>
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
          <div style={{ fontWeight: 'bold', marginBottom: '2px', fontSize: '12px' }}>
            {article.title}
          </div>
          <div style={{ color: '#333', fontSize: '11px', marginBottom: '4px', maxHeight: '4.5em', overflow: 'hidden' }}>
            {article.description}
          </div>
          <div style={{ color: '#555', fontSize: '10px', fontStyle: 'italic', display: 'flex', justifyContent: 'space-between' }}>
            <span>— {article.source}</span>
            {article.pubDate && <span>{new Date(article.pubDate).toLocaleDateString()}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};