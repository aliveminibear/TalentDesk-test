// Vitest setup runs once per test environment. We only want jest-dom
// matchers under the jsdom environment used by frontend tests; loading
// them in pure node would fail because they reference DOM globals.
if (typeof window !== 'undefined') {
  await import('@testing-library/jest-dom/vitest');
}
