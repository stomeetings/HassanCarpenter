export const BUSINESS = {
  name: 'Hassan Wood Worker',
  phone: '+923015734282',
  phoneDisplay: '03015734282',
  whatsapp: '923015734282', // digits only, no +
  whatsappText: 'Hi Hassan Wood Worker, I need a quote',
  email: 'owner@example.com', // TODO(owner)
  city: 'Rawalpindi & Islamabad, Pakistan',
  mapsUrl:
    "https://www.google.com/maps/place/33%C2%B034'39.4%22N+73%C2%B008'39.1%22E/@33.5776132,73.141622,905m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d33.5776132!4d73.1441969",
  lat: 33.5776132,
  lng: 73.1441969,
}

export const telHref = `tel:${BUSINESS.phone}`
export const waHref = (text = BUSINESS.whatsappText) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`

// value must match the CHECK constraint in schema.sql
export const CATEGORIES = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'doors', label: 'Doors' },
  { value: 'repair', label: 'Repair' },
]

export const categoryLabel = (v) => CATEGORIES.find((c) => c.value === v)?.label ?? v
