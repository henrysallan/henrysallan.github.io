import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/windows95.css'; // Keep for base styles if any are still used

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);