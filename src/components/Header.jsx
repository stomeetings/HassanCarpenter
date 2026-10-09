import { BUSINESS } from '../lib/config.js'
import { CallButton, WhatsAppButton } from './CtaButtons.jsx'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-navy text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:h-16 md:px-6">
        <a href="#top" className="truncate text-base font-bold md:text-lg">{BUSINESS.name}</a>
        <nav className="hidden gap-6 text-white/80 md:flex">
          <a href="#about" className="hover:text-white">About</a>
          <a href="#services" className="hover:text-white">Services</a>
          <a href="#work" className="hover:text-white">Work</a>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <WhatsAppButton label="WhatsApp" className="hidden !min-h-10 !px-4 text-sm md:inline-flex" />
          <CallButton label="Call Now" className="!min-h-10 !px-4 text-sm" />
        </div>
      </div>
    </header>
  )
}
