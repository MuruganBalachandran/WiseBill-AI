# WiseBill AI — Client Frontend (Next.js)

The frontend application for WiseBill AI is built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, and **Redux Toolkit** with `redux-persist`.

---

## 🏗️ Folder Structure

```text
client/
├── public/
│   └── widget.js            # Embeddable script for bloggers & external sites
├── src/
│   ├── app/
│   │   ├── api/og/route.tsx # Dynamic Open Graph (1200x630) image generator
│   │   ├── audit/[slug]/    # Shareable audit results page & layout metadata
│   │   ├── widget/          # Standalone widget page for iframe embeds
│   │   ├── layout.tsx       # Root layout enforcing font-sans typography
│   │   └── page.tsx         # Audit creation homepage & SpendInputForm container
│   ├── components/
│   │   ├── audit/           # ToolPicker, SubscriptionCard & subcomponents
│   │   └── SpendInputForm.tsx # Primary form with Redux persistence & referral banner
│   ├── services/
│   │   ├── api.ts           # Centralized Axios client with interceptors
│   │   └── audit.ts         # Audit & Lead API service wrappers
│   ├── store/
│   │   ├── index.ts         # Redux store with SSR-safe noop storage & autoMergeLevel2
│   │   └── slices/          # Redux audit slice
│   └── types/               # TypeScript interfaces for audit, pricing, and leads
```

---

## 🎨 Design & Styling Rules

- **Typography:** Uses `--font-sans` (`Inter` / system sans-serif) applied globally across all pages and components.
- **Color Palette:** Tailored HSL Hues (`brand-purple-600`, sleek dark mode, glassmorphism card styling).
- **Single-Line Comments:** All JSX and TypeScript files strictly follow single-line comment conventions (`// ...`) and `// region` / `// endregion` blocks.

---

## ⚡ Development Commands

```bash
# Install dependencies
npm install

# Start local Next.js dev server (http://localhost:3000)
npm run dev

# Run TypeScript type check
npx tsc --noEmit
```

---

## 🔗 Key Endpoints & Features

- **`/`**: Main Audit input flow with referral banner (`?ref=...`).
- **`/audit/[slug]`**: Unique public audit report with dynamic Twitter Card & Open Graph `<meta>` tags.
- **`/widget`**: Lightweight iframe audit view.
- **`/api/og`**: Edge runtime dynamic social preview card image generator.
