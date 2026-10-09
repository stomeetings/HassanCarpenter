import { BUSINESS } from '../lib/config.js'
import { CallButton } from './CtaButtons.jsx'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-navy text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#top" className="text-lg font-bold">{BUSINESS.name}</a>
        <nav className="hidden gap-6 text-white/80 md:flex">
          <a href="#services" className="hover:text-white">Services</a>
          <a href="#work" className="hover:text-white">Work</a>
        </nav>
        <CallButton label="Call Now" />
      </div>
    </header>
  )
}
