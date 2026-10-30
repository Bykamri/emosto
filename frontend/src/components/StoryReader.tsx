import { Fragment, useEffect, useState } from 'react'
import { formatDate, formatTime, readingMinutes } from '../lib/format'
import { go, href } from '../lib/route'
import { useDeleteStory, useStory } from '../lib/queries'
import { useToast } from '../lib/toast'
import { ConfirmDialog } from './ConfirmDialog'

export function StoryReader({ id }: { id: number }) {
  const q = useStory(id)
  const del = useDeleteStory()
  const toast = useToast()
  const [confirming, setConfirming] = useState(false)
  const title = q.data?.judul

  useEffect(() => {
    if (title) document.title = `${title} - Emosto`
  }, [title])

  if (q.isPending) return <ReaderSkeleton />

  if (q.isError) {
    return (
      <div role="alert" className="max-w-prose">
        <h1 className="font-serif text-2xl font-semibold">Cerita tidak bisa dibuka</h1>
        <p className="mt-2 text-soft">{q.error.message}</p>
        <div className="mt-4 flex gap-2">
          <button type="button" className="btn btn-primary" onClick={() => q.refetch()}>
            Coba lagi
          </button>
          <a href={href.home()} className="btn btn-quiet">
            Kembali ke daftar
          </a>
        </div>
      </div>
    )
  }

  const story = q.data
  const edited = story.updated_at !== story.created_at

  return (
    <article>
      <header className="max-w-[38rem]">
        <h1 className="font-serif text-[2rem] leading-tight font-semibold text-balance md:text-[2.5rem]">
          {story.judul}
        </h1>
        <p className="mt-3 font-serif text-soft">
          Ditulis {formatDate(story.created_at)}, pukul {formatTime(story.created_at)}
        </p>
        <p className="font-serif text-soft">
          {story.paragraphs.length} paragraf, sekitar {readingMinutes(story.isi)} menit baca
          {edited && <>. Diubah {formatDate(story.updated_at)}</>}
        </p>
        <div className="mt-4 -ml-4 flex gap-1">
          <a href={href.edit(story.id)} className="btn btn-quiet">
            Ubah
          </a>
          <button type="button" className="btn btn-danger-quiet" onClick={() => setConfirming(true)}>
            Hapus
          </button>
        </div>
      </header>

      <div className="mt-8 grid max-w-[38rem] grid-cols-[1rem_1fr] gap-x-5 gap-y-7 md:grid-cols-[1.25rem_1fr] md:gap-x-6">
        {story.paragraphs.map((p, i) => (
          <Fragment key={p.id}>
            <span aria-hidden="true" className="spine-seg" style={{ '--i': i } as React.CSSProperties} />
            <p className="font-serif text-[1.125rem] leading-[1.8] whitespace-pre-line md:text-[1.1875rem]">
              {p.isi}
            </p>
          </Fragment>
        ))}
      </div>

      <ConfirmDialog
        open={confirming}
        title="Hapus cerita ini?"
        confirmLabel="Hapus cerita"
        danger
        busy={del.isPending}
        onCancel={() => setConfirming(false)}
        onConfirm={() =>
          del.mutate(story.id, {
            onSuccess: () => {
              setConfirming(false)
              toast.show('Cerita dihapus.')
              go(href.home())
            },
            onError: (err) => {
              setConfirming(false)
              toast.show(err.message)
            },
          })
        }
      >
        <p>
          &ldquo;{story.judul}&rdquo; dan seluruh paragrafnya akan dihapus. Tindakan ini tidak bisa
          dibatalkan.
        </p>
      </ConfirmDialog>
    </article>
  )
}

function ReaderSkeleton() {
  return (
    <div role="status" className="max-w-[38rem]">
      <div aria-hidden="true" className="space-y-4 motion-safe:animate-pulse">
        <div className="h-9 w-3/4 rounded bg-panel" />
        <div className="h-4 w-1/3 rounded bg-panel" />
        <div className="space-y-3 pt-6">
          <div className="h-4 rounded bg-panel" />
          <div className="h-4 w-11/12 rounded bg-panel" />
          <div className="h-4 w-4/5 rounded bg-panel" />
        </div>
      </div>
      <span className="sr-only">Memuat cerita</span>
    </div>
  )
}
