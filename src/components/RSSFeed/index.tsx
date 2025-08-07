import React from 'react';
import { colors } from '../../styles/colors';
import { useRSSFeed } from '../../hooks/useRSSFeed';

export const RSSFeed: React.FC = () => {
  const { articles, loading, error } = useRSSFeed();

  if (loading) {
    return <div style={{ padding: '8px' }}>Loading feeds...</div>;
  }

  if (error) {
    return <div style={{ padding: '8px', color: 'red' }}>Error loading feeds</div>;
  }

  return (
    <div style={{ height: '100%', minHeight: '200px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {articles.map((article, idx) => (
          <div 
            key={idx} 
            style={{
              borderBottom: `1px solid ${colors.border}`,
              padding: '8px',
              cursor: 'pointer',
              background: colors.textLight
            }}
            onClick={() => window.open(article.link, '_blank')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e0e0e0'}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.textLight}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '2px', fontSize: '11px' }}>
              {article.title}
            </div>
            <div style={{ color: '#666', fontSize: '10px', marginBottom: '2px' }}>
              {article.description}
            </div>
            <div style={{ color: '#999', fontSize: '9px', fontStyle: 'italic' }}>
              — {article.source}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};