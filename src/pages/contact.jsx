import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import ContactDialogProvider from '../components/ContactDialog'
import PageLoader from '../components/PageLoader'
import ContactPage from '../components/ContactPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContactDialogProvider>
      <PageLoader />
      <ContactPage />
    </ContactDialogProvider>
  </StrictMode>,
)
