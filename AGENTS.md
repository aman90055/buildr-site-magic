# Project rules
- Each `usePremium` instance uses a unique Realtime channel and a stable user-ID dependency to prevent shared subscriptions from crashing signed-in pages.
- Office imports/exports use lazy browser libraries in shared modules; PDF password operations and image-page rebuilds use `pdfWorker.run()` to keep processing local and responsive.
- Homepage primary PDF calls to action use the shared public entry point in `src/lib/homeAccess.ts` so marketing cannot accidentally introduce a sign-in gate.
- Homepage tool cards derive from `getAllTools()` with one card per route; why: duplicate aliases and separate catalogues advertised unsupported capabilities.
- Homepage access information describes enforced tool behavior, not speculative paid entitlements; the access section replaces a subscription comparison until those benefits are verified.
- Support chat streams from the `support-chat` Edge Function, which loads thread history from the database and only accepts the newest user message from the browser; why: clients can't forge prior turns or other users' account data.
- Tool guides derive from reviewed SEO facts, operation-specific instructions and verified conversion overrides, not generated long-form filler; why: guides must describe actual inputs, limitations and signed-in storage consistently.
- The header's sign-in and call-to-action buttons must stay inside the viewport at every width: the desktop nav only renders at 1440px and above and carries just the six primary links, while the always-available compact menu holds the Convert groups and auth links; why: the 1400px page container cannot fit the full nav plus search, theme and both buttons.
