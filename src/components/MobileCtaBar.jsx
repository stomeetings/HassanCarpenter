import { CallButton, WhatsAppButton } from './CtaButtons.jsx'

export default function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-line bg-white p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden">
      <CallButton label="Call" className="min-h-12" />
      <WhatsAppButton label="WhatsApp" className="min-h-12" />
    </div>
  )
}
