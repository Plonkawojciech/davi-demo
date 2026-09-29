'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Line = { id: number; slug: string; name: string; sku: string; image?: string; size?: string; qty: number }
type Ctx = { lines: Line[]; add: (l: Omit<Line, 'qty'>, qty?: number) => void; remove: (id: number) => void; setQty: (id: number, qty: number) => void; clear: () => void; count: number; ready: boolean }
const CartCtx = createContext<Ctx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([])
  const [ready, setReady] = useState(false)
  useEffect(() => { try { const raw = localStorage.getItem('davi-order'); if (raw) setLines(JSON.parse(raw)) } catch {} setReady(true) }, [])
  useEffect(() => { if (ready) try { localStorage.setItem('davi-order', JSON.stringify(lines)) } catch {} }, [lines, ready])
  const api = useMemo<Ctx>(() => ({
    lines, ready,
    add: (l, qty = 1) => setLines((prev) => { const i = prev.findIndex((p) => p.id === l.id); if (i >= 0) { const c = [...prev]; c[i] = { ...c[i], qty: c[i].qty + qty }; return c } return [...prev, { ...l, qty }] }),
    remove: (id) => setLines((prev) => prev.filter((p) => p.id !== id)),
    setQty: (id, qty) => setLines((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))),
    clear: () => setLines([]),
    count: lines.reduce((s, l) => s + l.qty, 0),
  }), [lines, ready])
  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>
}
export const useCart = () => { const c = useContext(CartCtx); if (!c) throw new Error('CartProvider'); return c }
