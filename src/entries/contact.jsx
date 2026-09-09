import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '../index.css'
import ContactDialogProvider from '../context/ContactDialog'
import ContactPage from '../pages/ContactPage'

/*
 * `hydrateRoot`, not `createRoot`. The shell already contains this page's
 * markup, rendered at build time by scripts/prerender.mjs — React attaches
 * event handlers to what is there instead of building it a second time.
 */
hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <ContactDialogProvider>
      <ContactPage />
    </ContactDialogProvider>
  </StrictMode>,
)
