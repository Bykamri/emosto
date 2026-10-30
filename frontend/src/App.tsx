import { useEffect, useRef } from 'react'
import { Sidebar } from './components/Sidebar'
import { StoryEditor } from './components/StoryEditor'
import { StoryReader } from './components/StoryReader'
import { ToastProvider } from './components/ToastProvider'
import { Welcome } from './components/Welcome'
import { href, useRoute } from './lib/route'

export default function App() {
  const route = useRoute()
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)

  const activeId = route.name === 'read' || route.name === 'edit' ? route.id : null
  const onHome = route.name === 'home'
  const routeKey = activeId !== null ? `${route.name}/${activeId}` : route.name

  useEffect(() => {
    if (route.name === 'read') return
    document.title =
      route.name === 'new'
        ? 'Cerita baru - Emosto'
        : route.name === 'edit'
          ? 'Ubah cerita - Emosto'
          : route.name === 'missing'
            ? 'Halaman tidak ditemukan - Emosto'
            : 'Emosto'
  }, [route.name])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [routeKey])

  return (
    <ToastProvider>
      <a
        href="#isi-halaman"
        onClick={(e) => {
          e.preventDefault()
          mainRef.current?.focus()
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-paper focus:px-4 focus:py-2"
      >
        Lewati ke isi halaman
      </a>
      <div className="md:grid md:grid-cols-[22rem_1fr]">
        <aside className={`${onHome ? 'block' : 'hidden'} bg-panel md:sticky md:top-0 md:block md:h-dvh`}>
          <Sidebar activeId={activeId} />
        </aside>

        <main
          id="isi-halaman"
          ref={mainRef}
          tabIndex={-1}
          className={`${onHome ? 'hidden' : 'block'} min-w-0 px-5 pt-4 pb-8 md:block md:px-12 md:pt-10`}
        >
          {!onHome && (
            <a href={href.home()} className="btn btn-quiet -ml-4 mb-2 md:hidden">
              Semua cerita
            </a>
          )}
          {route.name === 'home' && <Welcome />}
          {route.name === 'new' && <StoryEditor mode="new" />}
          {route.name === 'read' && <StoryReader key={route.id} id={route.id} />}
          {route.name === 'edit' && <StoryEditor mode="edit" id={route.id} />}
          {route.name === 'missing' && (
            <div className="max-w-prose">
              <h1 className="font-serif text-2xl font-semibold">Halaman tidak ditemukan</h1>
              <p className="mt-2 text-soft">Alamat ini tidak ada di Emosto.</p>
              <a href={href.home()} className="btn btn-primary mt-4">
                Kembali ke daftar
              </a>
            </div>
          )}
        </main>
      </div>
    </ToastProvider>
  )
}
