import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, Pencil, Plus, Star, Trash2, X } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const field = 'mt-1 min-h-11 w-full rounded-lg border border-line px-3 disabled:bg-soft'

export default function ReviewsAdmin() {
  const [rows, setRows] = useState([])
  const [editing, setEditing] = useState(null) // null closed, {} new, row edit
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else { setRows(data); setError('') }
  }, [])

  useEffect(() => { reload() }, [reload])

  async function remove(r) {
    if (!confirm(`Delete review by "${r.name}"? This cannot be undone.`)) return
    const { error } = await supabase.from('reviews').delete().eq('id', r.id)
    if (error) return setError(error.message)
    reload()
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Reviews ({rows.length})</h1>
        <button onClick={() => setEditing({})} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-5 font-semibold text-white hover:bg-brand-dark">
          <Plus size={18} aria-hidden="true" /> Add review
        </button>
      </div>
      {error && <p role="alert" className="mb-3 text-danger">{error}</p>}
      {rows.length === 0 ? (
        <p className="py-10 text-center text-muted">No reviews yet. Add your first one.</p>
      ) : (
        <ul className="divide-y divide-line rounded-xl border border-line bg-white">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{r.name} · {r.place}</p>
                <p className="flex items-center gap-1 text-sm text-muted"><Star size={14} className="text-amber-500" fill="currentColor" aria-hidden="true" />{r.rating}</p>
                <p className="line-clamp-1 text-sm text-muted">{r.text}</p>
              </div>
              <button type="button" onClick={() => setEditing(r)} aria-label={`Edit review by ${r.name}`} className="grid size-11 place-items-center rounded-lg hover:bg-soft"><Pencil size={18} /></button>
              <button type="button" onClick={() => remove(r)} aria-label={`Delete review by ${r.name}`} className="grid size-11 place-items-center rounded-lg text-danger hover:bg-soft"><Trash2 size={18} /></button>
            </li>
          ))}
        </ul>
      )}
      <ReviewForm review={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload() }} />
    </div>
  )
}

function ReviewForm({ review, onClose, onSaved }) {
  const ref = useRef(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isOpen = review !== null
  const editing = !!review?.id

  useEffect(() => {
    const d = ref.current
    if (isOpen && !d.open) { setError(''); d.showModal() }
    if (!isOpen && d.open) d.close()
  }, [isOpen, review])

  async function onSubmit(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const row = {
      name: f.get('name').trim(),
      place: f.get('place').trim(),
      rating: Number(f.get('rating')),
      work: f.get('work').trim() || null,
      text: f.get('text').trim(),
    }
    if (!row.name || !row.place || !row.text) return setError('Name, place and review text are required.')
    setSaving(true)
    setError('')
    const q = editing ? supabase.from('reviews').update(row).eq('id', review.id) : supabase.from('reviews').insert(row)
    const { error: dbErr } = await q
    setSaving(false)
    if (dbErr) return setError(dbErr.message)
    onSaved()
  }

  return (
    <dialog ref={ref} onClose={onClose} onCancel={(e) => saving && e.preventDefault()} className="m-auto w-full max-w-lg rounded-xl p-0">
      {isOpen && (
        <form onSubmit={onSubmit} className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{editing ? 'Edit review' : 'Add review'}</h2>
            <button type="button" onClick={onClose} disabled={saving} aria-label="Close" className="grid size-11 place-items-center"><X aria-hidden="true" /></button>
          </div>
          <label className="block text-sm font-medium">Customer name *
            <input name="name" required maxLength={80} defaultValue={review.name ?? ''} placeholder="e.g. Homeowner or Ahmed" disabled={saving} className={field} />
          </label>
          <label className="block text-sm font-medium">Place *
            <input name="place" required maxLength={80} defaultValue={review.place ?? ''} placeholder="e.g. Bahria Town, Rawalpindi" disabled={saving} className={field} />
          </label>
          <label className="block text-sm font-medium">Rating *
            <select name="rating" defaultValue={review.rating ?? 5} disabled={saving} className={field}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 && 's'}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Work done
            <input name="work" maxLength={120} defaultValue={review.work ?? ''} placeholder="e.g. Kitchen cabinets & wardrobe" disabled={saving} className={field} />
          </label>
          <label className="block text-sm font-medium">Review *
            <textarea name="text" required rows={5} maxLength={1000} defaultValue={review.text ?? ''} disabled={saving} className={`${field} py-2`} />
          </label>
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={saving} className="min-h-11 rounded-lg border border-line px-5 font-semibold hover:bg-soft">Cancel</button>
            <button disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
              {saving && <Loader2 size={18} className="animate-spin" aria-hidden="true" />} Save review
            </button>
          </div>
        </form>
      )}
    </dialog>
  )
}
