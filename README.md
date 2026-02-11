# Mobiz Project Status Viewer

A ServiceNow UI Builder component that displays project status data with health metrics, effort tracking, expandable detail rows, and tabbed sub-views.

---

## Technology Stack

**ServiceNow Now Experience UI component using Snabbdom — NOT React.**

- `@servicenow/ui-core` + `@servicenow/ui-renderer-snabbdom`
- Built with NOW CLI (`snc ui-component develop` / `deploy`)
- JSX compiled by ServiceNow build tooling (Snabbdom, not React)
- Uses `innerHTML` property for HTML content (not `dangerouslySetInnerHTML`)

Do NOT use React conventions (hooks, functional components, React imports).

---

## Features

- Expandable project rows with 5 tabbed detail views (Details, Milestones, Issues, Risks, Status History)
- Color-coded health indicators (Green, Yellow, Red, Blue) with tooltip comments
- Effort tracking KPIs (Planned, Actual, Remaining, Estimated at Completion)
- Progress bars and circular progress indicators
- Sortable columns in all tab tables
- "Only active" toggle filter for Milestones, Issues, and Risks
- Create Status Report modal for projects without a report
- Data provided via `projectsData` property from UI Builder data broker

---

## Project Structure

```
src/
├── index.js                              # Component entry (re-exports)
└── x-mobit-pmo-status-component/
    ├── index.js                          # Component registration
    ├── view.js                           # Main view function
    ├── actionHandlers.js                 # Action handlers
    ├── helpers/
    │   ├── formatters.js                 # Data formatting utilities
    │   ├── renderHelpers.js              # JSX render utilities
    │   └── sorting.js                    # Sorting logic
    ├── tabs/
    │   ├── accordion.js                  # Tab container + sort/filter
    │   ├── detailsTab.js                 # Details tab
    │   ├── milestonesTab.js              # Milestones table
    │   ├── issuesTab.js                  # Issues table
    │   ├── risksTab.js                   # Risks table
    │   └── historyTab.js                 # Status history table
    └── styles.scss                       # Component styles
example/
├── element.js                            # Local dev harness
└── mockData.js                           # Mock data for local dev
now-ui.json                               # UI Builder metadata
now-cli.json                              # Dev server / proxy config
package.json                              # Dependencies
```

---

## Development

### Prerequisites
- Node.js >= 22
- ServiceNow CLI (`npm install -g @servicenow/cli`)

### Local Development

```bash
npm install
npm run dev
```

The component renders at `http://127.0.0.1:8081/` with mock data from `example/mockData.js`.

The `example/` directory is **only used locally** — it is NOT included in the deployed bundle. No need to comment out mock data before deploying.

### Deployment

```bash
snc ui-component deploy
```

On the ServiceNow instance, `projectsData` is provided via the UI Builder data broker — the component receives an array of project objects through its property.

---

## Component Property

| Property | Type | Description |
|----------|------|-------------|
| `projectsData` | `array` | Array of project data objects from data broker |

Configure this in UI Builder by binding the property to a data broker that returns project status records.

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `@servicenow/ui-core` | Core UI framework |
| `@servicenow/ui-renderer-snabbdom` | Snabbdom virtual DOM renderer |
| `@servicenow/now-icon` | Icon component |
| `@servicenow/now-avatar` | Avatar component |
| `@servicenow/now-toggle` | Toggle component |
| `@servicenow/sass-kit` | ServiceNow design system |

---

## Resources

- [Now Experience UI Framework](https://developer.servicenow.com/dev.do#!/reference/next-experience/latest/ui-framework/getting-started/introduction)
- [ServiceNow CLI](https://developer.servicenow.com/dev.do#!/reference/next-experience/latest/cli/getting-started)
- [Component Examples](https://github.com/ServiceNowDevProgram/now-experience-component-examples)
