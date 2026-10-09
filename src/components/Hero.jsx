import { Check } from 'lucide-react'
import { BUSINESS } from '../lib/config.js'
import { CallButton, WhatsAppButton } from './CtaButtons.jsx'

const TRUST = ['15+ years experience', 'Free quotes', 'On-time delivery'] // TODO(owner): confirm claims

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[80svh] items-center bg-navy text-white md:min-h-[70vh]">
      {/* TODO(owner): add public/hero.webp (<=200 KB); hidden if missing */}
      <img
        src="/hero.webp"
        alt=""
        fetchPriority="high"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy/70" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Custom Kitchens &amp; Woodwork, Built to Last.
          </h1>
          <p className="mt-4 text-base text-white/85 md:text-lg">
            Expert carpentry in {BUSINESS.city} — kitchens, furniture, doors &amp; polish. Free site visit.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton className="w-full sm:w-auto" />
            <CallButton className="w-full sm:w-auto" />
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check size={16} aria-hidden="true" />{t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
