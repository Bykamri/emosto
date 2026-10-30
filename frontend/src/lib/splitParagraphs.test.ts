import { describe, expect, it } from 'vitest'
import { splitParagraphs } from './splitParagraphs'

const P1 = 'Hari ini aku bangun dengan perasaan senang sekali.'
const P2 = 'Siangnya aku bertengkar dengan temanku soal hal sepele.'
const P3 = 'Malamnya kami berbaikan dan aku merasa lega.'

describe('splitParagraphs', () => {
  it('memecah berdasarkan baris kosong', () => {
    expect(splitParagraphs(`${P1}\n\n${P2}\n\n${P3}`)).toEqual([P1, P2, P3])
  })

  it('baris tunggal tetap satu paragraf', () => {
    expect(splitParagraphs(`${P1}\n${P2}`)).toEqual([`${P1}\n${P2}`])
  })

  it('menyamakan akhir baris Windows dan Mac', () => {
    expect(splitParagraphs(`${P1}\r\n\r\n${P2}`)).toEqual([P1, P2])
    expect(splitParagraphs(`${P1}\r\r${P2}`)).toEqual([P1, P2])
  })

  it('mengabaikan baris kosong berlebih atau berisi spasi', () => {
    expect(splitParagraphs(`\n\n  ${P1}  \n \n\n\t\n${P2}\n\n\n`)).toEqual([P1, P2])
  })

  it('teks kosong atau hanya spasi menghasilkan daftar kosong', () => {
    expect(splitParagraphs('')).toEqual([])
    expect(splitParagraphs('  \n\n \t ')).toEqual([])
  })

  it('menggabung paragraf pendek ke sebelumnya', () => {
    expect(splitParagraphs(`${P1}\n\nAku diam saja.\n\n${P2}`)).toEqual([
      `${P1}\nAku diam saja.`,
      P2,
    ])
  })

  it('menggabung paragraf pendek di awal ke berikutnya', () => {
    expect(splitParagraphs(`Halo.\n\n${P1}\n\n${P2}`)).toEqual([`Halo.\n${P1}`, P2])
  })

  it('seluruh teks pendek tetap dikembalikan', () => {
    expect(splitParagraphs('Ya.\n\nTidak.')).toEqual(['Ya.\nTidak.'])
  })

  it('minChars 0 mempertahankan semua paragraf', () => {
    expect(splitParagraphs('Ya.\n\nTidak.', 0)).toEqual(['Ya.', 'Tidak.'])
  })

  it('menghitung karakter, bukan unit UTF-16 (emoji = 1)', () => {
    // 19 karakter termasuk emoji: tetap dianggap pendek (<20) dan digabung.
    const pendek = 'a'.repeat(18) + '😀'
    expect(splitParagraphs(`${P1}\n\n${pendek}`)).toEqual([`${P1}\n${pendek}`])
  })
})
