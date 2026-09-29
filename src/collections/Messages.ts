import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Wiadomość', plural: 'Wiadomości z formularza' },
  admin: { useAsTitle: 'subject', group: 'Sprzedaż', defaultColumns: ['subject', 'department', 'email', 'createdAt'] },
  access: { create: () => false, read: ({ req }) => !!req.user },
  fields: [
    { name: 'department', label: 'Dział', type: 'text' },
    { name: 'subject', label: 'Temat', type: 'text', required: true },
    { type: 'row', fields: [
      { name: 'name', label: 'Imię i nazwisko / firma', type: 'text' },
      { name: 'email', label: 'E-mail', type: 'email', required: true },
    ] },
    { name: 'body', label: 'Treść', type: 'textarea', required: true },
  ],
}
