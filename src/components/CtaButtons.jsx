import { MessageCircle, Phone } from 'lucide-react'
import { telHref, waHref } from '../lib/config.js'

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 font-semibold transition-colors'

export function CallButton({ label = 'Call Now', className = '' }) {
  return (
    <a href={telHref} className={`${base} bg-brand text-white hover:bg-brand-dark ${className}`}>
      <Phone size={18} aria-hidden="true" />
      {label}
    </a>
  )
}

export function WhatsAppButton({ label = 'WhatsApp Us', text, className = '' }) {
  return (
    <a
      href={waHref(text)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-whatsapp text-navy hover:bg-whatsapp-dark ${className}`}
    >
      <MessageCircle size={18} aria-hidden="true" />
      {label}
    </a>
  )
}
