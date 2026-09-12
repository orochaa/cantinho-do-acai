import { App } from '@/app';
import React from 'react';
import ReactDom from 'react-dom/client';
import './global.css';

const root = document.querySelector('#root');

if (!root) {
  throw new Error('Root not found');
}

ReactDom.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
