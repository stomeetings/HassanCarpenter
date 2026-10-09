export const BUSINESS = {
  name: 'Hassan Carpenter',
  phone: '+923000000000', // TODO(owner): real number, E.164
  phoneDisplay: '0300 000 0000', // TODO(owner)
  whatsapp: '923000000000', // TODO(owner): digits only, no +
  whatsappText: 'Hi Hassan Carpenter, I saw your work online and want a quote.',
  email: 'owner@example.com', // TODO(owner)
  city: 'Lahore, Pakistan', // TODO(owner)
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
