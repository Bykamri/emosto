import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { ToastContext } from '../lib/toast'

interface Item {
  id: number
  message: string
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const nextId = useRef(1)

  const show = useCallback((message: string) => {
    const id = nextId.current++
    setItems([{ id, message }]) // satu pesan pada satu waktu
    window.setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 4500)
  }, [])

  const api = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 md:items-start md:pl-6"
      >
        {items.map((item) => (
          <p
            key={item.id}
            className="toast pointer-events-auto rounded-lg bg-ink px-4 py-3 text-paper shadow-lg"
          >
            {item.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
