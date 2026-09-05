import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './theme/ThemeContext'
import { LockProvider } from './lib/lock/LockContext'
import './i18n'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LockProvider>
        <App />
      </LockProvider>
    </ThemeProvider>
  </StrictMode>,
)
