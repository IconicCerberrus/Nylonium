import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import ContactDialogProvider from '../context/ContactDialog'
import PageLoader from '../layout/PageLoader'
import ContactPage from '../pages/ContactPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContactDialogProvider>
      <PageLoader />
      <ContactPage />
    </ContactDialogProvider>
  </StrictMode>,
)
