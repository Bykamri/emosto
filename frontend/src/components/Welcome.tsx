import { useStories } from '../lib/queries'
import { href } from '../lib/route'

export function Welcome() {
  const q = useStories()
  const hasStories = (q.data?.pages[0]?.length ?? 0) > 0

  if (!q.isSuccess) return null

  return (
    <div className="flex max-w-[34rem] items-stretch gap-6 pt-6 md:pt-16">
      <div aria-hidden="true" className="flex flex-col gap-3">
        {[8, 3.5, 6].map((h, i) => (
          <span
            key={i}
            className="spine-seg !w-1.5"
            style={{ height: `${h}rem`, '--i': i } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="self-start pt-2">
        <h1 className="font-serif text-[2rem] leading-tight font-semibold text-balance md:text-[2.5rem]">
          {hasStories ? 'Pilih cerita untuk dibaca' : 'Mulai dari satu cerita'}
        </h1>
        <p className="mt-3 text-[1.0625rem] text-soft">
          {hasStories
            ? 'Buka salah satu cerita di daftar, atau tulis yang baru.'
            : 'Tulis apa yang kamu alami. Setiap paragraf otomatis menjadi satu bagian yang berdiri sendiri.'}
        </p>
        <a href={href.new()} className="btn btn-primary mt-6">
          Tulis cerita
        </a>
      </div>
    </div>
  )
}
