---
description: "Use when creating or editing frontend UI in SvelteKit 5 for field-maintenance workflows. Enforce static mock-data architecture, Svelte component-only output, and TailwindCSS 4 industrial SaaS design rules."
applyTo: "apps/frontend/src/**/*.svelte"
---
# Frontend Static Maintenance App Rules

Apply these rules for all Svelte frontend work.

## Tech Stack Constraints

- Use SvelteKit 5 + TypeScript syntax inside `.svelte` files.
- Use TailwindCSS 4 utility classes for all styling.
- Use classic Svelte syntax only.
- Do not use Svelte 5 runes (`$state`, `$derived`, `$effect`, etc.).
- Never introduce rune syntax, even in small local state examples.

## File And Architecture Constraints

- Generate only `.svelte` files for frontend feature delivery.
- Do not add Svelte stores.
- Do not add separate `.ts` helper/service/model files for feature logic.
- Keep example/mock data embedded directly in pages or components.
- No backend integration.
- No API client code.
- No network calls (`fetch`, `axios`, websocket, etc.).
- No real authentication system.
- Keep the app fully static and mock-driven.

## Domain Workflow To Support In UI

Implement or preserve this field-maintenance flow in UI screens:

1. Login
2. Assigned interventions list
3. Intervention selection
4. Equipment QR scan
5. On-site presence validation
6. Report form completion
7. Photo upload
8. PDF upload
9. Intervention validation

## Required UX Direction

- Mobile-first layouts, then tablet and desktop responsive behavior.
- Industrial SaaS visual style.
- Tailwind-only modern cards, subtle shadows, rounded corners.
- Use this palette consistently:
  - Blue: `#2563EB`
  - Green: `#22C55E`
  - Orange: `#F59E0B`
  - Red: `#EF4444`

## Page-Level Requirements

When generating the feature set, include these pages:

- Login page: email, password, and login action.
- Dashboard page: counts for total, completed, in-progress, remaining interventions.
- Interventions list: search input, status filter, intervention cards, realistic mocked data.
- Intervention detail: client, address, equipment type, description, status, planned date, plus QR/report/upload sections.

Status labels may vary by page when needed for domain clarity (for example `A planifier`, `En attente pieces`, `Controle qualite`) while keeping the core progression understandable.

## Reusable Components To Prefer

When requested to scaffold this app domain, create or reuse these components:

- `Header`
- `BottomNav`
- `StatCard`
- `InterventionCard`
- `StatusBadge`
- `SearchBar`
- `QRScannerMock`
- `FileUploader`
- `ReportForm`
- `Modal`

## QR, Report, And Upload Behavior

- QR scanner is a simulated UI component only (fake camera frame + scan simulation button + success state).
- Report form includes: time spent, comments, equipment condition, replaced parts, observations.
- Upload UI includes: drag-and-drop area, file picker, selected files list, simple preview.

## Output Quality Rules

- Produce complete code only, no placeholders and no TODO-style gaps.
- Ensure each generated file is fully written and self-consistent.
- Include all required imports.
- Keep data realistic for maintenance operations.
- Keep UI ready for future backend wiring without adding backend code now.

## Existing Project Context

- Respect repository-level agent guidance in [AGENTS.md](../../AGENTS.md).
- Frontend scripts and tooling source of truth: [apps/frontend/package.json](../../apps/frontend/package.json).
