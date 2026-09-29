'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from './cart'

const NAV: [string, string][] = [
  ['Produkty', '/produkty'],
  ['Marki', '/marki'],
  ['Współpraca', '/wspolpraca'],
  ['Kontakt', '/kontakt'],
]

export function Header() {
  const { count, ready } = useCart()
  const [open, setOpen] = useState(false)
  const path = usePathname()
  useEffect(() => setOpen(false), [path])
  const active = (h: string) => path === h || path.startsWith(h + '/') || (h === '/produkty' && (path.startsWith('/produkt/') || path.startsWith('/kategoria/')))
  return (
    <>
      <header className="head">
        <div className="wrap">
          <Link href="/" className="brand" aria-label="DAVI, strona główna">
            <img src="https://davi.com.pl/img/logo-1718994784.jpg" alt="DAVI" width={96} height={32} referrerPolicy="no-referrer" />
            <small>Hurtownia kosmetyków i chemii gospodarczej</small>
          </Link>
          <nav className="nav" aria-label="Główne">
            {NAV.map(([l, h]) => <Link key={h} href={h} className={active(h) ? 'on' : ''}>{l}</Link>)}
          </nav>
          <div className="head-act">
            <Link href="/konto-b2b" className="btn btn-line btn-sm">Konto B2B</Link>
            <Link href="/zamowienie" className="cart-btn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 6h16l-1.5 9h-13z" /><path d="M8 6V4h8v2" /><path d="M9 19h.01M15 19h.01" /></svg>
              Zamówienie{ready && count > 0 ? <i>{count}</i> : null}
            </Link>
            <button className="burger" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((o) => !o)}><span /><span /><span /></button>
          </div>
        </div>
      </header>
      <nav className={'drawer' + (open ? ' open' : '')} aria-label="Menu mobilne">
        {NAV.map(([l, h]) => <Link key={h} href={h}>{l}</Link>)}
        <Link href="/konto-b2b">Konto B2B</Link>
      </nav>
    </>
  )
}
