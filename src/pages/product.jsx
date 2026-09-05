import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import ContactDialogProvider from '../components/ContactDialog'
import PageLoader from '../components/PageLoader'
import FamilyPage from '../components/FamilyPage'
import AllProductsPage from '../components/AllProductsPage'
import { findPage } from '../data/pages'

/**
 * Shared entry for every product page.
 *
 * All ten HTML shells load this one module and declare which family they are
 * and which of the two views to render through `data-page` / `data-view` on
 * the root element. That keeps a single bundle and a single place to change
 * page behaviour, instead of ten near-identical entry files.
 */
const { page: pageId, view } = document.documentElement.dataset
const page = findPage(pageId)

if (!page) {
  throw new Error(`Unknown product page: "${pageId}". Check data-page on <html>.`)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContactDialogProvider>
      <PageLoader />
      {view === 'all' ? <AllProductsPage page={page} /> : <FamilyPage page={page} />}
    </ContactDialogProvider>
  </StrictMode>,
)
