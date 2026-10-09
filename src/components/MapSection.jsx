import { MapPin } from 'lucide-react'
import { BUSINESS } from '../lib/config.js'

export default function MapSection() {
  return (
    <section id="visit" className="bg-soft py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-2 text-center text-2xl font-bold md:text-4xl">Visit Our Shop</h2>
        <p className="mb-8 text-center text-muted">{BUSINESS.city}</p>
        <div className="aspect-[4/3] overflow-hidden rounded-xl border border-line bg-white md:aspect-[21/9]">
          <iframe
            title="Hassan Carpenter on Google Maps"
            src={`https://maps.google.com/maps?q=${BUSINESS.lat},${BUSINESS.lng}&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
        <div className="mt-6 text-center">
          <a
            href={BUSINESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <MapPin size={18} aria-hidden="true" /> Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}
