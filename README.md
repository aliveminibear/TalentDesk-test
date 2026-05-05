# TalentDesk Platform Tech Test

## Setup

```
cp .env.example .env
npm i
npm run start-backend
npm run start-frontend
```

## Assignment

We have provided a basic application, where a form submits and the back-end returns what has been submitted.

Make the following changes:

1. Add styling to the form
2. Add selecting a file to the form, this should be stored in a directory in the back-end and the path to the file returned to the front-end on submission. Selecting the file should support drag and drop
3. Add validation to the form
4. Add linting to the application, following AirBnb's linting rules
5. Add front-end and back-end tests to the application

You may add any relevant 3rd party libraries. Please explain why you have chosen them.

## Bonus

Add an AI agent method (e.g. a Claude Code skill) to run linting and automatically fix any issues found

---

## Notes

### Scripts

- `npm run lint` / `npm run lint:fix` — ESLint with Airbnb rules.
- `npm test` / `npm run test:watch` / `npm run test:coverage` — Vitest.

### Layout

- `backend/` — Express API (`createApp()` factory + entry point), `uploads/` for stored files.
- `frontend/` — Vite + React app.
- `shared/validation.js` — zod schemas used by both sides.
- `.cursor/skills/lint-fix/` and `.claude/skills/lint-fix/` — AI agent skill (bonus).

### Libraries

- **multer** — standard Express middleware for handling multipart uploads.
- **react-dropzone** — accessible drag-and-drop hook (focus, ARIA, drag rejection handled for free).
- **zod** — one schema runs on Node and the browser, so backend and frontend share the same source of truth.
- **eslint v8 + eslint-config-airbnb / airbnb-base** — required by the brief; Airbnb hasn't shipped a flat-config (v9) version yet.
- **eslint-import-resolver-alias** — teaches `eslint-plugin-import` about the `@shared` alias.
- **vitest + @testing-library/react + jsdom + supertest** — one runner for both sides; React Testing Library encourages role/label-based assertions, supertest exercises the real Express stack against `createApp()` with no port binding.

### Bonus skill

Run `npm run lint:fix`, then point the agent at `.cursor/skills/lint-fix/SKILL.md` (Cursor) or `.claude/skills/lint-fix/SKILL.md` (Claude Code). It runs the linter, applies the smallest correct change for each remaining issue using a per-rule playbook, re-runs until clean, then runs the tests to make sure nothing regressed.
