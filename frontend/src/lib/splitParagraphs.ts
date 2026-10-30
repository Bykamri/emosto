export const MIN_CHARS = 20

const length = (text: string) => [...text].length 

export function splitParagraphs(text: string, minChars = MIN_CHARS): string[] {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const parts = normalized
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const merged: string[] = []
  let pending = ''
  for (let part of parts) {
    if (pending) {
      part = `${pending}\n${part}`
      pending = ''
    }
    if (length(part) < minChars) {
      if (merged.length > 0) {
        merged[merged.length - 1] = `${merged[merged.length - 1]}\n${part}`
      } else {
        pending = part
      }
    } else {
      merged.push(part)
    }
  }
  if (pending) merged.push(pending)
  return merged
}
