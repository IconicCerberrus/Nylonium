import ContactDialogProvider from '../context/ContactDialog'
import PageLoader from '../layout/PageLoader'
import Navbar from '../layout/Navbar'
import Hero from '../sections/Hero'
import Marquee from '../sections/Marquee'
import Stats from '../sections/Stats'
import Products from '../sections/Products'
import Features from '../sections/Features'
import Industries from '../sections/Industries'
import Process from '../sections/Process'
import Testimonials from '../sections/Testimonials'
import Faq from '../sections/Faq'
import CtaBand from '../sections/CtaBand'
import Contact from '../sections/Contact'
import Footer from '../layout/Footer'
import FloatingContact from '../layout/FloatingContact'

export default function App() {
  return (
    <ContactDialogProvider>
      <PageLoader />
      <Navbar />

      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Products />
        <Features />
        <Industries />
        <Process />
        <Testimonials />
        <Faq />
        <CtaBand />
        <Contact />
      </main>

      <Footer />
      <FloatingContact />
    </ContactDialogProvider>
  )
}
