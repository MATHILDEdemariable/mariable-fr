
- Per-page head (title, description, canonical, og) is baked into dist/<route>/index.html by scripts/prerenderHeads.ts at build — AI/social crawlers do not run JS. Add new public pages to its PAGES list.
- Pro-wide tools (address book, tutorial, help) live in the /pro space via ProSidebar + ProSupportHost; per-wedding tools stay inside each wedding's dashboard — the pro picks a wedding first.
- Wedding collaboration: invited couples are linked via `wedding_collaborators` + `is_wedding_collaborator()`; editable modules get FOR ALL policies, others SELECT-only, so read-only is enforced by RLS — and shared-module queries filter on `wedding_id` (not `user_id`) when a wedding is selected.
- Per-member Jour J links reuse the public planning URL with `?membre=<team id>`; no extra token — keeps the simple clickable-link sharing.
- Guest page (RSVP) theming lives in `wedding_rsvp_events.customization` with preset palettes/fonts from `src/data/guestPageThemes.ts`; never free-form CSS, to keep mobile layout safe.
- Collaboration direction is encoded in wedding_collaborators.role: 'couple' (pro invites couple, Jour J read-only for the couple) or 'planner' (couple invites pro onto the couple's wedding, full edit via is_wedding_planner_collaborator) — so existing couple data is shared, never overwritten.
