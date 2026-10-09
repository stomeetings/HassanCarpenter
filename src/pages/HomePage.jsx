import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import AboutSection from '../components/AboutSection.jsx'
import AreasServed from '../components/AreasServed.jsx'
import Reviews from '../components/Reviews.jsx'
import MapSection from '../components/MapSection.jsx'
import Services from '../components/Services.jsx'
import Gallery from '../components/Gallery.jsx'
import VideoGallery from '../components/VideoGallery.jsx'
import Footer from '../components/Footer.jsx'
import MobileCtaBar from '../components/MobileCtaBar.jsx'
import { CallButton, WhatsAppButton } from '../components/CtaButtons.jsx'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <Services />
        <Gallery />
        <VideoGallery />
        <Reviews />
        <AreasServed />
        <MapSection />
        <section className="bg-navy py-16 text-center text-white">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-2xl font-bold md:text-4xl">Ready to start your project?</h2>
            <p className="mt-3 text-white/80">Free site visit and quote — message us now.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <WhatsAppButton />
              <CallButton />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
