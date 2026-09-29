'use client'
import { useState } from 'react'
import { useCart } from './cart'

export function AddToOrder({ product, packQty, available }: { product: { id: number; slug: string; name: string; sku: string; image?: string; size?: string }; packQty?: number | null; available: boolean }) {
  const { add } = useCart()
  const [qty, setQty] = useState(packQty || 1)
  const [done, setDone] = useState(false)
  const step = packQty || 1
  return (
    <div className="buy">
      <div className="buy-row">
        <div className="qty" aria-label="Ilość">
          <button type="button" onClick={() => setQty((q) => Math.max(step, q - step))} aria-label="Mniej">−</button>
          <output>{qty}</output>
          <button type="button" onClick={() => setQty((q) => q + step)} aria-label="Więcej">+</button>
        </div>
        <button type="button" className="btn btn-accent" disabled={!available} onClick={() => { add(product, qty); setDone(true); setTimeout(() => setDone(false), 2200) }}>
          {done ? 'Dodano do zamówienia' : available ? 'Dodaj do zamówienia' : 'Chwilowo niedostępny'}
        </button>
      </div>
      <p className="note">{packQty ? `Opakowanie zbiorcze: ${packQty} szt. Ilość zmienia się co ${packQty}.` : 'Ilość w sztukach.'} Ceny hurtowe i rabaty widoczne po zalogowaniu na konto B2B.</p>
    </div>
  )
}
