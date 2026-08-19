import PageLoader from './components/PageLoader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Stats from './components/Stats'
import Products from './components/Products'
import Features from './components/Features'
import Industries from './components/Industries'
import Process from './components/Process'
import Testimonials from './components/Testimonials'
import Faq from './components/Faq'
import CtaBand from './components/CtaBand'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'

export default function App() {
  return (
    <>
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
    </>
  )
}
