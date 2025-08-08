import { useState, useCallback } from 'react';

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  description?: string;
  location?: string;
}

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export const useCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const loadGoogleAPIs = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      // Load Google Identity Services
      if (window.google?.accounts) {
        resolve();
        return;
      }

      const gisScript = document.createElement('script');
      gisScript.src = 'https://accounts.google.com/gsi/client';
      gisScript.onload = () => {
        // Also load gapi for Calendar API calls
        const gapiScript = document.createElement('script');
        gapiScript.src = 'https://apis.google.com/js/api.js';
        gapiScript.onload = () => {
          window.gapi.load('client', {
            callback: resolve,
            onerror: reject
          });
        };
        gapiScript.onerror = reject;
        document.head.appendChild(gapiScript);
      };
      gisScript.onerror = reject;
      document.head.appendChild(gisScript);
    });
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      await loadGoogleAPIs();
      
      // Skip gapi client initialization with discovery docs for now
      // We'll use direct API calls instead
      
      // Use Google Identity Services for OAuth
      return new Promise((resolve) => {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/calendar.readonly',
          callback: (response: any) => {
            if (response.error) {
              console.error('OAuth error:', response);
              setError('Failed to authenticate with Google Calendar');
              resolve(false);
              return;
            }
            
            setAccessToken(response.access_token);
            setHasPermission(true);
            resolve(true);
          },
        });

        // Request access token
        tokenClient.requestAccessToken({ prompt: 'consent' });
      });
      
    } catch (error) {
      console.error('Calendar permission error:', error);
      setError('Failed to get calendar permission. Please check your Google API configuration.');
      return false;
    }
  }, [loadGoogleAPIs]);

  const loadEvents = useCallback(async () => {
    if (!hasPermission || !accessToken) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get events from primary calendar for the next 30 days using direct API call
      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
      url.searchParams.append('timeMin', timeMin);
      url.searchParams.append('timeMax', timeMax);
      url.searchParams.append('singleEvents', 'true');
      url.searchParams.append('orderBy', 'startTime');
      url.searchParams.append('maxResults', '50');
      url.searchParams.append('key', import.meta.env.VITE_GOOGLE_API_KEY);

      console.log('Making Calendar API request to:', url.toString());
      console.log('Using API Key:', import.meta.env.VITE_GOOGLE_API_KEY?.substring(0, 10) + '...');
      console.log('Using Access Token:', accessToken?.substring(0, 10) + '...');

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Calendar API response:', errorData);
        
        if (response.status === 403) {
          if (errorData.error?.message?.includes('Calendar API has not been used')) {
            throw new Error('Google Calendar API is not enabled. Please enable it in Google Cloud Console.');
          } else if (errorData.error?.message?.includes('insufficient')) {
            throw new Error('Insufficient permissions. Please grant calendar access.');
          } else {
            throw new Error(`Calendar API access denied: ${errorData.error?.message || 'Check your API key and OAuth setup'}`);
          }
        }
        throw new Error(`Calendar API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const realEvents = data.items || [];
      setEvents(realEvents);
      
      // Clear any previous errors on success
      setError(null);
    } catch (error) {
      console.error('Error loading calendar events:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load calendar events';
      setError(`${errorMessage}. Using demo data instead.`);
      
      // Fallback to mock events if API fails
      const mockEvents: CalendarEvent[] = [
        {
          id: 'demo-1',
          summary: 'Demo: Team Meeting',
          start: { dateTime: new Date().toISOString() },
          end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
          location: 'Conference Room A',
        },
        {
          id: 'demo-2',
          summary: 'Demo: Lunch Meeting',
          start: { dateTime: new Date(Date.now() + 86400000).toISOString() },
          end: { dateTime: new Date(Date.now() + 86400000 + 3600000).toISOString() },
          location: 'Restaurant',
        },
      ];
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  }, [hasPermission, accessToken, requestPermission]);

  return {
    events,
    loading,
    error,
    hasPermission,
    requestPermission,
    loadEvents,
  };
};
