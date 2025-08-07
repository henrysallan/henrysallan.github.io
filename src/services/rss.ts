import { RSSArticle } from '../types';

const CORS_PROXY = "https://api.allorigins.win/raw?url=";

const feedUrls = [
  'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'http://astralcodexten.substack.com/feed'
];

class RSSService {
  async fetchFeeds(): Promise<RSSArticle[]> {
    const articles: RSSArticle[] = [];
    
    for (const url of feedUrls) {
      try {
        const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);
        if (!response.ok) {
          console.error(`Failed to fetch ${url}: ${response.statusText}`);
          continue;
        }
        const str = await response.text();
        const data = new window.DOMParser().parseFromString(str, "text/xml");
        
        const sourceTitle = data.querySelector("channel > title")?.textContent || 'Unknown Source';
        const items = data.querySelectorAll("item");
        
        items.forEach(item => {
          articles.push({
            title: item.querySelector("title")?.textContent || '',
            link: item.querySelector("link")?.textContent || '',
            description: item.querySelector("description")?.textContent?.replace(/<[^>]*>?/gm, '') || '', // Strip HTML tags
            pubDate: item.querySelector("pubDate")?.textContent || '',
            source: sourceTitle,
          });
        });
      } catch (error) {
        console.error(`Error parsing feed from ${url}:`, error);
      }
    }
    
    // Sort articles by publication date, newest first
    articles.sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return dateB - dateA;
    });

    return articles.slice(0, 30); // Return top 30 newest articles
  }
}

export const rssService = new RSSService();
