import { useEffect, useState } from 'react'
import { Quote, Star } from 'lucide-react'
import { supabase } from '../lib/supabase.js'

const Stars = ({ n }) => (
  <div className="flex gap-0.5 text-amber-500" role="img" aria-label={`${n} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={18} aria-hidden="true" fill={i < n ? 'currentColor' : 'none'} />
    ))}
  </div>
)

// Reviews are managed in Admin → Reviews. The oldest is the featured card.
export default function Reviews() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    supabase
      .from('reviews')
      .select('id,name,place,rating,work,text')
      .order('created_at', { ascending: true })
      .limit(12) // ponytail: no pagination; add paging/carousel past ~12 reviews
      .then(({ data, error }) => (error ? console.error(error) : setRows(data)))
  }, [])

  if (!rows.length) return null
  const [featured, ...rest] = rows

  return (
    <section id="reviews" className="scroll-mt-14 bg-soft py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-2xl font-bold md:text-4xl">What Our Clients Say</h2>
        <p className="mx-auto mt-3 mb-8 max-w-2xl text-center text-muted md:text-lg">
          Honest feedback from homes we have built kitchens, wardrobes and furniture for.
        </p>

        <figure className="relative mx-auto max-w-3xl rounded-2xl border border-line bg-white p-6 shadow-sm md:p-10">
          <Quote size={36} className="absolute right-5 top-5 text-amber-100" aria-hidden="true" />
          <Stars n={featured.rating} />
          <blockquote className="mt-4 text-base leading-relaxed md:text-xl">“{featured.text}”</blockquote>
          <figcaption className="mt-5 text-sm">
            <span className="font-semibold">{featured.name}</span>
            <span className="text-muted"> · {featured.place}</span>
            {featured.work && <span className="mt-1 block text-muted">{featured.work}</span>}
          </figcaption>
        </figure>

        {rest.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {rest.map((r) => (
              <figure key={r.id}className="rounded-xl border border-line bg-white p-5 shadow-sm">
                <Stars n={r.rating} />
                <blockquote className="mt-3 text-sm leading-relaxed">“{r.text}”</blockquote>
                <figcaption className="mt-3 text-sm">
                  <span className="font-semibold">{r.name}</span>
                  <span className="text-muted"> · {r.place}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
