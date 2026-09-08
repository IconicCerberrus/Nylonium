import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import ContactDialogProvider from '../context/ContactDialog'
import PageLoader from '../layout/PageLoader'
import FamilyPage from '../pages/FamilyPage'
import AllProductsPage from '../pages/AllProductsPage'
import VariantPage from '../pages/VariantPage'
import { findVariant } from '../data/pages.js'
import { loadFamily } from '../data/families/index.js'

/**
 * Shared entry for every product page.
 *
 * Every product shell loads this one module and declares which family it is
 * and which view to render through `data-page` / `data-view` on the root
 * element. That keeps a single entry and a single place to change page
 * behaviour, instead of a hundred-odd near-identical files.
 *
 * The catalogue is fetched rather than bundled, so a greenhouse page
 * downloads the greenhouse data and none of the other four.
 */
const { page: pageId, view, variant: variantId } = document.documentElement.dataset
const page = await loadFamily(pageId)

if (!page) {
  throw new Error(`Unknown product page: "${pageId}". Check data-page on <html>.`)
}

const variant = view === 'variant' ? findVariant(page, variantId) : null

if (view === 'variant' && !variant) {
  throw new Error(`Unknown variant "${variantId}" on page "${pageId}".`)
}

function View() {
  if (view === 'variant') return <VariantPage page={page} variant={variant} />
  if (view === 'all') return <AllProductsPage page={page} />
  return <FamilyPage page={page} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContactDialogProvider>
      <PageLoader />
      <View />
    </ContactDialogProvider>
  </StrictMode>,
)
