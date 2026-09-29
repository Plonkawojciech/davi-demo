import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db, pic, rel } from '@/lib/data'
import { ProductCard } from '@/components/ProductCard'
import { AddToOrder } from '@/components/AddToOrder'
import { ApplicationForm, ContactForm, OrderPage } from '@/components/Forms'

type Props = { params: Promise<{ slug: string[] }>; searchParams: Promise<Record<string, string | undefined>> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const segs = (await params).slug
  const p = segs.join('/')
  const fixed: Record<string, string> = { produkty: 'Katalog produktów', marki: 'Marki', wspolpraca: 'Warunki współpracy', kontakt: 'Kontakt', zamowienie: 'Zamówienie', 'konto-b2b': 'Konto B2B' }
  if (fixed[p]) return { title: fixed[p] }
  const payload = await db()
  if (segs[0] === 'produkt' && segs[1]) {
    const r = await payload.find({ collection: 'products', where: { slug: { equals: segs[1] } }, limit: 1 })
    return r.docs[0] ? { title: r.docs[0].name, description: r.docs[0].short || undefined } : {}
  }
  if (segs[0] === 'marki' && segs[1]) {
    const r = await payload.find({ collection: 'brands', where: { slug: { equals: segs[1] } }, limit: 1 })
    return r.docs[0] ? { title: `${r.docs[0].name} — produkty marki` } : {}
  }
  if (segs[0] === 'kategoria' && segs[1]) {
    const r = await payload.find({ collection: 'categories', where: { slug: { equals: segs[1] } }, limit: 1 })
    return r.docs[0] ? { title: r.docs[0].name } : {}
  }
  return {}
}

async function Catalog({ title, lead, brandId, categoryId, active, crumbs }: { title: string; lead?: string | null; brandId?: number; categoryId?: number; active: string; crumbs: React.ReactNode }) {
  const payload = await db()
  const where: any = { and: [] as any[] }
  if (brandId) where.and.push({ brand: { equals: brandId } })
  if (categoryId) where.and.push({ category: { equals: categoryId } })
  const [products, brands, categories] = await Promise.all([
    payload.find({ collection: 'products', where: where.and.length ? where : {}, limit: 48, depth: 1, sort: 'sku' }),
    payload.find({ collection: 'brands', sort: 'order', limit: 30, depth: 0 }),
    payload.find({ collection: 'categories', sort: 'order', limit: 20, depth: 0 }),
  ])
  return (
    <div className="section"><div className="wrap">
      <div className="crumbs">{crumbs}</div>
      <h1 className="h1">{title}</h1>
      {lead && <p className="lead">{lead}</p>}
      <div className="shop">
        <nav className="rail" aria-label="Filtry">
          <p className="rail-h">Kategorie</p>
          <Link href="/produkty" className={active === 'all' ? 'on' : ''}>Wszystkie produkty</Link>
          {categories.docs.map((c) => <Link key={c.id} href={`/kategoria/${c.slug}`} className={active === `c:${c.slug}` ? 'on' : ''}>{c.name}</Link>)}
          <p className="rail-h" style={{ marginTop: 26 }}>Marki</p>
          {brands.docs.map((b) => <Link key={b.id} href={`/marki/${b.slug}`} className={active === `b:${b.slug}` ? 'on' : ''}>{b.name}</Link>)}
        </nav>
        <div>
          <p className="count">{products.totalDocs} {products.totalDocs === 1 ? 'pozycja' : products.totalDocs < 5 ? 'pozycje' : 'pozycji'} w demie. W pełnej e-hurtowni: 5291.</p>
          {products.docs.length
            ? <div className="grid">{products.docs.map((p) => <ProductCard key={p.id} p={p} />)}</div>
            : <div className="empty">W tej wersji demo ta półka jest pusta. Po wdrożeniu trafi tu pełny asortyment z obecnego systemu, z tymi samymi indeksami.</div>}
        </div>
      </div>
    </div></div>
  )
}

