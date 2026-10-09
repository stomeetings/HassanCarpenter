import { MapPin, MessageCircle, Phone } from 'lucide-react'
import { BUSINESS, telHref, waHref } from '../lib/config.js'

const link = 'flex items-center gap-2 hover:text-white'

export default function Footer() {
  return (
    <footer className="bg-navy py-10 text-sm text-white/70">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-bold text-white">{BUSINESS.name}</p>
          <p className="mt-1">Custom kitchens, furniture, doors &amp; wood polish.</p>
        </div>
        <div className="space-y-2">
          <a href={telHref} className={link}><Phone size={16} aria-hidden="true" />{BUSINESS.phoneDisplay}</a>
          <a href={waHref()} target="_blank" rel="noopener noreferrer" className={link}><MessageCircle size={16} aria-hidden="true" />WhatsApp</a>
        </div>
        <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer" className={`${link} self-start`}>
          <MapPin size={16} aria-hidden="true" />{BUSINESS.city}
        </a>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-4 md:px-6">© {new Date().getFullYear()} {BUSINESS.name}</p>
    </footer>
  )
}
