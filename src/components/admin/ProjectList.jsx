import { useState } from 'react'
import { Pencil, Play, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'
import { CATEGORIES, categoryLabel } from '../../lib/config.js'
import { isFileVideo, storagePathFromUrl, youtubeThumb } from '../../lib/media.js'

export default function ProjectList({ projects, onEdit, onChanged }) {
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  async function remove(p) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('projects').delete().eq('id', p.id)
    if (error) return setError(error.message)
    const paths = [p.image_url, isFileVideo(p.video_url) && p.video_url].filter(Boolean).map(storagePathFromUrl).filter(Boolean)
    if (paths.length) supabase.storage.from('portfolio-images').remove(paths).catch(console.error)
    setError('')
    onChanged()
  }

  const tabs = [{ value: 'all', label: 'All' }, ...CATEGORIES]
  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.value} type="button" onClick={() => setFilter(t.value)}
            className={`min-h-11 shrink-0 rounded-full px-5 font-semibold ${filter === t.value ? 'bg-brand text-white' : 'border border-line bg-soft'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="mb-3 text-sm text-danger">{error}</p>}
      {shown.length === 0 ? (
        <p className="py-10 text-center text-muted">No projects yet. Add your first one.</p>
      ) : (
        <ul className="divide-y divide-line rounded-xl border border-line bg-white">
          {shown.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-3">
              {p.image_url || youtubeThumb(p.video_url) ? (
                <img src={p.image_url ?? youtubeThumb(p.video_url)} alt="" className="size-16 shrink-0 rounded-lg bg-soft object-cover" />
              ) : (
                <video src={`${p.video_url}#t=0.1`} preload="metadata" muted playsInline className="size-16 shrink-0 rounded-lg bg-soft object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.title}</p>
                <p className="flex items-center gap-1 text-sm text-muted">
                  {categoryLabel(p.category)}
                  {p.video_url && <Play size={14} aria-label="Has video" />}
                </p>
              </div>
              <button type="button" onClick={() => onEdit(p)} aria-label={`Edit ${p.title}`} className="grid size-11 place-items-center rounded-lg hover:bg-soft"><Pencil size={18} /></button>
              <button type="button" onClick={() => remove(p)} aria-label={`Delete ${p.title}`} className="grid size-11 place-items-center rounded-lg text-danger hover:bg-soft"><Trash2 size={18} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
