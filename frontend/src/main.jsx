import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ToastProvider } from './context/ToastContext';
import { BrowserRouter } from 'react-router-dom';

const generateUUID = () =>
  crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);

if (!document.cookie.includes("client_uuid")) {
  const uuid = generateUUID();
  document.cookie = `client_uuid=${uuid}; path=/; max-age=86400`;
}

if (import.meta.env.DEV) {
  const originalLog = console.log;
  console.log = function (...args) {
    originalLog(...args);
    const LOG_URL =
      import.meta.env.MODE === 'development'
        ? "http://localhost:4000/log"
        : "/api/log";

    fetch(LOG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ log: args.join(" ") })
    }).catch(() => {}); // fail silently
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);