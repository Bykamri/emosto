import { useStories } from '../lib/queries'
import { formatDateShort } from '../lib/format'
import { href } from '../lib/route'
import { Wordmark } from './Logo'

export function Sidebar({ activeId }: { activeId: number | null }) {
  const q = useStories()
  const stories = q.data?.pages.flat() ?? []

  return (
    <div className="flex min-h-dvh flex-col md:h-dvh">
      <header className="flex flex-col gap-5 px-5 pt-6 pb-4 md:px-6">
        <a href={href.home()} className="self-start" aria-label="Emosto, ke beranda">
          <Wordmark />
        </a>
        <a href={href.new()} className="btn btn-primary self-start">
          Tulis cerita
        </a>
      </header>

      <nav aria-label="Daftar cerita" className="flex-1 overflow-y-auto px-2 pb-8 md:px-3">
        {q.isPending && <ListSkeleton />}

        {q.isError && (
          <div role="alert" className="mx-3 mt-2 text-soft">
            <p>{q.error.message}</p>
            <button type="button" className="btn btn-quiet -ml-4 mt-2" onClick={() => q.refetch()}>
              Coba lagi
            </button>
          </div>
        )}

        {q.isSuccess && stories.length === 0 && (
          <p className="mx-3 mt-2 text-soft">Belum ada cerita. Tulis yang pertama.</p>
        )}

        {stories.length > 0 && (
          <ul>
            {stories.map((s) => {
              const active = s.id === activeId
              return (
                <li key={s.id}>
                  <a
                    href={href.read(s.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative block rounded-lg py-3 pr-3 pl-5 transition-colors hover:bg-paper/60 ${
                      active ? 'bg-paper' : ''
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute top-3 bottom-3 left-2 w-1 rounded-full bg-margin transition-opacity ${
                        active ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <span className="line-clamp-2 font-serif text-[1.0625rem] leading-snug font-medium">
                      {s.judul}
                    </span>
                    <span className="mt-0.5 block font-serif text-sm text-soft">
                      {formatDateShort(s.created_at)}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        )}

        {q.hasNextPage && (
          <button
            type="button"
            className="btn btn-quiet mx-2 mt-2"
            onClick={() => q.fetchNextPage()}
            disabled={q.isFetchingNextPage}
          >
            {q.isFetchingNextPage ? 'Memuat...' : 'Muat lebih banyak'}
          </button>
        )}
      </nav>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div role="status" className="px-3 pt-3">
      <div aria-hidden="true" className="space-y-5 motion-safe:animate-pulse">
        {[72, 56, 64, 48].map((w, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 rounded bg-line" style={{ width: `${w}%` }} />
            <div className="h-3 w-1/4 rounded bg-line" />
          </div>
        ))}
      </div>
      <span className="sr-only">Memuat daftar cerita</span>
    </div>
  )
}
