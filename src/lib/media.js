// Accepts youtube.com/watch?v=, youtu.be/, /embed/, /shorts/, m.youtube.com
export function youtubeId(url) {
  return url?.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1] ?? null
}

export const youtubeThumb = (url) => {
  const id = youtubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

// Uploaded video files live in storage; anything else in video_url is a YouTube link.
export const isFileVideo = (url) => !!url && !youtubeId(url)

export const storagePathFromUrl = (url) => url?.split('/portfolio-images/')[1] ?? null

// Resize to max 1600px and re-encode as WebP via canvas (phone photos are 3-8 MB).
// ponytail: one size serves grid + lightbox; add a thumb variant if grid load suffers.
export async function toWebp(file, max = 1600, quality = 0.82) {
  const bmp = await createImageBitmap(file) // honours EXIF orientation
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * scale)
  canvas.height = Math.round(bmp.height * scale)
  canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height)
  bmp.close()
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/webp', quality))
  if (!blob) throw new Error('Image conversion failed')
  return blob
}
