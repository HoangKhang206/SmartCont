# SmartCont

> Nền tảng booking và ghép container lạnh cho SME nông sản xuất khẩu, tối ưu theo RSL và ETA dự báo động.

Web app demo cho cuộc thi chuyên ngành Logistics — HCMUS.

---

## Setup lần đầu

### 1. Cài Node.js (nếu chưa có)

Node.js **18+** (khuyên dùng 20 LTS): https://nodejs.org

```bash
node --version  # verify >= 18
npm --version
```

### 2. Install dependencies

```bash
cd smartcont
npm install
```

### 3. Cài shadcn/ui base components

```bash
npx shadcn@latest add button card input label form dialog dropdown-menu select tabs table badge avatar progress separator skeleton tooltip sheet
```

Chọn "Yes" cho mọi câu hỏi. Các component sẽ được tạo trong `components/ui/`.

### 4. Chạy dev server

```bash
npm run dev
```

Mở http://localhost:3000 để xem.

---

## Vibe code với Claude CLI

### Cài Claude CLI

```bash
npm install -g @anthropic-ai/claude-code
```

Chi tiết: https://docs.claude.com/en/docs/claude-code

### Bắt đầu vibe code

```bash
cd smartcont
claude
```

CLI sẽ tự động đọc `CLAUDE.md` để nắm project context.

**Prompt đầu tiên nên dùng:**

```
Đọc CLAUDE.md để nắm project context.
Sau đó đọc docs/component-list.md.
Bắt đầu Phase 1 — build components/shared/Logo.tsx.
```

Xem thêm template prompts trong `docs/prompt-templates.md`.

---

## Cấu trúc dự án

```
smartcont/
├── CLAUDE.md               ← Đọc mỗi session
├── app/                    ← Next.js App Router pages
│   ├── globals.css         ← Design tokens (CSS variables)
│   ├── layout.tsx
│   ├── shipper/            ← Interface chủ vựa
│   └── carrier/            ← Interface bên vận chuyển
├── components/
│   ├── ui/                 ← shadcn/ui (auto)
│   ├── shared/             ← Component dùng chung 2 role
│   ├── shipper/
│   ├── carrier/
│   └── map/                ← Leaflet map components
├── lib/
│   ├── types.ts            ← TypeScript interfaces
│   ├── constants.ts        ← Product DB, route hours, pricing
│   ├── utils.ts            ← Formatters, helpers
│   ├── fake-ai.ts          ← RSL, ETA prediction, consolidation (heuristic)
│   ├── fake-gps.ts         ← GPS simulator (interpolate polyline)
│   └── data-store.ts       ← Đọc JSON + persist localStorage
├── data/                   ← Mock JSON (seed data)
│   ├── users.json
│   ├── routes.json
│   ├── containers.json
│   ├── shipments.json
│   ├── ratings.json
│   └── bookings.json
└── docs/                   ← Đọc trước khi code
    ├── project-spec.md         ← Spec đầy đủ (V1 competition)
    ├── ui-design-guide.md      ← Palette, typography, patterns
    ├── component-list.md       ← Roadmap build theo phase
    ├── demo-scenarios.md       ← 5 kịch bản demo bắt buộc chạy
    ├── anti-detection-rules.md ← Fake không lộ — 12 quy tắc
    ├── data-schema.md          ← Cấu trúc mock JSON
    └── prompt-templates.md     ← Template prompt cho Claude CLI
```

---

## Tech stack

- **Framework:** Next.js 14 App Router + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Map:** Leaflet + OpenStreetMap (free)
- **Icons:** lucide-react
- **Forms:** react-hook-form + zod
- **State:** React state + localStorage (no backend)
- **Deploy:** Vercel

**Không dùng:** Firebase, Supabase, Prisma, backend riêng. Toàn bộ chạy client-side.

---

## Deploy

### Vercel (khuyên dùng, free)

1. Push code lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. Vào https://vercel.com → New Project → Import Git repository

3. Framework Preset: Next.js (auto-detect)

4. Deploy → nhận link `https://smartcont-xxx.vercel.app`

---

## Roadmap (7 ngày)

| Ngày | Việc |
|---|---|
| 1 | Setup + Phase 1 shared components |
| 2 | Landing + Shipper dashboard |
| 3 | Shipper: create shipment + list container |
| 4 | Shipper: consolidation flow (AI ghép cont) |
| 5 | Carrier: dashboard + publish container |
| 6 | Tracking + map + ETA update |
| 7 | Rating + polish + demo prep |

---

## Quick reference commands

```bash
npm run dev          # dev server (hot reload)
npm run build        # production build
npm run start        # chạy production build (test trước deploy)
npm run lint         # check lint errors
```

---

## Support

- Đọc `docs/` trước khi hỏi
- Nếu Claude CLI hiểu sai, prompt: "Đọc lại CLAUDE.md và docs/[relevant].md rồi thử lại"
- Ghi chú lỗi vào `.notes` (git ignored) để track

---

**Chúc thành công!** 🚀
