import { AlertProvider } from '@/context/alert-provider'
import { Router } from '@/router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './global.css'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AlertProvider>
        <Router />
      </AlertProvider>
    </HelmetProvider>
  </React.StrictMode>
)
