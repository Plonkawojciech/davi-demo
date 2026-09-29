import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Zamówienie hurtowe', plural: 'Zamówienia hurtowe' },
  admin: {
    useAsTitle: 'number',
    group: 'Sprzedaż',
    defaultColumns: ['number', 'company', 'nip', 'itemsCount', 'status', 'createdAt'],
    description: 'Zamówienia złożone z listy na stronie. Ceny i potwierdzenie ustala handlowiec.',
  },
  access: { create: () => false, read: ({ req }) => !!req.user },
  fields: [
    { name: 'number', label: 'Numer', type: 'text', required: true, unique: true },
    {
      type: 'row',
      fields: [
        { name: 'company', label: 'Firma', type: 'text', required: true, admin: { width: '60%' } },
        { name: 'nip', label: 'NIP', type: 'text', required: true, admin: { width: '40%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'contact', label: 'Osoba kontaktowa', type: 'text', required: true },
        { name: 'email', label: 'E-mail', type: 'email', required: true },
        { name: 'phone', label: 'Telefon', type: 'text' },
      ],
    },
    { name: 'address', label: 'Adres dostawy', type: 'textarea' },
    { name: 'note', label: 'Uwagi', type: 'textarea' },
    {
      name: 'items',
      label: 'Pozycje',
      type: 'array',
      fields: [
        { type: 'row', fields: [
          { name: 'product', label: 'Produkt', type: 'relationship', relationTo: 'products', required: true },
          { name: 'productName', label: 'Nazwa', type: 'text', virtual: 'product.name', admin: { hidden: true } },
          { name: 'sku', label: 'Indeks', type: 'text' },
          { name: 'qty', label: 'Ilość', type: 'number', required: true, defaultValue: 1 },
        ] },
      ],
    },
    { name: 'itemsCount', label: 'Pozycji', type: 'number', admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'status', label: 'Status', type: 'select', defaultValue: 'new', admin: { position: 'sidebar' },
      options: [
        { label: 'Nowe', value: 'new' }, { label: 'Wycenione', value: 'quoted' }, { label: 'Potwierdzone', value: 'confirmed' },
        { label: 'Wysłane', value: 'shipped' }, { label: 'Anulowane', value: 'cancelled' },
      ],
    },
  ],
}
