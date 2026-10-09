import { Check } from 'lucide-react'
import { BUSINESS } from '../lib/config.js'
import { CallButton, WhatsAppButton } from './CtaButtons.jsx'

const TRUST = ['Free quotes', 'On-time delivery', 'Quality warranty']

export default function Hero() {
  return (
    <section id="top" className="relative bg-navy text-white">
      {/* TODO(owner): add public/hero.webp (<=200 KB); hidden if missing */}
      <img
        src="/hero.webp"
        alt=""
        fetchPriority="high"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-navy/70" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Custom Kitchens &amp; Woodwork, Built to Last.
          </h1>
          <p
            lang="ur"
            dir="rtl"
            className="mt-2 whitespace-nowrap text-left font-bold leading-[1.9] text-amber-300"
            style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: 'clamp(10px, 3.2vw, 18px)' }}
          >
            لکڑی کا ہر کام — الماری، کچن، بیڈ، پالش، اور ڈورز — مکمل تسلی بخش کیا جاتا ہے۔
          </p>
          <p className="mt-4 text-base text-white/85 md:text-lg">
            Premium carpentry services in {BUSINESS.city.replace(', Pakistan', '')} — hand-crafted furniture,
            modular kitchens, doors &amp; polish.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CallButton label={`Call ${BUSINESS.phoneDisplay}`} className="w-full sm:w-auto" />
            <WhatsAppButton label="WhatsApp Direct" className="w-full sm:w-auto" />
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
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
