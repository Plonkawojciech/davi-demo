import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Ustawienia strony',
  admin: { group: 'Treści' },
  access: { read: () => true },
  fields: [
    { name: 'banner', label: 'Pasek na górze strony', type: 'text' },
    { name: 'heroTitle', label: 'Nagłówek strony głównej', type: 'text' },
    { name: 'heroText', label: 'Tekst pod nagłówkiem', type: 'textarea' },
    { name: 'heroImageUrl', label: 'Zdjęcie w hero (URL)', type: 'text' },
    { name: 'heroImage', label: 'Zdjęcie w hero (plik)', type: 'upload', relationTo: 'media' },
    { name: 'about', label: 'O firmie (2–3 zdania)', type: 'textarea' },
    {
      name: 'terms',
      label: 'Warunki współpracy',
      type: 'array',
      labels: { singular: 'Punkt', plural: 'Punkty' },
      fields: [
        { name: 'title', label: 'Nagłówek', type: 'text', required: true },
        { name: 'body', label: 'Treść', type: 'textarea', required: true },
      ],
    },
    { type: 'row', fields: [
      { name: 'phone', label: 'Telefon', type: 'text' },
      { name: 'email', label: 'E-mail B2B', type: 'email' },
    ] },
    { name: 'address', label: 'Adres', type: 'textarea' },
    { name: 'nip', label: 'NIP', type: 'text' },
    { name: 'hours', label: 'Godziny pracy', type: 'text' },
    {
      name: 'departments',
      label: 'Działy (tematy formularza kontaktowego)',
      type: 'array',
      fields: [{ name: 'name', label: 'Dział', type: 'text', required: true }],
    },
    { type: 'row', fields: [
      { name: 'facebook', label: 'Facebook (URL)', type: 'text' },
      { name: 'instagram', label: 'Instagram (URL)', type: 'text' },
    ] },
  ],
}