export default async function Page({ params }: Props) {
  const segs = (await params).slug
  const p = segs.join('/')
  const payload = await db()

  if (p === 'produkty') return <Catalog title="Katalog produktów" lead="Kosmetyki, perfumy, higiena i chemia gospodarcza od jednego dostawcy. Ceny hurtowe po zalogowaniu; bez konta możesz przygotować listę zamówienia i wysłać ją do handlowca." active="all" crumbs={<><Link href="/">Start</Link><span>/</span><span>Produkty</span></>} />

  if (segs[0] === 'kategoria' && segs[1]) {
    const c = (await payload.find({ collection: 'categories', where: { slug: { equals: segs[1] } }, limit: 1 })).docs[0]
    if (!c) notFound()
    return <Catalog title={c.name} lead={c.lead} categoryId={c.id} active={`c:${c.slug}`} crumbs={<><Link href="/">Start</Link><span>/</span><Link href="/produkty">Produkty</Link><span>/</span><span>{c.name}</span></>} />
  }

  if (p === 'marki') {
    const brands = await payload.find({ collection: 'brands', sort: 'order', limit: 40 })
    return (
      <div className="section"><div className="wrap">
        <div className="crumbs"><Link href="/">Start</Link><span>/</span><span>Marki</span></div>
        <h1 className="h1">Marki w ofercie</h1>
        <p className="lead">Marki importowane to wyłączna dystrybucja DAVI w Polsce. Do tego producenci krajowi i marki własne. Każda ma stronę z opisem i pełnym asortymentem.</p>
        <div className="brands">
          {brands.docs.map((b) => {
            const img = pic(b)
            return (
              <Link key={b.id} href={`/marki/${b.slug}`} className="brandcard">
                <span className="brandcard-ph">{img ? <img src={img} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <b>{b.name}</b>}</span>
                <span className="brandcard-body">
                  <b>{b.name}</b>
                  <span>{[b.country, b.since ? `od ${b.since}` : null, b.imported ? 'wyłączny import' : null].filter(Boolean).join(' · ')}</span>
                  <em>{b.tagline}</em>
                </span>
              </Link>
            )
          })}
        </div>
      </div></div>
    )
  }

  if (segs[0] === 'marki' && segs[1]) {
    const b = (await payload.find({ collection: 'brands', where: { slug: { equals: segs[1] } }, limit: 1 })).docs[0]
    if (!b) notFound()
    const img = pic(b, 'full')
    return (
      <>
        <section className="bhero"><div className="wrap bhero-grid">
          <div>
            <div className="crumbs"><Link href="/">Start</Link><span>/</span><Link href="/marki">Marki</Link><span>/</span><span>{b.name}</span></div>
            <p className="kicker">{[b.country, b.since ? `od ${b.since}` : null, b.imported ? 'wyłączny import DAVI' : null].filter(Boolean).join(' · ')}</p>
            <h1 className="display">{b.name}</h1>
            <p className="lead">{b.tagline}</p>
            <p className="prose">{b.description}</p>
            {b.website && <p className="note"><a href={b.website} rel="noopener" target="_blank" className="textlink">{b.website.replace(/^https?:\/\//, '')}</a></p>}
          </div>
          {img && <div className="bhero-media"><img src={img} alt="" referrerPolicy="no-referrer" /></div>}
        </div></section>
        <Catalog title={`Produkty ${b.name}`} brandId={b.id} active={`b:${b.slug}`} crumbs={<><Link href="/">Start</Link><span>/</span><Link href="/produkty">Produkty</Link><span>/</span><span>{b.name}</span></>} />
      </>
    )
  }

  if (segs[0] === 'produkt' && segs[1]) {
    const pr = (await payload.find({ collection: 'products', where: { slug: { equals: segs[1] } }, limit: 1, depth: 1 })).docs[0]
    if (!pr) notFound()
    const brand = rel<any>(pr.brand)
    const cat = rel<any>(pr.category)
    const related = await payload.find({ collection: 'products', where: { and: [{ brand: { equals: brand?.id } }, { id: { not_equals: pr.id } }] }, limit: 4, depth: 1 })
    const img = pic(pr, 'full')
    return (
      <div className="section"><div className="wrap">
        <div className="crumbs">
          <Link href="/">Start</Link><span>/</span><Link href="/produkty">Produkty</Link>
          {cat && <><span>/</span><Link href={`/kategoria/${cat.slug}`}>{cat.name}</Link></>}
          <span>/</span><span>{pr.sku}</span>
        </div>
        <div className="product">
          <div className="gal"><div className="main">{img && <img src={img} alt={pr.name} referrerPolicy="no-referrer" />}</div></div>
          <div>
            {brand && <Link href={`/marki/${brand.slug}`} className="maker-link">{brand.name}</Link>}
            <h1 className="h2">{pr.name}</h1>
            <p className="pmeta"><span>Indeks {pr.sku}</span>{pr.size && <span>{pr.size}</span>}{pr.ean && <span>EAN {pr.ean}</span>}{pr.isNew && <span className="tag">Nowość</span>}</p>
            {pr.short && <p className="lead" style={{ marginTop: 0 }}>{pr.short}</p>}
            <div className="pricebox">
              <b>Cena hurtowa po zalogowaniu</b>
              <span>Konto B2B daje dostęp do cennika, rabatów ilościowych i faktur. <Link href="/konto-b2b" className="textlink">Załóż konto</Link></span>
            </div>
            <AddToOrder product={{ id: pr.id, slug: pr.slug, name: pr.name, sku: pr.sku, image: img || undefined, size: pr.size || undefined }} packQty={pr.packQty} available={pr.available !== false} />
            {pr.features && pr.features.length > 0 && <><p className="subh">Cechy</p><ul className="feats">{pr.features.map((f: any) => <li key={f.id}>{f.text}</li>)}</ul></>}
          </div>
        </div>
        {related.docs.length > 0 && (
          <div style={{ marginTop: 88 }}>
            <div className="sechead"><h2 className="h3">Więcej od {brand?.name}</h2><Link className="textlink" href={`/marki/${brand?.slug}`}>Cała marka</Link></div>
            <div className="grid">{related.docs.map((r) => <ProductCard key={r.id} p={r} />)}</div>
          </div>
        )}
      </div></div>
    )
  }

  if (p === 'zamowienie') return <OrderPage />

  if (p === 'konto-b2b') {
    const s = await payload.findGlobal({ slug: 'settings' })
    return (
      <div className="section"><div className="wrap split">
        <div>
          <div className="crumbs"><Link href="/">Start</Link><span>/</span><span>Konto B2B</span></div>
          <h1 className="h1">Konto hurtowe</h1>
          <p className="lead">Sprzedajemy wyłącznie firmom. Po weryfikacji NIP dostajesz login do e-hurtowni z cennikiem, rabatami i historią zamówień.</p>
          <ol className="steps dark-steps">
            {(s.terms || []).map((t: any) => <li key={t.id}><b>{t.title}</b><span>{t.body}</span></li>)}
          </ol>
        </div>
        <div className="aside"><p className="aside-h">Wniosek o konto</p><ApplicationForm /></div>
      </div></div>
    )
  }

  if (p === 'wspolpraca') {
    const s = await payload.findGlobal({ slug: 'settings' })
    return (
      <div className="section"><div className="wrap narrow">
        <div className="crumbs"><Link href="/">Start</Link><span>/</span><span>Współpraca</span></div>
        <h1 className="h1">Warunki współpracy</h1>
        <p className="lead">{s.about}</p>
        <div className="terms">
          {(s.terms || []).map((t: any) => <section key={t.id}><h2 className="h3">{t.title}</h2><p>{t.body}</p></section>)}
        </div>
        <div className="cta-row"><Link className="btn btn-accent" href="/konto-b2b">Załóż konto B2B</Link><Link className="btn btn-line" href="/kontakt">Zapytaj handlowca</Link></div>
      </div></div>
    )
  }

  if (p === 'kontakt') {
    const s = await payload.findGlobal({ slug: 'settings' })
    const deps = (s.departments || []).map((d: any) => d.name)
    return (
      <div className="section"><div className="wrap split">
        <div>
          <div className="crumbs"><Link href="/">Start</Link><span>/</span><span>Kontakt</span></div>
          <h1 className="h1">Kontakt</h1>
          <dl className="dl">
            <div><dt>Telefon</dt><dd><a href={`tel:${(s.phone || '').replace(/[\s-]/g, '')}`}>{s.phone}</a></dd></div>
            <div><dt>E-mail w sprawie zamówień</dt><dd><a href={`mailto:${s.email}`}>{s.email}</a></dd></div>
            <div><dt>Adres</dt><dd style={{ whiteSpace: 'pre-line' }}>{s.address}</dd></div>
            <div><dt>NIP</dt><dd>{s.nip}</dd></div>
            <div><dt>Godziny pracy</dt><dd>{s.hours}</dd></div>
          </dl>
        </div>
        <div className="aside"><p className="aside-h">Napisz do właściwego działu</p><ContactForm departments={deps.length ? deps : ['Obsługa klientów hurtowych']} /></div>
      </div></div>
    )
  }

  notFound()
}
