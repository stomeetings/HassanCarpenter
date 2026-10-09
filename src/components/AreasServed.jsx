const AREAS = [
  'Bahria Town', 'DHA Islamabad', 'DHA Rawalpindi', 'Blue Area', 'Satellite Town', 'Pakistan Town',
  'Peshawar Road', 'Rawal Town', 'Chaklala Scheme', 'Saddar', 'Gulzar-e-Quaid',
  'F-6 / F-7 / F-8 / F-10 / F-11', 'G-6 to G-11 & G-13', 'H-8 / H-9', 'I-8 / I-9 / I-10',
]

export default function AreasServed() {
  return (
    <section id="areas" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
        <h2 className="text-2xl font-bold md:text-4xl">Carpenter Services Across Rawalpindi &amp; Islamabad</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted md:text-lg">
          Kitchen cabinets, wardrobes, doors, furniture and wood polish — we work in all areas and sectors of
          Rawalpindi and Islamabad, including:
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {AREAS.map((a) => (
            <li key={a} className="rounded-full border border-line bg-soft px-4 py-1.5 text-sm font-medium">{a}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
