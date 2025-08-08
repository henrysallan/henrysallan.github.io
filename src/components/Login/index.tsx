import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { colors } from '../../styles/colors';
import { Button95 } from '../Windows95UI';

export const Login: React.FC = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: colors.desktop
    }}>
      <div style={{
        background: colors.windowBg,
        padding: '40px',
        border: `2px solid`,
        borderColor: `${colors.borderLight} ${colors.borderDark} ${colors.borderDark} ${colors.borderLight}`,
        textAlign: 'center',
        fontFamily: "'Pixelify Sans', monospace"
      }}>
        <h1 style={{ 
          margin: '0 0 20px 0', 
          color: '#000000', 
          fontSize: '16px',
          fontFamily: "'Jacquard 12', monospace"
        }}>
          Dashboard Login
        </h1>
        <p style={{ 
          margin: '0 0 30px 0', 
          color: '#000000',
          fontFamily: "'Pixelify Sans', monospace"
        }}>
          Please sign in to continue
        </p>
        <Button95 onClick={handleLogin}>
          Sign In with Google
        </Button95>
      </div>
    </div>
  );
};