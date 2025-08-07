import { RSSArticle } from '../types';

// Mock RSS service - replace with Firebase Functions call
class RSSService {
  async fetchFeeds(): Promise<RSSArticle[]> {
    // This will be replaced with actual RSS fetching via Firebase
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { 
            title: "Breaking: Windows 95 Makes a Comeback", 
            description: "Nostalgic developers everywhere rejoice as retro UI makes a return...", 
            link: "https://example.com/1",
            source: "NYT Technology"
          },
          { 
            title: "The Art of RSS in 2025", 
            description: "Why RSS feeds are still relevant in the age of social media...", 
            link: "https://example.com/2",
            source: "NYT World"
          },
          { 
            title: "On Building Personal Dashboards", 
            description: "Scott Alexander discusses the philosophy of personal information management...", 
            link: "https://example.com/3",
            source: "Astral Codex Ten"
          }
        ]);
      }, 1000);
    });
  }
}

export const rssService = new RSSService();