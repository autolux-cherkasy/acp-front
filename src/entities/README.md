# Entities Layer

Domain-focused business entities (FSD `entities` layer). Each slice exposes API calls and base domain UI for one entity — see [`../../docs/architecture/fsd.md`](../../docs/architecture/fsd.md) for the layer rules (may only import from `shared`).

Current slices:

- `cafe` — cafe menu domain (categories, items).
- `dashboard` — admin dashboard stats/aggregates.
- `ticket` — ticket domain model and status UI (`TicketStatusBadge`).
- `trip` — trip search/listing API and models.
- `user` — user profile API.
