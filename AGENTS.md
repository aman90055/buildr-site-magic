# Project rules
- Each `usePremium` instance uses a unique Realtime channel and a stable user-ID dependency to prevent shared subscriptions from crashing signed-in pages.
- Office imports/exports use lazy browser libraries in shared modules; PDF password operations and image-page rebuilds use `pdfWorker.run()` to keep processing local and responsive.
- Homepage primary PDF calls to action use the shared public entry point in `src/lib/homeAccess.ts` so marketing cannot accidentally introduce a sign-in gate.
- Homepage access information describes enforced tool behavior, not speculative paid entitlements; the access section replaces a subscription comparison until those benefits are verified.