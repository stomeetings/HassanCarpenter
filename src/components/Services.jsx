import { DoorOpen, Paintbrush, Sofa, UtensilsCrossed } from 'lucide-react'

// TODO(owner): add photos at public/services/*.webp; icon shows if missing
const SERVICES = [
  { title: 'Kitchens', category: 'kitchen', Icon: UtensilsCrossed, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', blurb: 'Modular & custom kitchens, cabinets, and shelving.' },
  { title: 'Custom Furniture', category: 'furniture', Icon: Sofa, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', blurb: 'Beds, wardrobes, sofas, tables — made to measure.' },
  { title: 'Doors & Windows', category: 'doors', Icon: DoorOpen, image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80', blurb: 'Solid wood doors, frames, and window work.' },
  { title: 'Wood Polish & Repair', category: 'repair', Icon: Paintbrush, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80', blurb: 'Polish, restoration, and repair of old woodwork.' },
]

export default function Services() {
  return (
    <section id="services" className="bg-soft py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-4xl">What We Build</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {SERVICES.map(({ title, category, Icon, image, blurb }) => (
            <a
              key={category}
              href={`#work-${category}`}
              className="overflow-hidden rounded-xl border border-line bg-white text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="group relative m-2 grid aspect-[4/3] place-items-center overflow-hidden rounded-xl bg-soft">
                <span className="grid size-20 place-items-center rounded-2xl bg-amber-100 text-brand shadow-sm">
                  <Icon size={40} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <img
                  src={image}
                  alt={`${title} in Rawalpindi and Islamabad`}
                  width="1200"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{blurb}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-brand">View work →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
