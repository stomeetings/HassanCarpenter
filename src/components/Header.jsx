import { Images, Info, Star, Video, Wrench } from 'lucide-react'
import { BUSINESS } from '../lib/config.js'
import { CallButton, WhatsAppButton } from './CtaButtons.jsx'

const NAV = [
  { href: '#about', label: 'About', Icon: Info },
  { href: '#services', label: 'Services', Icon: Wrench },
  { href: '#work', label: 'Work', Icon: Images },
  { href: '#videos', label: 'Videos', Icon: Video },
  { href: '#reviews', label: 'Reviews', Icon: Star },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-navy text-white">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-2 px-3 md:h-14 md:px-6">
        <a href="#top" className="truncate text-sm font-bold md:text-base">{BUSINESS.name}</a>
        <nav className="flex items-center text-white/80 md:gap-5">
          {NAV.map(({ href, label, Icon }) => (
            <a key={href} href={href} aria-label={label} className="grid size-10 place-items-center hover:text-white md:flex md:size-auto md:gap-1.5 md:text-sm">
              <Icon size={18} aria-hidden="true" />
              <span className="hidden md:inline">{label}</span>
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <WhatsAppButton label="WhatsApp" className="hidden !min-h-9 !px-3 text-sm md:inline-flex" />
          <CallButton label="Call" className="!min-h-9 !px-3 text-sm" />
        </div>
      </div>
    </header>
  )
}
