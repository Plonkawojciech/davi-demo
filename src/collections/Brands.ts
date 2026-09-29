import type { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: { singular: 'Marka', plural: 'Marki' },
  admin: { useAsTitle: 'name', group: 'Katalog', defaultColumns: ['name', 'country', 'imported', 'featured', 'order'] },
  access: { read: () => true },
  fields: [
    { name: 'name', label: 'Nazwa', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'slug', label: 'Adres (slug)', type: 'text', required: true, unique: true, admin: { width: '40%' } },
        { name: 'country', label: 'Kraj pochodzenia', type: 'text', admin: { width: '30%' } },
        { name: 'since', label: 'Rok założenia', type: 'number', admin: { width: '30%' } },
      ],
    },
    { name: 'tagline', label: 'Jedno zdanie o marce', type: 'text' },
    { name: 'description', label: 'Opis', type: 'textarea' },
    { name: 'website', label: 'Strona marki (URL)', type: 'text' },
    { name: 'imageUrl', label: 'Zdjęcie marki (URL)', type: 'text' },
    { name: 'image', label: 'Zdjęcie marki (plik)', type: 'upload', relationTo: 'media' },
    { name: 'imported', label: 'Marka importowana (wyłączność DAVI)', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'featured', label: 'Pokaż na stronie głównej', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'order', label: 'Kolejność', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
