const fmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
const fmtShort = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtTime = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' })

export const formatDate = (iso: string) => fmt.format(new Date(iso))
export const formatDateShort = (iso: string) => fmtShort.format(new Date(iso))
export const formatTime = (iso: string) => fmtTime.format(new Date(iso))

export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
