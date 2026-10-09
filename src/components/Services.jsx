import { Armchair, ChefHat, DoorOpen, Hammer } from 'lucide-react'

// TODO(owner): add photos at public/services/*.webp; icon shows if missing
const SERVICES = [
  { title: 'Kitchens', category: 'kitchen', Icon: ChefHat, image: '/services/kitchen.webp', blurb: 'Modular & custom kitchens, cabinets, and shelving.' },
  { title: 'Custom Furniture', category: 'furniture', Icon: Armchair, image: '/services/furniture.webp', blurb: 'Beds, wardrobes, sofas, tables — made to measure.' },
  { title: 'Doors & Windows', category: 'doors', Icon: DoorOpen, image: '/services/doors.webp', blurb: 'Solid wood doors, frames, and window work.' },
  { title: 'Wood Polish & Repair', category: 'repair', Icon: Hammer, image: '/services/repair.webp', blurb: 'Polish, restoration, and repair of old woodwork.' },
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
              <div className="relative grid aspect-[4/3] place-items-center bg-soft text-brand">
                <Icon size={40} aria-hidden="true" />
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  className="absolute inset-0 h-full w-full object-cover"
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
