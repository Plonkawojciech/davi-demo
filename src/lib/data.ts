import { getPayload } from 'payload'
import config from '@payload-config'

export const db = () => getPayload({ config })

export type Img = { url?: string | null; alt?: string | null; sizes?: { thumb?: { url?: string | null }; card?: { url?: string | null } } } | number | null | undefined

export const imgUrl = (m: Img, size: 'thumb' | 'card' | 'full' = 'card') => {
  if (!m || typeof m === 'number') return ''
  if (size === 'full') return m.url || ''
  return m.sizes?.[size]?.url || m.url || ''
}
export const pic = (doc: { image?: Img; imageUrl?: string | null }, size: 'thumb' | 'card' | 'full' = 'card') => imgUrl(doc.image, size) || doc.imageUrl || ''
export const rel = <T extends { id: number }>(r: T | number | null | undefined): T | undefined => (r && typeof r === 'object' ? r : undefined)
