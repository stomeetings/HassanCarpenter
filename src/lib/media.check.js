import assert from 'node:assert/strict'
import { youtubeId, storagePathFromUrl } from './media.js'

const ID = 'dQw4w9WgXcQ'
for (const u of [
  `https://www.youtube.com/watch?v=${ID}`,
  `https://youtu.be/${ID}`,
  `https://youtu.be/${ID}?si=abc`,
  `https://m.youtube.com/watch?feature=share&v=${ID}`,
  `https://www.youtube.com/embed/${ID}`,
  `https://www.youtube.com/shorts/${ID}`,
]) assert.equal(youtubeId(u), ID, u)
assert.equal(youtubeId('https://vimeo.com/123'), null)
assert.equal(youtubeId(null), null)
assert.equal(storagePathFromUrl('https://x.supabase.co/storage/v1/object/public/portfolio-images/projects/a.webp'), 'projects/a.webp')
console.log('media ok')
