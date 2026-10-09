import { Hammer, ShieldCheck } from 'lucide-react'

const HIGHLIGHTS = [
  { Icon: Hammer, title: 'In-house Fabrication', text: 'Custom manufacturing in our own local workshop.' },
  { Icon: ShieldCheck, title: 'Quality Warranty', text: 'Top-grade commercial plywood and durable hardware.' },
]

export default function AboutSection() {
  return (
    <section id="about" className="bg-white py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:gap-14 md:px-6">
        {/* TODO(owner): add public/about.webp; blank frame if missing */}
        <div className="min-h-48 w-full max-w-md justify-self-center overflow-hidden md:max-w-none rounded-2xl border-4 border-line bg-soft shadow-sm">
          <img
            src="/about.webp"
            alt="Hassan Carpenter, carpenter in Islamabad and Rawalpindi"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
            className="mx-auto block h-auto max-h-[80vh] w-full object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-amber-700">OUR LEGACY</p>
          <h2 className="mt-2 text-2xl font-bold md:text-4xl">
            Bespoke Woodcraft &amp; Custom Interiors in Rawalpindi &amp; Islamabad
          </h2>
          <p className="mt-4 text-muted md:text-lg">
            Expert hand-crafted furniture, modular kitchens, solid wood doors, and careful polish and repair —
            all built to your measurements and delivered on time.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {HIGHLIGHTS.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-line bg-soft p-4">
                <Icon className="text-brand" size={24} aria-hidden="true" />
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
