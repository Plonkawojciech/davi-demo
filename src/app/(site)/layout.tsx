import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { CartProvider } from '@/components/cart'
import { Header } from '@/components/Header'
import { db } from '@/lib/data'

const sans = Manrope({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: { default: 'DAVI — hurtownia kosmetyków i chemii gospodarczej', template: '%s — DAVI B2B' },
  description: 'P.H. DAVI Sp. z o.o., Gostyń. Importer hiszpańskich marek kosmetycznych i chemii gospodarczej: Instituto Español, Saphir, Asevi, Flor de Mayo, La Casa de los Aromas. Sprzedaż hurtowa B2B.',
  openGraph: { siteName: 'DAVI', locale: 'pl_PL', type: 'website' },
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const payload = await db()
  const [s, brands] = await Promise.all([
    payload.findGlobal({ slug: 'settings' }),
    payload.find({ collection: 'brands', sort: 'order', limit: 30, depth: 0 }),
  ])
  const tel = (s.phone || '').replace(/[\s-]/g, '')
  return (
    <html lang="pl" className={sans.variable}>
      <body>
        <CartProvider>
          {s.banner && <div className="topline"><div className="wrap"><span>{s.banner}</span><a href={`mailto:${s.email}`}>{s.email}</a></div></div>}
          <Header />
          <main>{children}</main>
          <footer className="foot"><div className="wrap">
            <div>
              <p className="foot-name">DAVI</p>
              <p className="foot-txt">{s.about}</p>
              <p className="foot-addr">{(s.address || '').split('\n').map((l: string) => <span key={l}>{l}</span>)}{s.nip && <span>NIP {s.nip}</span>}</p>
            </div>
            <div>
              <p className="foot-h">Marki</p>
              <ul className="foot-brands">{brands.docs.map((b) => <li key={b.id}><Link href={`/marki/${b.slug}`}>{b.name}</Link></li>)}</ul>
            </div>
            <div>
              <p className="foot-h">Dla klientów</p>
              <ul>
                <li><Link href="/produkty">Katalog produktów</Link></li>
                <li><Link href="/konto-b2b">Załóż konto B2B</Link></li>
                <li><Link href="/wspolpraca">Warunki współpracy</Link></li>
                <li><Link href="/zamowienie">Twoje zamówienie</Link></li>
                <li><Link href="/kontakt">Kontakt</Link></li>
              </ul>
            </div>
            <div>
              <p className="foot-h">Biuro</p>
              <ul>
                <li><a href={`tel:${tel}`}>{s.phone}</a></li>
                <li><a href={`mailto:${s.email}`}>{s.email}</a></li>
                {s.hours && <li>{s.hours}</li>}
                {s.facebook && <li><a href={s.facebook} rel="noopener">Facebook</a></li>}
                {s.instagram && <li><a href={s.instagram} rel="noopener">Instagram</a></li>}
              </ul>
            </div>
            <div className="cr"><span>© {new Date().getFullYear()} P.H. DAVI Sp. z o.o.</span><span>Wersja demonstracyjna nowej e-hurtowni · Programo s.j.</span></div>
          </div></footer>
        </CartProvider>
      </body>
    </html>
  )
}
