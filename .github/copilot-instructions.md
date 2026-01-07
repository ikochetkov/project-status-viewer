# Copilot instructions (SRW / table-component)

## Big picture
- This repo is a **ServiceNow Now Experience UI Framework** component.
- The shipped web component is `x-mobit-table-component` defined in [src/table-component/index.js](../src/table-component/index.js) and exported via [src/index.js](../src/index.js).
- UI Builder metadata (label, icon, scope, exposed props) lives in [now-ui.json](../now-ui.json) (scope: `x_mobit_spm_sv`).

## Data flow / state conventions
- Data is passed into the component via the **UI Builder property** `projectsData`.
- The component copies `projectsData` into internal state `state.data` on:
  - `actionTypes.COMPONENT_BOOTSTRAPPED`
  - `actionTypes.COMPONENT_PROPERTY_CHANGED` (listens for `name === 'projectsData'`)
- `projectsData` is accepted as either:
  - an array, or
  - an object shaped like `{ data: [...] }`.
- UI interactions are tracked in `state.expandedRows`; toggles dispatch `NOW_TOGGLE#CHECKED_SET` and the handler expects a `filterKey` (often via `filter-key` attribute).

## Styling conventions
- Styles are authored in SCSS and compiled by the ServiceNow build tooling: [src/table-component/styles.scss](../src/table-component/styles.scss).
- Prefer reusing existing CSS custom properties already defined in `:host` rather than introducing new one-off colors/tokens.

## Developer workflows (local)
- Install deps: `npm install`
- Dev server: `npm run dev` (alias: `snc ui-component develop`)
- Build: `npm run build` (runs `snc ui-component build`)
- Instance proxy for local dev is configured in [now-cli.json](../now-cli.json) (proxies `/api`).

## Repo gotchas
- [example/element.js](../example/element.js) is a local demo harness; it may drift from the build output (don’t assume `example/` is validated by CI).
- There is a test stub at [src/table-component/__tests__/index.js](../src/table-component/__tests__/index.js), but `package.json` currently has **no** `test` script.
- [pom.xml](../pom.xml) exists for Maven-based pipelines and pins an older Node version; local dev should follow `package.json` (`node >= 22`).
