import { useState } from 'react'
import { ImageOff, Play } from 'lucide-react'
import { youtubeId, youtubeThumb } from '../lib/media.js'

// Facade: no iframe (and no YouTube JS) until the user taps play.
export default function YouTubeEmbed({ url, title = 'Project video', autoplay = false }) {
  const [playing, setPlaying] = useState(false)
  const id = youtubeId(url)

  if (!id) {
    return (
      <div className="flex aspect-video items-center justify-center gap-2 rounded-xl bg-black text-white/70">
        <ImageOff size={20} aria-hidden="true" /> Video unavailable
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      {playing || autoplay ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${title}`} className="group absolute inset-0">
          <img src={youtubeThumb(url)} alt="" loading="lazy" className="h-full w-full object-cover" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="rounded-full bg-white/90 p-4 text-navy"><Play size={28} aria-hidden="true" /></span>
          </span>
        </button>
      )}
    </div>
  )
}
