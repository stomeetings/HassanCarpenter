import { useEffect, useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import { CATEGORIES, categoryLabel } from '../lib/config.js'
import { youtubeThumb } from '../lib/media.js'
import { WhatsAppButton } from './CtaButtons.jsx'
import Lightbox from './Lightbox.jsx'

const TABS = [
  { value: 'all', label: 'All' },
  ...CATEGORIES,
]

const filterFromHash = () => {
  const v = window.location.hash.match(/^#work-(\w+)$/)?.[1]
  return TABS.some((t) => t.value === v) ? v : 'all'
}

export default function Gallery() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState(filterFromHash)
  const [index, setIndex] = useState(null)

  useEffect(() => {
    supabase
      .from('projects')
      .select('id,title,description,image_url,video_url,category,created_at')
      .order('created_at', { ascending: false })
      .limit(200) // ponytail: no pagination; add range() paging past ~200 projects
      .then(({ data, error }) => {
        if (error) { console.error(error); setError(true) } else setRows(data)
      })
  }, [])

  useEffect(() => {
    const onHash = () => {
      if (/^#work-\w+$/.test(window.location.hash)) {
        setFilter(filterFromHash())
        document.getElementById('work')?.scrollIntoView()
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const items = useMemo(() => {
    if (!rows) return []
    if (filter === 'all') return rows
    return rows.filter((r) => r.category === filter)
  }, [rows, filter])

  return (
    <section id="work" className="scroll-mt-16 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-6 text-center text-2xl font-bold md:text-4xl">Our Recent Work</h2>
        <div role="tablist" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:justify-center md:px-0">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={filter === t.value}
              onClick={() => setFilter(t.value)}
              className={`min-h-11 shrink-0 rounded-full px-5 font-semibold ${
                filter === t.value ? 'bg-brand text-white' : 'border border-line bg-soft text-navy'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error ? (
          <Message text="Couldn't load projects." />
        ) : !rows ? (
          <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-soft" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <Message text="No projects here yet." />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
            {items.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndex(i)}
                className="group overflow-hidden rounded-xl border border-line bg-white text-left shadow-sm hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden bg-soft">
                  <img
                    src={p.image_url ?? youtubeThumb(p.video_url)}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {p.video_url && (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="rounded-full bg-white/90 p-3 text-navy"><Play size={22} aria-hidden="true" /></span>
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 font-semibold">{p.title}</p>
                  <p className="text-sm text-muted">{categoryLabel(p.category)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </section>
  )
}

function Message({ text }) {
  return (
    <div className="py-10 text-center">
      <p className="mb-4 text-muted">{text}</p>
      <WhatsAppButton label="See our work on WhatsApp" />
    </div>
  )
}
