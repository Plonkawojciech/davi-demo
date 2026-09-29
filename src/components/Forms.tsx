'use client'
import Link from 'next/link'
import { useActionState } from 'react'
import { useCart } from './cart'
import { createApplication, createMessage, createOrder, type FormState } from '@/lib/actions'

const KINDS: [string, string][] = [['shop', 'Drogeria / sklep stacjonarny'], ['eshop', 'Sklep internetowy'], ['wholesale', 'Hurtownia / dystrybutor'], ['salon', 'Salon kosmetyczny / SPA'], ['other', 'Inne']]

export function ApplicationForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createApplication, { ok: false, message: '' })
  if (state.ok) return <div className="done"><strong>Dziękujemy.</strong> {state.message}</div>
  return (
    <form action={action} className="form">
      <div className="form-row">
        <label>Firma<input name="company" required autoComplete="organization" /></label>
        <label>NIP<input name="nip" required inputMode="numeric" placeholder="10 cyfr" /></label>
      </div>
      <label>Rodzaj działalności
        <select name="kind" defaultValue="shop">{KINDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </label>
      <div className="form-row">
        <label>Osoba kontaktowa<input name="contact" required autoComplete="name" /></label>
        <label>Miejscowość<input name="city" autoComplete="address-level2" /></label>
      </div>
      <div className="form-row">
        <label>E-mail<input name="email" type="email" required autoComplete="email" /></label>
        <label>Telefon<input name="phone" type="tel" required autoComplete="tel" /></label>
      </div>
      <label>Czym handlujecie, jakie marki Was interesują<textarea name="message" rows={3} /></label>
      {state.message && !state.ok && <p className="form-err">{state.message}</p>}
      <button className="btn btn-accent" disabled={pending}>{pending ? 'Wysyłanie…' : 'Wyślij wniosek'}</button>
      <p className="note">Wniosek trafia do działu obsługi klientów hurtowych. Po weryfikacji dostajesz login, cennik i warunki płatności.</p>
    </form>
  )
}

export function ContactForm({ departments }: { departments: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(createMessage, { ok: false, message: '' })
  if (state.ok) return <div className="done"><strong>Wysłane.</strong> {state.message}</div>
  return (
    <form action={action} className="form">
      <label>Temat
        <select name="department" defaultValue={departments[0]}>{departments.map((d) => <option key={d} value={d}>{d}</option>)}</select>
      </label>
      <div className="form-row">
        <label>Imię i nazwisko / firma<input name="name" autoComplete="name" /></label>
        <label>E-mail<input name="email" type="email" required autoComplete="email" /></label>
      </div>
      <label>Wiadomość<textarea name="body" rows={5} required /></label>
      {state.message && !state.ok && <p className="form-err">{state.message}</p>}
      <button className="btn btn-accent" disabled={pending}>{pending ? 'Wysyłanie…' : 'Wyślij wiadomość'}</button>
    </form>
  )
}

export function OrderPage() {
  const { lines, remove, setQty, clear, ready, count } = useCart()
  const [state, action, pending] = useActionState<FormState, FormData>(async (prev, form) => {
    const r = await createOrder(prev, form)
    if (r.ok) clear()
    return r
  }, { ok: false, message: '' })

  if (state.ok) return (
    <div className="section"><div className="wrap">
      <div className="done big">
        <p className="kicker" style={{ margin: 0 }}>Zamówienie {state.number}</p>
        <h1 className="h2">Przyjęliśmy zamówienie</h1>
        <p className="lead" style={{ marginTop: 0 }}>Handlowiec potwierdzi dostępność i wyśle wycenę na e-mail. Po uruchomieniu płatności online w tym miejscu klient z kontem B2B zapłaci od razu albo wybierze termin płatności.</p>
        <Link className="btn btn-solid" href="/produkty">Wróć do katalogu</Link>
      </div>
    </div></div>
  )
  if (!ready) return <div className="section" />
  if (!lines.length) return (
    <div className="section"><div className="wrap">
      <h1 className="h1">Zamówienie</h1>
      <p className="lead">Lista jest pusta. Dodaj produkty z katalogu — ilości możesz zmienić tutaj przed wysłaniem.</p>
      <div className="cta-row"><Link className="btn btn-solid" href="/produkty">Przejdź do katalogu</Link></div>
    </div></div>
  )
  return (
    <div className="section"><div className="wrap cart">
      <div>
        <h1 className="h1">Zamówienie</h1>
        <p className="lead">{count} szt. w {lines.length} {lines.length === 1 ? 'pozycji' : 'pozycjach'}. Ceny hurtowe naliczamy po zalogowaniu; bez konta zamówienie trafia do handlowca jako zapytanie.</p>
        <ul className="lines">
          {lines.map((l) => (
            <li key={l.id} className="line">
              {l.image ? <img src={l.image} alt="" referrerPolicy="no-referrer" /> : <span />}
              <div>
                <Link href={`/produkt/${l.slug}`} className="nm">{l.name}</Link>
                <div className="vr">{l.sku}{l.size ? ` · ${l.size}` : ''}</div>
                <div className="qty">
                  <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label="Mniej">−</button>
                  <output>{l.qty}</output>
                  <button type="button" onClick={() => setQty(l.id, l.qty + 1)} aria-label="Więcej">+</button>
                </div>
                <button type="button" className="rm" onClick={() => remove(l.id)}>Usuń</button>
              </div>
              <div className="amt">{l.qty} szt.</div>
            </li>
          ))}
        </ul>
      </div>
      <form action={action} className="form checkout">
        <p className="aside-h">Dane zamawiającego</p>
        <input type="hidden" name="items" value={JSON.stringify(lines.map((l) => ({ id: l.id, sku: l.sku, qty: l.qty })))} />
        <div className="form-row">
          <label>Firma<input name="company" required autoComplete="organization" /></label>
          <label>NIP<input name="nip" required inputMode="numeric" /></label>
        </div>
        <label>Osoba kontaktowa<input name="contact" required autoComplete="name" /></label>
        <div className="form-row">
          <label>E-mail<input name="email" type="email" required autoComplete="email" /></label>
          <label>Telefon<input name="phone" type="tel" autoComplete="tel" /></label>
        </div>
        <label>Adres dostawy<textarea name="address" rows={2} autoComplete="street-address" /></label>
        <label>Uwagi<textarea name="note" rows={2} placeholder="Termin dostawy, palety, faktura zbiorcza" /></label>
        {state.message && !state.ok && <p className="form-err">{state.message}</p>}
        <button className="btn btn-accent" disabled={pending}>{pending ? 'Wysyłanie…' : 'Wyślij zamówienie'}</button>
        <p className="note">Docelowo: płatność online (Przelewy24, BLIK) albo kredyt kupiecki dla stałych klientów. W demie zamówienie ląduje w panelu.</p>
      </form>
    </div></div>
  )
}
