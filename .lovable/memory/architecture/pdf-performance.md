---
name: PDF Performance Architecture
description: Web Worker pattern, lazy loading, and progress UI for all PDF/image tools
type: feature
---
## Phase 1 Performance Foundation (Implemented)

**Web Worker:** `src/workers/pdfWorker.ts` runs pdf-lib operations off main thread.
Supported ops: merge, split, extractPages, rotate, removePages, reorder.

**Client wrapper:** `src/lib/pdfWorkerClient.ts` exposes `pdfWorker.run(op, { onProgress, signal })`.
- Singleton, reuses worker across the app.
- AbortSignal support — cancel terminates and respawns worker.
- Falls back to main-thread pdf-lib if Worker unavailable.

**Progress hook:** `src/hooks/useProgress.ts` — `{ progress, eta, start(), update(%), finish(), cancel() }`.
ETA auto-computed from elapsed time vs % complete.

**UI:** `src/components/SmartProgress.tsx` — reusable progress bar with %, ETA, cancel button.

**Lazy loaders:** `src/lib/lazyLoaders.ts` — `loadPDFLib()`, `loadPDFJS()` for code-splitting heavy libs.

## Migration Pattern for Other Hooks

Replace direct `PDFDocument` calls with `pdfWorker.run({ op, payload }, { onProgress, signal })`.
Migrated: usePDFMerge, usePDFSplit. To migrate: rotate, removePages, organize, extractPages hooks.
