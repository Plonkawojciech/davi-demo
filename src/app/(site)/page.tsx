import Link from 'next/link'
import { db, pic } from '@/lib/data'
import { ProductCard } from '@/components/ProductCard'

export default async function Home() {
  const payload = await db()
  const [s, brands, news, featured, categories] = await Promise.all([
    payload.findGlobal({ slug: 'settings' }),
    payload.find({ collection: 'brands', where: { featured: { equals: true } }, sort: 'order', limit: 8 }),
    payload.find({ collection: 'products', where: { isNew: { equals: true } }, limit: 4, depth: 1 }),
    payload.find({ collection: 'products', where: { featured: { equals: true } }, limit: 8, depth: 1 }),
    payload.find({ collection: 'categories', sort: 'order', limit: 12 }),
  ])
  const hero = pic({ image: s.heroImage, imageUrl: s.heroImageUrl }, 'full')
  return (
    <>
      <section className="hero"><div className="wrap hero-grid">
        <div>
          <p className="kicker">Hurtownia kosmetyków i chemii gospodarczej · Gostyń</p>
          <h1 className="display">{s.heroTitle}</h1>
          <p className="lead">{s.heroText}</p>
          <div className="cta-row">
            <Link className="btn btn-accent" href="/produkty">Przeglądaj katalog</Link>
            <Link className="btn btn-line" href="/konto-b2b">Załóż konto B2B</Link>
          </div>
        </div>
        <div className="hero-media">{hero && <img src={hero} alt="" fetchPriority="high" referrerPolicy="no-referrer" />}</div>
      </div></section>

      <section className="brandbar"><div className="wrap">
        {brands.docs.map((b) => (
          <Link key={b.id} href={`/marki/${b.slug}`} className="brandbar-item">
            <b>{b.name}</b>
            <span>{[b.country, b.since ? `od ${b.since}` : null].filter(Boolean).join(' · ')}</span>
          </Link>
        ))}
      </div></section>

      <section className="section"><div className="wrap">
        <div className="sechead">
          <div><p className="kicker">Nowości</p><h2 className="h2">Co doszło do oferty</h2></div>
          <Link className="textlink" href="/produkty">Cały katalog</Link>
        </div>
        <div className="grid">{news.docs.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </div></section>

      <section className="section tint"><div className="wrap">
        <div className="sechead">
          <div><p className="kicker">Kategorie</p><h2 className="h2">Od perfum po płyn do podłóg</h2>
            <p className="lead">Jeden dostawca dla drogerii, sklepu internetowego i hurtowni. Zamówienie składa się z jednej listy, faktura jest jedna.</p></div>
        </div>
        <div className="cats">
          {categories.docs.map((c) => (
            <Link key={c.id} href={`/kategoria/${c.slug}`} className="cat">
              <b>{c.name}</b>
              <span>{c.lead}</span>
            </Link>
          ))}
        </div>
      </div></section>

      <section className="section"><div className="wrap">
        <div className="sechead">
          <div><p className="kicker">Wybór handlowca</p><h2 className="h2">Najczęściej zamawiane</h2></div>
        </div>
        <div className="grid">{featured.docs.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </div></section>

      <section className="section navy"><div className="wrap split">
        <div>
          <p className="kicker">Konto B2B</p>
          <h2 className="h2">Ceny hurtowe, historia zamówień i faktury w jednym miejscu</h2>
          <p className="lead">Po weryfikacji NIP dostajesz dostęp do cennika, rabatów i faktur. Zamówienie składasz z jednej listy. Płatność online i kredyt kupiecki dla stałych klientów to kolejny etap wdrożenia.</p>
          <div className="cta-row"><Link className="btn btn-accent" href="/konto-b2b">Złóż wniosek</Link><Link className="btn btn-line" href="/wspolpraca">Warunki współpracy</Link></div>
        </div>
        <ol className="steps">
          {(s.terms || []).slice(0, 4).map((t: any) => <li key={t.id}><b>{t.title}</b><span>{t.body}</span></li>)}
        </ol>
      </div></section>
    </>
  )
}
