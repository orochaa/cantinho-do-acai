import { AlertProvider, CartProvider } from '@/presentation/context'
import { Router } from '@/main/router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CartProvider>
      <AlertProvider>
        <Router />
      </AlertProvider>
    </CartProvider>
  </React.StrictMode>
)
