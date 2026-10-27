import { useScrollTriggerRefresh } from './components/animations/useReveal'
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { EnquiryProvider } from './components/providers/EnquiryProvider'
import { SmoothScroll } from './components/providers/SmoothScroll'
import { About } from './components/sections/About'
import { Amenities } from './components/sections/Amenities'
import { Booking } from './components/sections/Booking'
import { Gallery } from './components/sections/Gallery'
import { Hero } from './components/sections/Hero'
import { ImmersiveSection } from './components/sections/ImmersiveSection'
import { Location } from './components/sections/Location'
import { Marquee } from './components/sections/Marquee'
import { Reviews } from './components/sections/Reviews'
import { Rooms } from './components/sections/Rooms'
import { StructuredData } from './components/StructuredData'
import { CursorLabel } from './components/ui/CursorLabel'

export default function App() {
  useScrollTriggerRefresh()

  return (
    <SmoothScroll>
      <EnquiryProvider>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-gold px-5 py-3 text-sm font-bold text-forest-night transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <Hero />
          <About />
          <Marquee />
          <Rooms />
          <Gallery />
          <Amenities />
          <ImmersiveSection />
          <Reviews />
          <Location />
          <Booking />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <CursorLabel />
        <StructuredData />
      </EnquiryProvider>
    </SmoothScroll>
  )
}
