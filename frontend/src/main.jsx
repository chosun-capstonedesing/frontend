import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ToastProvider } from './context/ToastContext';

// Generate client_uuid cookie if not present
if (!document.cookie.includes("client_uuid")) {
  const uuid = crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
  document.cookie = `client_uuid=${uuid}; path=/; max-age=86400`;
}

if (import.meta.env.DEV) {
  const originalLog = console.log;
  console.log = function (...args) {
    originalLog(...args);
    fetch("http://localhost:4000/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ log: args.join(" ") })
    }).catch(() => {}); // fail silently
  };
}

if (import.meta.env.MODE === 'development') {
  import('./test/index.js');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);