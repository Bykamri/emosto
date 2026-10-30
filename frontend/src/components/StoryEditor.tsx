import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { MAX_ISI, MAX_JUDUL } from '../lib/limits'
import { useCreateStory, useStory, useUpdateStory } from '../lib/queries'
import { go, href } from '../lib/route'
import { splitParagraphs } from '../lib/splitParagraphs'
import { useToast } from '../lib/toast'
import { ConfirmDialog } from './ConfirmDialog'
import { ParagraphStrip } from './ParagraphStrip'

const count = (s: string) => [...s].length // sama dengan len() di Python
const nf = new Intl.NumberFormat('id-ID')

type Props = { mode: 'new' } | { mode: 'edit'; id: number }

export function StoryEditor(props: Props) {
  if (props.mode === 'new') {
    return <EditorForm key="new" mode="new" initial={{ judul: '', isi: '' }} />
  }
  return <EditExisting id={props.id} />
}

function EditExisting({ id }: { id: number }) {
  const q = useStory(id)

  if (q.isPending) {
    return (
      <p role="status" className="text-soft">
        Memuat cerita...
      </p>
    )
  }
  if (q.isError) {
    return (
      <div role="alert" className="max-w-prose">
        <h1 className="font-serif text-2xl font-semibold">Cerita tidak bisa dibuka</h1>
        <p className="mt-2 text-soft">{q.error.message}</p>
        <a href={href.home()} className="btn btn-primary mt-4">
          Kembali ke daftar
        </a>
      </div>
    )
  }
  // key: form dibuat ulang kalau pindah ke cerita lain, tanpa effect penyalin state.
  return (
    <EditorForm
      key={q.data.id}
      mode="edit"
      id={id}
      initial={{ judul: q.data.judul, isi: q.data.isi }}
    />
  )
}

interface FormProps {
  mode: 'new' | 'edit'
  id?: number
  initial: { judul: string; isi: string }
}

