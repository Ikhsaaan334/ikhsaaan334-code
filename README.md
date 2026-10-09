# Portfolio V2 — Muhammad Ikhsan Nur Rafid

Portfolio futuristik bergaya **clean luxury (putih-perak minimalis)** — dibangun dengan React + Vite + Tailwind CSS v4, seluruh komponen animasi dari [reactbits.dev](https://reactbits.dev).

## Tech Stack

- **Vite 8** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **reactbits** components: Aurora, SplitText, ShinyText, StarBorder, ClickSpark, Magnet, CountUp, AnimatedContent, ScrollFloat, Dock, LogoLoop, Carousel, GradientText
- **gsap** (+ ScrollTrigger & SplitText plugin), **motion**, **ogl**, **lucide-react**, **react-icons**

## Menjalankan Lokal

```bash
npm install
npm run dev      # buka http://localhost:5173
```

## Build Produksi

```bash
npm run build    # output ke dist/
npm run preview  # preview hasil build
```

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Buka [vercel.com/new](https://vercel.com/new) → import repo → Vercel otomatis mendeteksi Vite (build: `npm run build`, output: `dist`).
3. Deploy. Setiap push ke `main` akan otomatis deploy ulang.

Atau via CLI: `npm i -g vercel && vercel`

## Mengubah Konten

Semua teks/data (bio, project, sertifikat, tech stack, link sosial) terpusat di **`src/data.ts`**.
Aset (foto, CV, PDF sertifikat, logo) ada di **`public/assets/`** dan **`public/logos/`**.

## Struktur

```
src/
├── data.ts                    # semua konten situs
├── App.tsx                    # layout + scroll-spy + footer
├── components/
│   ├── DockNav.tsx            # navigasi macOS Dock (desktop)
│   ├── SectionHeading.tsx     # judul section (mono label + ScrollFloat)
│   └── reactbits/             # komponen reactbits (varian TS-Tailwind)
└── sections/                  # Hero, Stats, About, Currently,
                               # Journey, TechStack, Projects,
                               # Certifications, Contact
```
