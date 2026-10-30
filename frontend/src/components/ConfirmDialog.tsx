import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  cancelLabel?: string
  busy?: boolean
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Batal',
  busy = false,
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby="dialog-title"
      onCancel={(e) => {
        e.preventDefault() 
        if (!busy) onCancel()
      }}
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-xl border border-line bg-paper p-6 text-ink shadow-2xl"
    >
      <h2 id="dialog-title" className="font-serif text-xl font-semibold">
        {title}
      </h2>
      <div className="mt-2 text-soft">{children}</div>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" className="btn btn-quiet" onClick={onCancel} disabled={busy} autoFocus>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={danger ? 'btn btn-danger' : 'btn btn-primary'}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? 'Menunggu...' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
