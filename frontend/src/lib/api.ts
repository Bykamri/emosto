import type { StoryDetail, StoryInput, StorySummary } from './types'

const BASE = '/api'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function friendlyMessage(status: number, detail: unknown): string {
  if (status === 404) return 'Cerita ini tidak ditemukan. Mungkin sudah dihapus.'
  if (status === 422) return 'Isian belum sesuai. Periksa judul dan isi cerita.'
  if (status === 502 || status === 503 || status === 504) {
    return 'Tidak bisa terhubung ke server. Periksa apakah backend sedang berjalan.'
  }
  if (status >= 500) return 'Server sedang bermasalah. Coba lagi sebentar lagi.'
  return typeof detail === 'string' ? detail : 'Permintaan gagal. Coba lagi.'
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    })
  } catch {
    throw new ApiError(
      0,
      'Tidak bisa terhubung ke server. Periksa apakah backend sedang berjalan.',
    )
  }
  if (!res.ok) {
    const body: { detail?: unknown } = await res.json().catch(() => ({}))
    throw new ApiError(res.status, friendlyMessage(res.status, body.detail))
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

interface ApiSummary {
  id: number
  title: string
  created_at: string
  updated_at: string
}

interface ApiDetail extends ApiSummary {
  content: string
  paragraphs: { id: number; list_pr: number; content: string }[]
}

const toSummary = (s: ApiSummary): StorySummary => ({
  id: s.id,
  judul: s.title,
  created_at: s.created_at,
  updated_at: s.updated_at,
})

const toDetail = (s: ApiDetail): StoryDetail => ({
  ...toSummary(s),
  isi: s.content,
  paragraphs: s.paragraphs.map((p) => ({ id: p.id, urutan: p.list_pr, isi: p.content })),
})

const toPayload = (data: StoryInput) =>
  JSON.stringify({ title: data.judul, content: data.isi })

export const api = {
  list: (offset: number, limit: number) =>
    request<ApiSummary[]>(`/stories?limit=${limit}&offset=${offset}`).then((r) =>
      r.map(toSummary),
    ),
  get: (id: number) => request<ApiDetail>(`/stories/${id}`).then(toDetail),
  create: (data: StoryInput) =>
    request<ApiDetail>('/stories', { method: 'POST', body: toPayload(data) }).then(toDetail),
  update: (id: number, data: StoryInput) =>
    request<ApiDetail>(`/stories/${id}`, { method: 'PUT', body: toPayload(data) }).then(
      toDetail,
    ),
  remove: (id: number) => request<void>(`/stories/${id}`, { method: 'DELETE' }),
}
