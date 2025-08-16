import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import './assets/styles/CoolButtons.css'
import App from './App.jsx'
import { ToastProvider } from './assets/Components/Toast/ToastProvider';
import './assets/Components/Toast/ToastProvider.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)
