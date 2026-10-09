import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { categoryLabel } from '../lib/config.js'
import { WhatsAppButton } from './CtaButtons.jsx'
import YouTubeEmbed from './YouTubeEmbed.jsx'

const nav = 'absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20'

export default function Lightbox({ items, index, onClose, onIndexChange }) {
  const ref = useRef(null)
  const open = index !== null && items[index]
  const item = open ? items[index] : null

  useEffect(() => {
    const d = ref.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const step = (n) => onIndexChange((index + n + items.length) % items.length)

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current.close()}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' && items.length > 1) step(-1)
        if (e.key === 'ArrowRight' && items.length > 1) step(1)
      }}
      className="m-auto w-full max-w-5xl bg-transparent p-4 text-white"
    >
      {item && (
        <div className="relative">
          <button type="button" onClick={() => ref.current.close()} aria-label="Close" className="ml-auto mb-2 grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20">
            <X aria-hidden="true" />
          </button>
          <div className="relative">
            {item.video_url ? (
              <YouTubeEmbed key={item.id} url={item.video_url} title={item.title} autoplay />
            ) : (
              <img src={item.image_url} alt={item.title} className="mx-auto max-h-[75vh] w-full object-contain" />
            )}
            {items.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} aria-label="Previous" className={`${nav} left-2`}><ChevronLeft aria-hidden="true" /></button>
                <button type="button" onClick={() => step(1)} aria-label="Next" className={`${nav} right-2`}><ChevronRight aria-hidden="true" /></button>
              </>
            )}
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold">{item.title} — {categoryLabel(item.category)}</h3>
            {item.description && <p className="mt-1 text-white/80">{item.description}</p>}
            <WhatsAppButton label="Ask about this project" text={`Hi, I'm interested in a project like "${item.title}".`} className="mt-4" />
            <p className="mt-3 text-sm text-white/70">{index + 1} / {items.length}</p>
          </div>
        </div>
      )}
    </dialog>
  )
}
