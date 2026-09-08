import Navbar from './Navbar'
import Footer from './Footer'
import FloatingContact from './FloatingContact'
import PageHero from './PageHero'
import Contact from './Contact'
import Faq from './Faq'
import Process from './Process'
import { page as pageHref } from '../lib/links'

/**
 * The contact page.
 *
 * Reuses the landing page's contact, order-process and FAQ sections rather
 * than restating them: a visitor who arrives here directly gets the same
 * channels, the same "what to send us" checklist and the same answers, and
 * there is only one copy of each to keep current.
 */
export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main>
        <PageHero
          title="تماس با ما"
          intro="کاربرد، عرض، ضخامت و مقدار مورد نیازتان را بگویید تا در کوتاه‌ترین زمان قیمت روز و زمان تحویل را اعلام کنیم. مشاوره فنی رایگان است و هیچ هزینه‌ای ندارد."
          crumbs={[{ label: 'خانه', href: pageHref('index.html') }, { label: 'تماس با ما' }]}
        />

        <Contact />
        <Process />
        <Faq />
      </main>

      <Footer />
      <FloatingContact />
    </>
  )
}
