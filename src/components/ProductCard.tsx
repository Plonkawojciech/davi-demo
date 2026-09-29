import Link from 'next/link'
import { pic, rel } from '@/lib/data'

export function ProductCard({ p }: { p: any }) {
  const img = pic(p)
  const brand = rel<any>(p.brand)
  return (
    <Link href={`/produkt/${p.slug}`} className="prod">
      <span className="ph">
        {p.isNew && <span className="flag">Nowość</span>}
        {img && <img src={img} alt="" loading="lazy" referrerPolicy="no-referrer" />}
      </span>
      <span className="cb">
        <span className="maker">{brand?.name || p.brandName}</span>
        <span className="nm">{p.name}</span>
        <span className="meta"><span>{p.sku}</span>{p.size && <span>{p.size}</span>}</span>
      </span>
    </Link>
  )
}
