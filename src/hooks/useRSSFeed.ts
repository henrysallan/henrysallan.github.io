import { useState, useEffect } from 'react';
import { RSSArticle } from '../types';
import { rssService } from '../services/rss';

export const useRSSFeed = () => {
  const [articles, setArticles] = useState<RSSArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeeds = async () => {
      try {
        const data = await rssService.fetchFeeds();
        setArticles(data);
      } catch (err) {
        setError('Failed to load RSS feeds');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFeeds();
  }, []);

  return { articles, loading, error };
};