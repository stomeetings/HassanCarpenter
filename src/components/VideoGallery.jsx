import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import YouTubeEmbed from './YouTubeEmbed.jsx'

// Videos come from the admin "YouTube link" field on each project.
export default function VideoGallery() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    supabase
      .from('projects')
      .select('id,title,video_url')
      .not('video_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(24) // ponytail: no pagination; add range() paging past 24 videos
      .then(({ data, error }) => (error ? console.error(error) : setRows(data)))
  }, [])

  if (!rows.length) return null

  return (
    <section id="videos" className="scroll-mt-14 bg-soft py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-4xl">Project Videos</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {rows.map((v) => (
            <figure key={v.id}>
              <YouTubeEmbed url={v.video_url} title={v.title} />
              <figcaption className="mt-2 line-clamp-1 font-semibold">{v.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
