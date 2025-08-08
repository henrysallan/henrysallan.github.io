import { useState, useCallback, useEffect } from 'react';

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

interface StoredTokens {
  access_token: string;
  expires_at: number;
  refresh_token?: string;
}

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

const TOKEN_STORAGE_KEY = 'google_calendar_tokens';

export const useCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Check for stored tokens on mount
  useEffect(() => {
    const checkStoredTokens = () => {
      try {
        const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (stored) {
          const tokens: StoredTokens = JSON.parse(stored);
          const now = Date.now();
          
          // Check if token is still valid (with 5 minute buffer)
          if (tokens.expires_at > now + 5 * 60 * 1000) {
            setAccessToken(tokens.access_token);
            setHasPermission(true);
            console.log('Restored valid access token from storage');
          } else {
            console.log('Stored token expired, clearing storage');
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Error checking stored tokens:', error);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    };

    checkStoredTokens();
  }, []);

  const storeTokens = useCallback((tokenResponse: any) => {
    try {
      const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);
      const tokens: StoredTokens = {
        access_token: tokenResponse.access_token,
        expires_at: expiresAt,
        refresh_token: tokenResponse.refresh_token
      };
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
      console.log('Stored tokens, expires at:', new Date(expiresAt));
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }, []);

  const clearStoredTokens = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAccessToken(null);
    setHasPermission(false);
  }, []);

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
              clearStoredTokens();
              resolve(false);
              return;
            }
            
            console.log('OAuth success, storing tokens');
            storeTokens(response);
            setAccessToken(response.access_token);
            setHasPermission(true);
            setError(null);
            resolve(true);
          },
        });

        // Request access token (remove prompt: 'consent' to avoid forcing re-consent)
        tokenClient.requestAccessToken();
      });
      
    } catch (error) {
      console.error('Calendar permission error:', error);
      setError('Failed to get calendar permission. Please check your Google API configuration.');
      clearStoredTokens();
      return false;
    }
  }, [loadGoogleAPIs, storeTokens, clearStoredTokens]);

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

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Calendar API response:', errorData);
        
        if (response.status === 401) {
          // Token expired or invalid, clear storage and request new permission
          console.log('Token expired, requesting new permission');
          clearStoredTokens();
          const granted = await requestPermission();
          if (granted) {
            // Retry the request with new token
            return await loadEvents();
          }
          throw new Error('Authentication failed. Please try again.');
        } else if (response.status === 403) {
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
  }, [hasPermission, accessToken, requestPermission, clearStoredTokens]);

  const logout = useCallback(() => {
    clearStoredTokens();
    setEvents([]);
    setError(null);
    console.log('Logged out and cleared calendar data');
  }, [clearStoredTokens]);

  return {
    events,
    loading,
    error,
    hasPermission,
    requestPermission,
    loadEvents,
    logout,
  };
};
