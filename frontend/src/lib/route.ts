import { useSyncExternalStore } from 'react'

export type Route =
  | { name: 'home' }
  | { name: 'new' }
  | { name: 'read'; id: number }
  | { name: 'edit'; id: number }
  | { name: 'missing' }

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/\/+$/, '') || '/'
  if (path === '/') return { name: 'home' }
  if (path === '/new') return { name: 'new' }
  const m = /^\/stories\/(\d+)(\/edit)?$/.exec(path)
  if (m) {
    const id = Number(m[1])
    return m[2] ? { name: 'edit', id } : { name: 'read', id }
  }
  return { name: 'missing' }
}

export const href = {
  home: () => '#/',
  new: () => '#/new',
  read: (id: number) => `#/stories/${id}`,
  edit: (id: number) => `#/stories/${id}/edit`,
}

export function go(to: string) {
  window.location.hash = to
}

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

const snapshot = () => window.location.hash

export function useRoute(): Route {
  // String yang stabil -> tidak render ulang tanpa perubahan; parse di luar store.
  return parseHash(useSyncExternalStore(subscribe, snapshot))
}
