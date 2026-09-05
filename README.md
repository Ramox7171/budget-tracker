# Home Budget

A modular, local-first personal finance app. No server, no account, no
tracking — everything lives in your browser (or, later, on your device via
Tauri) and stays there unless you export it yourself.

Built with **React 18, TypeScript, Tailwind CSS and Vite**.

## Modules

- **Dashboard** — net balance across all accounts, remaining budget from the
  Simulator, recent transactions, spending-by-category breakdown and a
  6-month spending trend.
- **Quick Simulator** — a lightweight, standalone "envelope" budget: set a
  limit, add expenses, see what's left (in red if you're over). Supports
  saving/loading named snapshots, and JSON export/import.
- **Pet Expenses** — per-pet expense tracking with categories (vet, food,
  accessories, grooming, insurance, other) and an emergency fund with a
  savings goal.
- **Vehicles** — per-vehicle history: VIN/engine code/purchase info, services
  (with a nested parts list, mileage and cost), insurance periods, and
  one-off repairs. Includes a clean, print-friendly report (native browser
  print dialog).
- **Accounts** — add bank accounts and import transactions from a CSV bank
  statement. Ships with an mBank parser; adding another bank is a new parser
  file plus one registry entry (`src/modules/accounts/csv`). Duplicate
  transactions from overlapping re-imports are skipped automatically.
- **Settings** — light/dark/system theme, PL/EN language switch, a 4-digit
  PIN lock (SHA-256 hashed, session-based unlock), and one-click backup/
  restore of the entire app's data.

## Getting started

```bash
npm install
npm run dev
```

The app starts at the address printed in the console (`http://localhost:5173`
by default).

## Production build

```bash
npm run build
npm run preview
```

## Tech notes

- **i18n**: `react-i18next`, namespaced translation files in
  `src/i18n/locales/{pl,en}.json`. Switch language instantly in Settings.
- **Dark mode**: class-based (`darkMode: 'class'` in `tailwind.config.js`),
  with a `light / dark / system` context in `src/theme/ThemeContext.tsx`.
- **Fonts**: Inter and JetBrains Mono are bundled locally as `.woff2` files
  in `src/fonts` and loaded via `@font-face` — fully offline, no Google
  Fonts dependency at runtime.
- **Charts**: hand-rolled bar charts (no charting library) to keep the
  bundle small and match the app's own visual style.
- **No icon library**: every icon is a small inline SVG.

## Where your data lives

Everything is stored in the browser's `localStorage`, one key per module
(see the table below). Nothing is sent anywhere. The only real files that
get created are the ones you explicitly export.

| Key                          | Module      | Contents                                  |
| ----------------------------- | ----------- | ------------------------------------------ |
| `budget-tracker-state`        | Simulator   | current budget limit + expense entries     |
| `budget-tracker-saved-budgets`| Simulator   | saved budget snapshots                     |
| `pet-tracker-state`           | Pets        | pets, expenses, emergency funds            |
| `car-tracker-state`           | Vehicles    | vehicles, services, insurance, repairs     |
| `accounts-state`              | Accounts    | accounts + all transactions                |
| `theme`                       | Settings    | `light` / `dark` / `system`                |
| `language`                    | Settings    | active UI language                         |
| `app-pin-hash`                | Settings    | SHA-256 hash of the PIN (not the PIN itself)|

Session-only (cleared when the tab/app closes): `app-unlocked` in
`sessionStorage`, the "PIN entered correctly this session" flag.

Most modules read/write through one small abstraction,
`src/lib/storage.ts` (`readJson` / `writeJson`) — the single place that
will need to change when this moves to file-based storage.

## Data portability

- **Per-module export**: the Simulator can export/import its own budget as
  a standalone JSON file.
- **Full app backup**: Settings → Backup. Downloads every module's data as
  one JSON file, and can restore it later (overwrites current data, with a
  confirmation prompt).
- **Print**: the Vehicles module can print a clean, formatted history for
  any vehicle via the browser's native print dialog.

## Roadmap / planned

- Ship as a native app with **Tauri** (desktop first, mobile later). The
  project is already prepared for this: `vite.config.ts` builds with
  relative paths (`base: './'`), and the storage layer is isolated behind
  `src/lib/storage.ts` so swapping `localStorage` for real files
  (`tauri-plugin-store` / `fs`) is a contained change.
- Connect the Simulator's budget to real Accounts transactions (right now
  they're intentionally independent).
- Support more bank CSV formats beyond mBank.

## Project structure

```
src/
  components/          shared UI (Sidebar, MobileNav, PinPad, LockScreen, ImportButton)
  i18n/                 react-i18next setup + pl/en translation files
  lib/                   storage abstraction, backup/restore, PIN hashing + lock context
  theme/                 light/dark/system theme context
  types/                 shared domain types (finance, pet, car)
  modules/
    dashboard/           overview + charts
    simulator/            envelope budget
    pets/                 pet expense tracking
    cars/                 vehicle history
    accounts/              accounts + CSV import
    settings/              theme, language, PIN, backup
```

## Tauri notes (for later)

- Fonts are bundled locally, so the app works fully offline.
- `base: './'` in `vite.config.ts` is required for assets to load correctly
  from `tauri://` instead of a server root.
- The CSV/JSON import-export flows use standard `<a download>` and
  `<input type="file">`, which work inside Tauri's webview, but could be
  swapped for `@tauri-apps/plugin-dialog` for a more native file-picker feel.