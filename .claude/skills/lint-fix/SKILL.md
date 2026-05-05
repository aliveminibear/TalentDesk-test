---
name: lint-fix
description: Run ESLint across the repository and automatically fix issues found, including manual fixes for problems that ESLint cannot autofix. Use when the user asks to lint, fix lint, fix code style, run eslint, fix eslint errors, clean up code, or prepare a change for commit. Also use proactively after substantive edits to JavaScript or JSX files in this repo.
---

# Lint Fix

This repository uses ESLint with the Airbnb style guide (`eslint-config-airbnb` for the React frontend, `eslint-config-airbnb-base` for the Node backend and shared module). This skill runs the linter and resolves every reported issue.

## Quick Start

Run this checklist top to bottom. Stop only when `npm run lint` exits with code 0.

```
Task progress:
- [ ] Step 1: Run autofix
- [ ] Step 2: Read remaining issues
- [ ] Step 3: Resolve each issue with the smallest correct change
- [ ] Step 4: Re-run lint until clean
- [ ] Step 5: Run tests to confirm nothing regressed
- [ ] Step 6: Report what was fixed
```

## Step 1: Run autofix

```bash
npm run lint:fix
```

This handles spacing, ordering, missing extensions, trailing commas, etc. If the command exits with code 0, jump to Step 5.

## Step 2: Read remaining issues

```bash
npm run lint
```

Capture the output. Each entry has the form `path:line:col  error  message  rule-name`.

## Step 3: Resolve each issue

Apply the **smallest correct change** for each rule. Prefer fixing the code over disabling the rule. Only disable a rule (with an inline `// eslint-disable-next-line <rule>` comment that includes a one-line justification) when the rule genuinely does not apply to the situation.

Rule playbook for this repo:

- `import/extensions` — add the explicit `.js` or `.jsx` extension to the relative import. Native Node ESM and the Vite frontend both require it.
- `import/order` — reorder imports: builtin → external → path-aliased (`@shared/...`) → parent → sibling, with a blank line between groups.
- `import/no-extraneous-dependencies` — move the import target from `dependencies` to `devDependencies` (or vice versa) in `package.json` to match its actual usage. Production code imports must resolve to `dependencies`.
- `no-underscore-dangle` on `__dirname`/`__filename` — replace the manual ESM reconstruction with `import.meta.dirname` / `import.meta.filename`.
- `no-restricted-syntax` on `for...of` — rewrite the loop using `Array.prototype.forEach`, `map`, `filter`, or `reduce`.
- `react/jsx-filename-extension` — rename the file from `.js` to `.jsx`.
- `react/prop-types`, `react/react-in-jsx-scope` — already disabled at the project level. If a fresh report appears, re-check `.eslintrc.cjs` rather than editing the component.
- `jsx-a11y/label-has-associated-control` — ensure the `<label>` either wraps the control or carries an `htmlFor` matching the control's `id`.
- `consistent-return` — make every branch of the function explicitly `return` (or none).
- `no-param-reassign` — copy the parameter into a local variable first, mutate the copy.
- `prefer-destructuring`, `prefer-const`, `no-unused-vars`, `no-shadow` — fix mechanically as the message describes.

When unsure about the precise fix for a rule, read the file with the issue, view the surrounding 5–10 lines, and apply the minimal change that satisfies the rule without changing observable behavior.

## Step 4: Re-run lint until clean

```bash
npm run lint
```

If issues remain, return to Step 3. If the count is not strictly decreasing across iterations, stop and report the remaining issues — do not loop indefinitely.

## Step 5: Run tests

```bash
npm test
```

If any test fails, the lint fix changed observable behavior. Revisit the change that caused the failure and choose a different fix (often: prefer disabling the rule with a justified inline comment over rewriting code that has subtle semantics).

## Step 6: Report

Summarize for the user:

- Number of issues auto-fixed.
- Each manual fix as `path:rule — what changed and why`.
- Each rule that was disabled inline, with the justification.
- Test result (pass/fail).

## Constraints

- Never edit `.eslintrc.cjs`, `.eslintignore`, or `package.json` lint configuration to silence errors. Only adjust the project-level config when the rule is genuinely misapplied to the project (e.g. the rule itself has a bug or is irrelevant to the framework). When in doubt, fix the code.
- Never run `git commit`, `git push`, or any other write operation outside the working tree as part of this skill.
- Never delete files that are not generated artifacts. Lint fixes operate on existing source files only.
