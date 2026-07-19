import { ToastProvider } from '@/context/toast-provider';
import { Router } from '@/router';
import React from 'react';
import ReactDom from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './global.css';

const root = document.querySelector('#root');

if (!root) {
  throw new Error('Root not found');
}

ReactDom.createRoot(root).render(
  <React.StrictMode>
    <HelmetProvider>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
