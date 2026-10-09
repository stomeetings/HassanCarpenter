import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Loader2, Video, X } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'
import { CATEGORIES } from '../../lib/config.js'
import { isFileVideo, storagePathFromUrl, toWebp, youtubeId, youtubeThumb } from '../../lib/media.js'

const BUCKET = 'portfolio-images'
const MAX_VIDEO_MB = 50 // matches Supabase's default per-file limit; raise in Storage settings first
const pick = 'mt-1 flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-brand px-3 font-semibold text-brand hover:bg-soft has-[:disabled]:opacity-60 has-[:focus-visible]:ring-2 [&>svg]:shrink-0 truncate'
const field ='mt-1 min-h-11 w-full rounded-lg border border-line px-3 disabled:bg-soft'

// project === null → closed; project === {} → new; project with id → edit
export default function ProjectForm({ project, onClose, onSaved }) {
  const ref = useRef(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [removeVideo, setRemoveVideo] = useState(false)
  const [preview, setPreview] = useState(null)

  const isOpen = project !== null
  const editing = !!project?.id

  useEffect(() => {
    const d = ref.current
    if (isOpen && !d.open) {
      setFile(null)
      setRemoveImage(false)
      setError('')
      setVideoUrl(youtubeId(project.video_url) ? project.video_url : '')
      setVideoFile(null)
      setRemoveVideo(false)
      d.showModal()
    }
    if (!isOpen && d.open) d.close()
  }, [isOpen, project])

  useEffect(() => {
    if (!file) return setPreview(null)
    const u = URL.createObjectURL(file)
    setPreview(u)
    return () => URL.revokeObjectURL(u)
  }, [file])

  const [videoPreview, setVideoPreview] = useState(null)
  useEffect(() => {
    if (!videoFile) return setVideoPreview(null)
    const u = URL.createObjectURL(videoFile)
    setVideoPreview(u)
    return () => URL.revokeObjectURL(u)
  }, [videoFile])

  const existing = !removeImage && !file ? project?.image_url : null
  const shownImage = preview ?? existing
  const existingVideo = !removeVideo && !videoFile && isFileVideo(project?.video_url) ? project.video_url : null

  async function onSubmit(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const title = f.get('title').trim()
    const video = videoUrl.trim()
    if (!title) return setError('Title is required.')
    if (video && !youtubeId(video)) return setError('Paste a valid YouTube link.')
    if (videoFile && videoFile.size > MAX_VIDEO_MB * 1024 * 1024) return setError(`Video must be under ${MAX_VIDEO_MB} MB.`)
    if (!shownImage && !video && !videoFile && !existingVideo) return setError('Add a photo or a video.')

    setSaving(true)
    setError('')
    let newPath = null
    let newVideoPath = null
    try {
      let image_url = removeImage ? null : project.image_url ?? null
      if (file) {
        const blob = await toWebp(file).catch(() => { throw new Error("Couldn't process that image.") })
        newPath = `projects/${crypto.randomUUID()}.webp`
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(newPath, blob, {
          cacheControl: '31536000', contentType: 'image/webp', upsert: false,
        })
        if (upErr) throw upErr
        image_url = supabase.storage.from(BUCKET).getPublicUrl(newPath).data.publicUrl
      }
      let video_url = video || existingVideo || null
      if (videoFile) {
        const ext = (videoFile.name.split('.').pop() || 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '')
        newVideoPath = `videos/${crypto.randomUUID()}.${ext}`
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(newVideoPath, videoFile, {
          cacheControl: '31536000', contentType: videoFile.type || 'video/mp4', upsert: false,
        })
        if (upErr) throw upErr
        video_url = supabase.storage.from(BUCKET).getPublicUrl(newVideoPath).data.publicUrl
      }
      const row = {
        title,
        category: f.get('category'),
        description: f.get('description').trim() || null,
        image_url,
        video_url,
      }
      const q = editing
        ? supabase.from('projects').update(row).eq('id', project.id)
        : supabase.from('projects').insert(row)
      const { error: dbErr } = await q
      if (dbErr) throw dbErr

      // Delete old file only after the DB stops pointing at it (best-effort).
      if (editing && project.image_url && project.image_url !== image_url) {
        supabase.storage.from(BUCKET).remove([storagePathFromUrl(project.image_url)]).catch(console.error)
      }
      if (editing && isFileVideo(project.video_url) && project.video_url !== video_url) {
        supabase.storage.from(BUCKET).remove([storagePathFromUrl(project.video_url)]).catch(console.error)
      }
      onSaved()
    } catch (err) {
      const orphans = [newPath, newVideoPath].filter(Boolean)
      if (orphans.length) supabase.storage.from(BUCKET).remove(orphans).catch(console.error)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => saving && e.preventDefault()}
      className="m-auto w-full max-w-lg rounded-xl p-0"
    >
      {isOpen && (
        <form onSubmit={onSubmit} className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{editing ? 'Edit project' : 'Add project'}</h2>
            <button type="button" onClick={onClose} disabled={saving} aria-label="Close" className="grid size-11 place-items-center"><X aria-hidden="true" /></button>
          </div>

          <label className="block text-sm font-medium">Title *
            <input name="title" required maxLength={120} defaultValue={project.title ?? ''} disabled={saving} className={field} />
          </label>
          <label className="block text-sm font-medium">Category *
            <select name="category" required defaultValue={project.category ?? CATEGORIES[0].value} disabled={saving} className={field}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Description
            <textarea name="description" rows={3} maxLength={1000} defaultValue={project.description ?? ''} disabled={saving} className={`${field} py-2`} />
          </label>

          <div className="text-sm font-medium">
            Photo
            <label className={pick}>
              <ImagePlus size={18} aria-hidden="true" />{file ? file.name : shownImage ? 'Change photo' : 'Upload photo'}
              <input type="file" accept="image/*" disabled={saving} onChange={(e) => { setFile(e.target.files[0] ?? null); setRemoveImage(false) }} className="sr-only" />
            </label>
            {shownImage && (
              <div className="mt-2 flex items-end gap-3">
                <img src={shownImage} alt="" className="h-24 rounded-lg object-cover" />
                <button type="button" disabled={saving} onClick={() => { setFile(null); setRemoveImage(true) }} className="text-danger">Remove</button>
              </div>
            )}
          </div>

          <div className="text-sm font-medium">
            Video file (MP4, up to {MAX_VIDEO_MB} MB)
            <label className={pick}>
              <Video size={18} aria-hidden="true" />{videoFile ? videoFile.name : existingVideo ? 'Change video' : 'Upload video'}
              <input type="file" accept="video/*" disabled={saving} onChange={(e) => { setVideoFile(e.target.files[0] ?? null); setRemoveVideo(false) }} className="sr-only" />
            </label>
            {(videoFile || existingVideo) && (
              <div className="mt-2 flex items-end gap-3">
                <video src={videoPreview ?? existingVideo} controls preload="metadata" className="h-24 rounded-lg bg-black" />
                <button type="button" disabled={saving} onClick={() => { setVideoFile(null); setRemoveVideo(true) }} className="text-danger">Remove</button>
              </div>
            )}
          </div>

          <label className="block text-sm font-medium">…or YouTube link
            <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtu.be/..." disabled={saving} className={field} />
            {youtubeThumb(videoUrl) && <img src={youtubeThumb(videoUrl)} alt="" className="mt-2 h-24 rounded-lg" />}
          </label>

          {error && <p role="alert" className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={saving} className="min-h-11 rounded-lg border border-line px-5 font-semibold hover:bg-soft">Cancel</button>
            <button disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
              {saving && <Loader2 size={18} className="animate-spin" aria-hidden="true" />} Save project
            </button>
          </div>
        </form>
      )}
    </dialog>
  )
}
