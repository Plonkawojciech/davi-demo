import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produkt', plural: 'Produkty' },
  admin: {
    useAsTitle: 'name',
    group: 'Katalog',
    defaultColumns: ['name', 'sku', 'brandName', 'categoryName', 'isNew', 'featured', 'available'],
    description: 'Indeks (SKU) i nazwa jak w obecnej e-hurtowni. Ceny hurtowe widzi klient po zalogowaniu — w demie ich nie pokazujemy.',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', label: 'Nazwa', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'sku', label: 'Indeks (SKU)', type: 'text', required: true, unique: true, admin: { width: '30%' } },
        { name: 'slug', label: 'Adres (slug)', type: 'text', required: true, unique: true, admin: { width: '70%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'brand', label: 'Marka', type: 'relationship', relationTo: 'brands', required: true, admin: { width: '50%' } },
        { name: 'category', label: 'Kategoria', type: 'relationship', relationTo: 'categories', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'brandName', label: 'Marka', type: 'text', virtual: 'brand.name', admin: { hidden: true } },
    { name: 'categoryName', label: 'Kategoria', type: 'text', virtual: 'category.name', admin: { hidden: true } },
    { name: 'short', label: 'Krótki opis', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'size', label: 'Pojemność / ilość', type: 'text', admin: { width: '33%', description: 'np. 200 ml, 18 szt' } },
        { name: 'packQty', label: 'Sztuk w opakowaniu zbiorczym', type: 'number', admin: { width: '33%' } },
        { name: 'ean', label: 'EAN', type: 'text', admin: { width: '33%' } },
      ],
    },
    { name: 'imageUrl', label: 'Zdjęcie (URL)', type: 'text', admin: { description: 'W demie zdjęcia pochodzą z davi.com.pl. Po wdrożeniu — pole „Zdjęcie” poniżej.' } },
    { name: 'image', label: 'Zdjęcie (plik)', type: 'upload', relationTo: 'media' },
    { name: 'features', label: 'Cechy', type: 'array', labels: { singular: 'Cecha', plural: 'Cechy' }, fields: [{ name: 'text', label: 'Treść', type: 'text', required: true }] },
    { name: 'isNew', label: 'Nowość', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'featured', label: 'Pokaż na stronie głównej', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'available', label: 'Dostępny', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
