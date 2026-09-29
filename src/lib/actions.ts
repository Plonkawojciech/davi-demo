'use server'
import { db } from './data'

export type FormState = { ok: boolean; message: string; number?: string }
const nipValid = (n: string) => {
  if (!/^\d{10}$/.test(n)) return false
  const w = [6, 5, 7, 2, 3, 4, 5, 6, 7]
  const sum = w.reduce((s, x, i) => s + x * Number(n[i]), 0)
  return sum % 11 === Number(n[9])
}
const clean = (v: FormDataEntryValue | null) => String(v || '').trim()

export async function createOrder(_prev: FormState, form: FormData): Promise<FormState> {
  const company = clean(form.get('company'))
  const nip = clean(form.get('nip')).replace(/[\s-]/g, '')
  const contact = clean(form.get('contact'))
  const email = clean(form.get('email'))
  const phone = clean(form.get('phone'))
  const address = clean(form.get('address'))
  const note = clean(form.get('note'))
  let raw: unknown = []
  try { raw = JSON.parse(clean(form.get('items')) || '[]') } catch { raw = [] }
  const items = (Array.isArray(raw) ? raw : [])
    .filter((i): i is { id: unknown; qty: unknown } => !!i && typeof i === 'object')
    .map((i) => ({ id: Number(i.id), qty: Math.min(9999, Math.max(1, Math.round(Number(i.qty) || 1))) }))
    .filter((i) => Number.isInteger(i.id) && i.id > 0)
    .slice(0, 200)
  if (!company || !contact || !email) return { ok: false, message: 'Uzupełnij firmę, osobę kontaktową i e-mail.' }
  if (company.length > 200 || contact.length > 120 || email.length > 160 || address.length > 500 || note.length > 2000) return { ok: false, message: 'Któreś pole jest za długie.' }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, message: 'Sprawdź adres e-mail.' }
  if (!nipValid(nip)) return { ok: false, message: 'NIP wygląda na błędny. Sprawdź 10 cyfr.' }
  if (!items.length) return { ok: false, message: 'Lista zamówienia jest pusta.' }
  const payload = await db()
  const known = await payload.find({ collection: 'products', where: { id: { in: items.map((i) => i.id) } }, limit: 200, depth: 0 })
  const bySku = new Map(known.docs.map((p) => [p.id, p.sku]))
  const valid = items.filter((i) => bySku.has(i.id))
  if (!valid.length) return { ok: false, message: 'Pozycje z listy nie są już dostępne. Odśwież katalog.' }
  const number = 'B2B-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Date.now().toString(36).slice(-4).toUpperCase() + Math.floor(10 + Math.random() * 90)
  try {
    await payload.create({
      collection: 'orders',
      data: { number, company, nip, contact, email, phone, address, note, itemsCount: valid.length, items: valid.map((i) => ({ product: i.id, sku: bySku.get(i.id), qty: i.qty })) },
    })
  } catch {
    return { ok: false, message: 'Nie udało się zapisać zamówienia. Spróbuj ponownie albo zadzwoń.' }
  }
  return { ok: true, message: 'Zamówienie przyjęte.', number }
}

export async function createApplication(_prev: FormState, form: FormData): Promise<FormState> {
  const company = clean(form.get('company'))
  const nip = clean(form.get('nip')).replace(/[\s-]/g, '')
  const kind = clean(form.get('kind')) as 'shop' | 'eshop' | 'wholesale' | 'salon' | 'other'
  const contact = clean(form.get('contact'))
  const email = clean(form.get('email'))
  const phone = clean(form.get('phone'))
  const city = clean(form.get('city'))
  const message = clean(form.get('message'))
  if (!company || !contact || !email || !phone) return { ok: false, message: 'Uzupełnij firmę, osobę kontaktową, e-mail i telefon.' }
  if (company.length > 200 || contact.length > 120 || email.length > 160 || phone.length > 40 || city.length > 120 || message.length > 2000) return { ok: false, message: 'Któreś pole jest za długie.' }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, message: 'Sprawdź adres e-mail.' }
  if (!nipValid(nip)) return { ok: false, message: 'NIP wygląda na błędny. Sprawdź 10 cyfr.' }
  const payload = await db()
  try {
    await payload.create({ collection: 'applications', data: { company, nip, kind: ['shop', 'eshop', 'wholesale', 'salon', 'other'].includes(kind) ? kind : 'other', contact, email, phone, city, message } })
  } catch {
    return { ok: false, message: 'Nie udało się zapisać wniosku. Spróbuj ponownie albo napisz na b2b@davi.com.pl.' }
  }
  return { ok: true, message: 'Wniosek trafił do działu obsługi klientów hurtowych. Konto zakładamy po weryfikacji NIP.' }
}

export async function createMessage(_prev: FormState, form: FormData): Promise<FormState> {
  const department = clean(form.get('department'))
  const name = clean(form.get('name'))
  const email = clean(form.get('email'))
  const body = clean(form.get('body'))
  if (!email || !body) return { ok: false, message: 'Podaj e-mail i treść wiadomości.' }
  if (email.length > 160 || name.length > 160 || department.length > 80 || body.length > 4000) return { ok: false, message: 'Któreś pole jest za długie.' }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, message: 'Sprawdź adres e-mail.' }
  const payload = await db()
  await payload.create({ collection: 'messages', data: { department, name, email, body, subject: `${department || 'Kontakt'}: ${name || email}`.slice(0, 200) } })
  return { ok: true, message: 'Wiadomość dotarła do właściwego działu. Odpowiadamy w godzinach pracy biura.' }
}
