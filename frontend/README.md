# Emosto — frontend

Vite + React 19 + TypeScript + Tailwind v4 + TanStack Query. Berbicara dengan backend lewat `/api`
(di dev, Vite meneruskannya ke `http://localhost:8000` dan membuang awalan `/api`, jadi tidak perlu CORS).

```bash
npm install
npm run dev        # http://localhost:5173 (backend harus jalan di :8000)
npm test           # pemecah paragraf (kasus sama dengan tes Python)
npm run lint
npm run build      # tsc + vite build -> dist/
```

Produksi: `Dockerfile` membangun `dist/` lalu menyajikannya dengan nginx (`nginx.conf` juga meneruskan `/api` ke service `api`).
Dari root proyek: `docker compose --profile app up -d --build`, lalu buka http://localhost:8080.

Backend di alamat lain: `VITE_PROXY_TARGET=http://host:port npm run dev`.

## Struktur

```
src/
├── App.tsx               ← kerangka: daftar di kiri, halaman di kanan (HP: satu layar per halaman)
├── components/           ← Sidebar, StoryReader, StoryEditor, ParagraphStrip, ConfirmDialog, ...
└── lib/
    ├── api.ts            ← fetch + pesan error berbahasa Indonesia
    ├── queries.ts        ← hook TanStack Query (daftar bertahap, detail, buat/ubah/hapus)
    ├── route.ts          ← routing hash: #/  #/new  #/stories/:id  #/stories/:id/edit
    ├── splitParagraphs.ts← salinan pemecah paragraf backend, hanya untuk pratinjau di editor
    └── limits.ts         ← batas judul/isi (harus sama dengan backend)
```

## Desain

Acuannya buku tulis sekolah: kertas biru-putih dingin, tinta bolpoin biru (hanya untuk tombol utama dan fokus),
dan **garis margin merah muda**. Di halaman baca, garis margin itu terpotong menjadi satu ruas per paragraf;
tinggi ruas mengikuti panjang paragraf. Nanti ruas inilah yang diwarnai sesuai emosi.
Huruf: Literata untuk cerita, Atkinson Hyperlegible Next untuk antarmuka. Mode gelap otomatis mengikuti sistem.

Catatan: angka di teks kecil memakai Literata karena nol di Atkinson bercoret.
