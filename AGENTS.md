# Repository guidance

## Architecture

- This is a React 19 single-page app built with Vite, TypeScript, and
  React Router.
- `src/index.tsx` mounts the application and composes the global providers.
  `src/router.tsx` owns the browser router, route tree, and page composition.
- `src/pages` contains route-level components. `src/components` contains
  reusable presentational UI. Keep page-specific pieces in the page module
  unless they are reused or clearly generic.
- `src/context` contains shared application state and its hooks. Use reducer
  state for cart and option transitions; use context for state that crosses
  page boundaries.
- `src/hooks` contains reusable React hooks. Keep derived calculations and
  browser integration in hooks or `src/lib`, rather than in JSX markup.
- `src/lib/data` is the static product catalog. `src/lib` also contains
  formatting, navigation, and external API helpers.
- Shared domain declarations live in `src/@types`. Preserve the existing
  global domain types unless a change requires a deliberate migration.

## File and import conventions

- Source modules are flat files named in kebab-case, such as
  `multiple-options-selector.tsx`. Match each primary exported component,
  hook, or helper to its file name.
- Use `@/` for imports from `src` and direct imports from implementation
  modules. Avoid barrel files unless a real public module boundary needs one.
- Keep components, hooks, contexts, data modules, and helpers in their
  existing top-level directories. Create a new directory only when a feature
  has enough related files to justify one.
- Use PascalCase for React components and types, camelCase for values and
  functions, and descriptive discriminated-union event names.
- Prefer `const`, immutable updates, and `readonly` types where practical.
  Keep TypeScript strict: model unknown values explicitly and do not introduce
  `any`.
- Follow the existing Biome configuration for formatting, import ordering,
  naming, and linting. Keep agent-facing Markdown lines at 80 characters or
  fewer.

## React and styling

- Export components as named functions returning `React.JSX.Element`, and use
  arrow functions for callbacks, reducers, and small helpers in keeping with
  the surrounding code.
- Keep components focused on rendering and user interaction. Put reusable
  state transitions in hooks or reducers and reusable pure logic in `src/lib`.
- Use semantic HTML, labels, useful image alt text, explicit button types, and
  accessible names for icon-only controls. Preserve keyboard and touch access
  when changing interactions.
- Styling is Tailwind CSS v4 utility-first. Tailwind is imported by
  `src/global.css`; component styles are normally expressed in `className`.
  Keep global CSS limited to genuine application-wide styles.
- Design mobile-first: make the base classes work on narrow screens, then add
  responsive enhancements. Keep interactive targets usable on touch devices.
- Preserve the visual language and Portuguese customer-facing copy unless the
  task explicitly changes product or UX content.

## Data and application behaviour

- Product definitions are static data and should remain separate from page
  rendering. Use the existing `Product`, `Option`, and `Category` shapes, or
  extend them deliberately when a new product capability needs modeling.
- Keep cart totals derived from product and option data. Update cart state
  through its reducer events so add, remove, and quantity changes retain the
  same invariants.
- Keep route slugs and product slugs generated and consumed consistently with
  the helpers in `src/lib/format.ts`.
- Treat network helpers such as the Brasil API integration as fallible: check
  responses, expose useful errors to the UI, and keep loading/error states
  explicit.

## Verification

- Use the package scripts as the source of truth: `pnpm type-check`,
  `pnpm lint`, `pnpm test`, and `pnpm build`.
- Run the narrowest relevant checks first, then run the full checks for changes
  that affect shared state, routing, configuration, or build output.
- Tests use Vitest with global APIs. New test case titles start with `should`.
  There are currently no test files; add focused tests for non-trivial pure
  logic and state transitions when changing them.
- Do not treat generated `dist` output as source. Keep changes focused and
  inspect `git diff` before handing work back.

## Agent documents

- For local issue files under `.scratch/`, read `docs/agents/issue-tracker.md`.
- For triage states or labels, read `docs/agents/triage-labels.md`.
- For domain terminology or architecture records, read `docs/agents/domain.md`.
