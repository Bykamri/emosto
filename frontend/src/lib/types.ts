export interface Paragraph {
  id: number
  urutan: number
  isi: string
}

export interface StorySummary {
  id: number
  judul: string
  created_at: string
  updated_at: string
}

export interface StoryDetail extends StorySummary {
  isi: string
  paragraphs: Paragraph[]
}

export interface StoryInput {
  judul: string
  isi: string
}
