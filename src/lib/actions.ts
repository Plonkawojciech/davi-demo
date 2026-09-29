'use server'
import { db } from './data'

export type FormState = { ok: boolean; message: string; number?: string }
const NIP = /^\d{10}$/
const clean = (v: FormDataEntryValue | null) => String(v || '').trim()

export async function createOrder(_prev: FormState, form: FormData): Promise<FormState> {
  const company = clean(form.get('company'))
  const nip = clean(form.get('nip')).replace(/[\s-]/g, '')
  const contact = clean(form.get('contact'))
  const email = clean(form.get('email'))
  const phone = clean(form.get('phone'))
  const address = clean(form.get('address'))
  const note = clean(form.get('note'))
  let items: { id: number; sku?: string; qty: number }[] = []
  try { items = JSON.parse(clean(form.get('items')) || '[]') } catch { items = [] }
  if (!company || !contact || !email) return { ok: false, message: 'Uzupełnij firmę, osobę kontaktową i e-mail.' }
  if (!NIP.test(nip)) return { ok: false, message: 'NIP powinien mieć 10 cyfr.' }
  if (!items.length) return { ok: false, message: 'Lista zamówienia jest pusta.' }
  const payload = await db()
  const number = 'B2B-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900)
  await payload.create({
    collection: 'orders',
    data: { number, company, nip, contact, email, phone, address, note, itemsCount: items.length, items: items.map((i) => ({ product: i.id, sku: i.sku, qty: Math.max(1, Math.round(i.qty)) })) },
  })
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
  if (!NIP.test(nip)) return { ok: false, message: 'NIP powinien mieć 10 cyfr.' }
  const payload = await db()
  await payload.create({ collection: 'applications', data: { company, nip, kind: kind || 'other', contact, email, phone, city, message } })
  return { ok: true, message: 'Wniosek trafił do działu obsługi klientów hurtowych. Konto zakładamy po weryfikacji NIP, zwykle w jeden dzień roboczy.' }
}

export async function createMessage(_prev: FormState, form: FormData): Promise<FormState> {
  const department = clean(form.get('department'))
  const name = clean(form.get('name'))
  const email = clean(form.get('email'))
  const body = clean(form.get('body'))
  if (!email || !body) return { ok: false, message: 'Podaj e-mail i treść wiadomości.' }
  const payload = await db()
  await payload.create({ collection: 'messages', data: { department, name, email, body, subject: `${department || 'Kontakt'}: ${name || email}` } })
  return { ok: true, message: 'Wiadomość dotarła do właściwego działu. Odpowiadamy w godzinach pracy biura.' }
}
