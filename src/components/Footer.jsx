import { BUSINESS, telHref, waHref } from '../lib/config.js'

export default function Footer() {
  return (
    <footer className="bg-navy py-10 text-sm text-white/70">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-bold text-white">{BUSINESS.name}</p>
          <p className="mt-1">Custom kitchens, furniture, doors &amp; wood polish.</p>
        </div>
        <div>
          <a href={telHref} className="block hover:text-white">{BUSINESS.phoneDisplay}</a>
          <a href={waHref()} target="_blank" rel="noopener noreferrer" className="block hover:text-white">WhatsApp</a>
        </div>
        <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">{BUSINESS.city}</a>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-4 md:px-6">© {new Date().getFullYear()} {BUSINESS.name}</p>
    </footer>
  )
}
