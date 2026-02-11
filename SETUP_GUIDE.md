# Mobiz Project Status Viewer - Setup Guide

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start local dev server
```bash
npm run dev
```

The component renders at `http://127.0.0.1:8081/` with mock data.

---

## Project Structure

```
src/
├── index.js                              # Entry point
└── x-mobit-pmo-status-component/
    ├── index.js                          # Component registration
    ├── view.js                           # Main view
    ├── actionHandlers.js                 # Event handlers
    ├── helpers/
    │   ├── formatters.js                 # Data formatting
    │   ├── renderHelpers.js              # Render utilities
    │   └── sorting.js                    # Sorting logic
    ├── tabs/
    │   ├── accordion.js                  # Tab container
    │   ├── detailsTab.js                 # Details tab
    │   ├── milestonesTab.js              # Milestones table
    │   ├── issuesTab.js                  # Issues table
    │   ├── risksTab.js                   # Risks table
    │   └── historyTab.js                 # History table
    └── styles.scss                       # Styles
example/
├── element.js                            # Local dev harness
└── mockData.js                           # Mock data for local dev
now-ui.json                               # UI Builder metadata
now-cli.json                              # Dev server config
package.json                              # Dependencies
```

---

## Development Workflow

### Making Changes

Edit files in `src/x-mobit-pmo-status-component/`. Changes auto-reload in the browser.

| File | Purpose |
|------|---------|
| `view.js` | Main table layout and project rows |
| `tabs/*.js` | Individual tab content |
| `helpers/formatters.js` | Date/number formatting |
| `helpers/renderHelpers.js` | Reusable JSX components (progress bars, health badges) |
| `helpers/sorting.js` | Column sorting logic |
| `actionHandlers.js` | Toggle filter handler, data initialization |
| `styles.scss` | All component styling |

### Mock Data

Edit `example/mockData.js` to change the local dev data. The `example/` directory is **only used during local development** — it is never included in the deployed bundle to ServiceNow. No need to comment out mock data before deploying.

---

## Deployment

### Configure your instance
```bash
snc configure
```

### Pre-deployment checklist
- Component receives data via `projectsData` property from UI Builder data broker
- Instance URL is set in `now-cli.json` proxy config

### Deploy
```bash
snc ui-component deploy
```

This generates an update set and uploads the component to your ServiceNow instance.

---

## Configuration Files

### `now-ui.json`
Registers the component in UI Builder:
- **Component tag**: `x-mobit-pmo-status-component`
- **Label**: Mobiz Project Status Viewer
- **Property**: `projectsData` (JSON array from data broker)

### `now-cli.json`
Dev server config:
- Proxy target for `/api` requests
- Dev server overlay settings

### `package.json`
- Component name: `mobiz-project-status-viewer`
- Entry point: `src/index.js`
- Dependencies: `@servicenow/ui-core`, `ui-renderer-snabbdom`, `now-icon`, `now-avatar`, `now-toggle`, `sass-kit`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Server not updating | Hard refresh (Cmd+Shift+R), check terminal for errors |
| Component not rendering | Check browser console for JS errors, verify imports |
| Styling issues | Clear browser cache, check SCSS compilation warnings |
| Build fails | Run `npm install`, verify Node.js >= 22 |

---

## Resources

- [Now Experience UI Framework](https://developer.servicenow.com/dev.do#!/reference/next-experience/latest/ui-framework/getting-started/introduction)
- [ServiceNow CLI](https://developer.servicenow.com/dev.do#!/reference/next-experience/latest/cli/getting-started)
- [Component Examples](https://github.com/ServiceNowDevProgram/now-experience-component-examples)
