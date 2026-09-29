import type { CollectionConfig } from 'payload'

export const Applications: CollectionConfig = {
  slug: 'applications',
  labels: { singular: 'Wniosek o konto B2B', plural: 'Wnioski o konto B2B' },
  admin: { useAsTitle: 'company', group: 'Sprzedaż', defaultColumns: ['company', 'nip', 'kind', 'contact', 'phone', 'status', 'createdAt'] },
  access: { create: () => true },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'company', label: 'Firma', type: 'text', required: true, admin: { width: '60%' } },
        { name: 'nip', label: 'NIP', type: 'text', required: true, admin: { width: '40%' } },
      ],
    },
    {
      name: 'kind', label: 'Rodzaj działalności', type: 'select', required: true,
      options: [
        { label: 'Drogeria / sklep stacjonarny', value: 'shop' }, { label: 'Sklep internetowy', value: 'eshop' },
        { label: 'Hurtownia / dystrybutor', value: 'wholesale' }, { label: 'Salon kosmetyczny / SPA', value: 'salon' }, { label: 'Inne', value: 'other' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'contact', label: 'Osoba kontaktowa', type: 'text', required: true },
        { name: 'email', label: 'E-mail', type: 'email', required: true },
        { name: 'phone', label: 'Telefon', type: 'text', required: true },
      ],
    },
    { name: 'city', label: 'Miejscowość', type: 'text' },
    { name: 'message', label: 'Czym handlujecie, jakie marki interesują', type: 'textarea' },
    {
      name: 'status', label: 'Status', type: 'select', defaultValue: 'new', admin: { position: 'sidebar' },
      options: [{ label: 'Nowy', value: 'new' }, { label: 'W weryfikacji', value: 'review' }, { label: 'Konto założone', value: 'approved' }, { label: 'Odrzucony', value: 'rejected' }],
    },
  ],
}