function EditorForm({ mode, id, initial }: FormProps) {
  const toast = useToast()
  const create = useCreateStory()
  const update = useUpdateStory(id ?? 0)
  const mutation = mode === 'new' ? create : update

  const [judul, setJudul] = useState(initial.judul)
  const [isi, setIsi] = useState(initial.isi)
  const [submitted, setSubmitted] = useState(false)
  const [discarding, setDiscarding] = useState(false)
  const judulRef = useRef<HTMLTextAreaElement>(null)
  const isiRef = useRef<HTMLTextAreaElement>(null)
  const done = useRef(false)

  const dirty = judul !== initial.judul || isi !== initial.isi
  const paragraphs = useMemo(() => splitParagraphs(isi), [isi])

  // Hitung seperti server: spasi di tepi dibuang dulu.
  const judulLen = count(judul.trim())
  const isiLen = count(isi.trim())

  const judulError =
    judulLen === 0
      ? 'Tulis judul dulu.'
      : judulLen > MAX_JUDUL
        ? `Judul terlalu panjang. Kurangi ${nf.format(judulLen - MAX_JUDUL)} karakter.`
        : null
  const isiError =
    isiLen === 0
      ? 'Tulis isi ceritanya dulu.'
      : isiLen > MAX_ISI
        ? `Cerita terlalu panjang. Kurangi ${nf.format(isiLen - MAX_ISI)} karakter.`
        : null

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => {
      if (!done.current) e.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  function submit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (judulError) return judulRef.current?.focus()
    if (isiError) return isiRef.current?.focus()

    mutation.mutate(
      { judul: judul.trim(), isi: isi.trim() },
      {
        onSuccess: (story) => {
          done.current = true
          toast.show(mode === 'new' ? 'Cerita tersimpan.' : 'Perubahan tersimpan.')
          go(href.read(story.id))
        },
      },
    )
  }

  function cancel() {
    if (dirty) setDiscarding(true)
    else go(id ? href.read(id) : href.home())
  }

  const pending = mutation.isPending
  const showJudulError = submitted && judulError
  const showIsiError = submitted && isiError
  const nearLimit = isiLen > MAX_ISI * 0.9

  return (
    <form onSubmit={submit} noValidate className="flex min-h-[calc(100dvh-8rem)] flex-col">
      <div className="max-w-[38rem] flex-1">
        <h1 className="mb-6 text-lg font-medium text-soft">
          {mode === 'new' ? 'Cerita baru' : 'Ubah cerita'}
        </h1>

        <label htmlFor="judul" className="sr-only">
          Judul
        </label>
        {/* textarea satu baris yang membesar, supaya judul panjang tidak terpotong di layar sempit */}
        <textarea
          id="judul"
          ref={judulRef}
          rows={1}
          value={judul}
          onChange={(e) => setJudul(e.target.value.replace(/\s*\n\s*/g, ' '))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              isiRef.current?.focus()
            }
          }}
          placeholder="Judul cerita"
          aria-invalid={showJudulError ? true : undefined}
          aria-describedby={showJudulError ? 'judul-error' : undefined}
          className="field-sizing-content block w-full resize-none border-b border-line bg-transparent pb-2 font-serif text-[1.75rem] leading-tight font-semibold text-balance placeholder:text-soft/85 focus-visible:border-pen focus-visible:outline-none sm:text-[2rem] md:text-[2.25rem]"
        />
        {showJudulError && (
          <p id="judul-error" className="mt-2 text-danger">
            {judulError}
          </p>
        )}

        <div className="mt-8 grid grid-cols-[1rem_1fr] gap-x-5 md:grid-cols-[1.25rem_1fr] md:gap-x-6">
          <span aria-hidden="true" className="w-1 justify-self-center rounded-full bg-margin" />
          <div>
            {showIsiError && (
              <p id="isi-error" className="mb-2 text-danger">
                {isiError}
              </p>
            )}
            <label htmlFor="isi" className="sr-only">
              Isi cerita
            </label>
            <textarea
              id="isi"
              ref={isiRef}
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              placeholder={'Tulis ceritamu di sini.\n\nBeri satu baris kosong untuk memulai paragraf baru.'}
              aria-invalid={showIsiError ? true : undefined}
              aria-describedby={showIsiError ? 'isi-error' : undefined}
              className="field-sizing-content min-h-[45dvh] w-full resize-none bg-transparent font-serif text-[1.125rem] leading-[1.8] placeholder:text-soft/85 focus-visible:outline-none md:text-[1.1875rem]"
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-5 mt-8 border-t border-line bg-paper px-5 pt-3 pb-4 md:-mx-12 md:px-12">
        {mutation.isError && (
          <p role="alert" className="mb-3 text-danger">
            {mutation.error.message}
          </p>
        )}
        <div className="max-w-[38rem]">
          <ParagraphStrip paragraphs={paragraphs} />
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 font-serif text-sm text-soft">
            <span>
              {paragraphs.length === 0
                ? 'Belum ada paragraf'
                : `${paragraphs.length} paragraf`}
              {mode === 'edit' && isi !== initial.isi && '. Paragraf akan dipecah ulang saat disimpan.'}
            </span>
            <span className={nearLimit ? 'text-danger' : undefined}>
              {nf.format(isiLen)} dari {nf.format(MAX_ISI)} karakter
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? 'Menyimpan...' : mode === 'new' ? 'Simpan cerita' : 'Simpan perubahan'}
            </button>
            <button type="button" className="btn btn-quiet" onClick={cancel} disabled={pending}>
              Batal
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={discarding}
        title="Buang perubahan?"
        confirmLabel="Buang perubahan"
        cancelLabel="Lanjut menulis"
        danger
        onCancel={() => setDiscarding(false)}
        onConfirm={() => {
          done.current = true
          setDiscarding(false)
          go(id ? href.read(id) : href.home())
        }}
      >
        <p>Yang sudah kamu tulis di halaman ini belum disimpan dan akan hilang.</p>
      </ConfirmDialog>
    </form>
  )
}
