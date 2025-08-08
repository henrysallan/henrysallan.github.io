import React, { useEffect } from 'react';
import { colors } from '../../styles/colors';
import { Button95 } from '../Windows95UI';
import { useCalendar } from '../../hooks/useCalendar';

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

export const Calendar: React.FC = () => {
  const { events, loading, error, loadEvents, hasPermission, requestPermission, logout } = useCalendar();

  useEffect(() => {
    if (hasPermission) {
      loadEvents();
    }
  }, [hasPermission, loadEvents]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: dateStr.includes('T') ? 'numeric' : undefined,
      minute: dateStr.includes('T') ? '2-digit' : undefined
    });
  };

  const getDateString = (event: CalendarEvent) => {
    return event.start.dateTime || event.start.date || '';
  };

  const todaysEvents = events.filter((event: CalendarEvent) => {
    const eventDate = getDateString(event);
    if (!eventDate) return false;
    const today = new Date().toDateString();
    const evDate = new Date(eventDate).toDateString();
    return today === evDate;
  });

  const upcomingEvents = events.filter((event: CalendarEvent) => {
    const eventDate = getDateString(event);
    if (!eventDate) return false;
    const today = new Date();
    const evDate = new Date(eventDate);
    return evDate > today;
  }).slice(0, 5);

  if (!hasPermission) {
    return (
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <div style={{ marginBottom: '16px', color: colors.text }}>
          Calendar access required to view your events
        </div>
        <Button95 onClick={requestPermission}>
          📅 Grant Calendar Access
        </Button95>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: colors.text }}>
        Loading calendar events...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '16px' }}>
        <div style={{ color: 'red', marginBottom: '12px', fontSize: '11px' }}>
          ⚠️ Calendar Setup Required
        </div>
        <div style={{ color: colors.text, fontSize: '10px', marginBottom: '12px', lineHeight: '1.4' }}>
          {error}
        </div>
        {error.includes('API is not enabled') && (
          <div style={{ 
            background: colors.textLight, 
            border: `1px solid ${colors.borderDark}`,
            padding: '8px',
            fontSize: '10px',
            marginBottom: '12px',
            lineHeight: '1.3'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Setup Steps:</div>
            <div>1. Go to Google Cloud Console</div>
            <div>2. Enable Google Calendar API</div>
            <div>3. Create OAuth credentials</div>
            <div>4. Add your domain to authorized origins</div>
          </div>
        )}
        <Button95 onClick={requestPermission} style={{ fontSize: '10px' }}>
          🔄 Try Again
        </Button95>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      color: '#000000',
      fontFamily: "'Pixelify Sans', monospace"
    }}>
      {/* Header */}
      <div style={{
        padding: '8px',
        borderBottom: `1px solid ${colors.borderDark}`,
        background: colors.windowHeader,
        fontWeight: 'bold',
        fontSize: '12px',
        color: '#000000',
        fontFamily: "'Pixelify Sans', monospace",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>
          📅 {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
        <button
          onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            color: '#000000',
            fontSize: '10px',
            cursor: 'pointer',
            padding: '2px 4px',
            fontFamily: "'Pixelify Sans', monospace"
          }}
          title="Logout from Google Calendar"
        >
          🚪
        </button>
      </div>

      {/* Today's Events */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {todaysEvents.length > 0 && (
          <div style={{ padding: '8px' }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '8px',
              fontSize: '11px',
              color: '#000000',
              fontFamily: "'Jacquard 12', monospace"
            }}>
              Today's Events:
            </div>
            {todaysEvents.map((event: CalendarEvent) => (
              <div
                key={event.id}
                style={{
                  border: `1px solid ${colors.borderDark}`,
                  borderColor: `${colors.borderLight} ${colors.borderDark} ${colors.borderDark} ${colors.borderLight}`,
                  padding: '6px',
                  marginBottom: '4px',
                  background: '#ffffff',
                  fontSize: '11px',
                  fontFamily: "'Pixelify Sans', monospace"
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                  {event.summary}
                </div>
                <div style={{ color: '#666', fontSize: '10px' }}>
                  {formatDate(getDateString(event))}
                </div>
                {event.location && (
                  <div style={{ color: '#555', fontSize: '10px', marginTop: '2px' }}>
                    📍 {event.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div style={{ padding: '8px' }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '8px',
              fontSize: '11px',
              color: '#000000',
              fontFamily: "'Jacquard 12', monospace"
            }}>
              Upcoming Events:
            </div>
            {upcomingEvents.map((event: CalendarEvent) => (
              <div
                key={event.id}
                style={{
                  border: `1px solid ${colors.borderDark}`,
                  borderColor: `${colors.borderDark} ${colors.borderLight} ${colors.borderLight} ${colors.borderDark}`,
                  padding: '6px',
                  marginBottom: '4px',
                  background: colors.windowBg,
                  fontSize: '11px'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                  {event.summary}
                </div>
                <div style={{ color: '#666', fontSize: '10px' }}>
                  {formatDate(getDateString(event))}
                </div>
                {event.location && (
                  <div style={{ color: '#555', fontSize: '10px', marginTop: '2px' }}>
                    📍 {event.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {todaysEvents.length === 0 && upcomingEvents.length === 0 && (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#666',
            fontSize: '11px'
          }}>
            No upcoming events found
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div style={{ 
        padding: '8px', 
        borderTop: `1px solid ${colors.borderDark}`,
        textAlign: 'center'
      }}>
        <Button95 onClick={loadEvents} style={{ fontSize: '11px' }}>
          🔄 Refresh
        </Button95>
      </div>
    </div>
  );
};
