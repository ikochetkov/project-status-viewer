# table-component

A professional ServiceNow UI Framework component that renders a project status table with health metrics, progress bars, and status indicators.

## Features

- **Hardcoded Sample Data**: Project management table with 4 sample records
- **Health Indicators**: Color-coded health status (Green, Yellow, Red, Blue)
- **Metric Badges**: Visual indicators for Cost, Scope, Schedule, and Resources
- **Progress Bars**: Percent completion visualization with gradient styling
- **Effort Utilization Chart**: Blue gradient bar showing effort utilization percentage
- **Responsive Design**: Professional table layout with hover effects
- **ServiceNow Best Practices**: Built using Now Experience UI Framework with proper component structure

## Data Structure

The component displays the following columns:
- **Number**: Project ID/Number (clickable link)
- **Project**: Project name
- **Status date**: Date of last status update
- **Overall health**: Health indicator (Green/Yellow/Red)
- **Cost**: Cost status indicator
- **Scope**: Scope status indicator
- **Schedule**: Schedule status indicator
- **Resources**: Resources status indicator
- **Percent complete**: Progress bar with percentage
- **Effort Utilized**: Effort bar with percentage

## Project Structure

```
table-component/
├── src/
│   ├── table-component/
│   │   ├── index.js          # Main component logic with sample data
│   │   ├── styles.scss       # Professional styling
│   │   └── __tests__/        # Unit tests directory
│   └── index.js              # Component exports
├── example/
│   └── element.js            # Development example
├── package.json              # Dependencies
├── now-cli.json              # CLI configuration
└── now-ui.json               # UI configuration
```

## Development

### Prerequisites
- Node.js >= 22
- ServiceNow CLI installed globally (`npm install -g @servicenow/cli`)
- ServiceNow instance (for deployment)

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   snc ui-component develop --open
   ```
   
   The component will be available at `http://127.0.0.1:8081/`

3. **Live Reload**: Changes to component files will automatically recompile and hot-reload in the browser

### Building

To build the component for deployment:
```bash
snc ui-component generate-update-set
```

## Deployment to ServiceNow

1. **Configure your instance**:
   ```bash
   snc configure
   ```
   
   Add your instance URL: `https://mobizitincdemo10.service-now.com`

2. **Deploy the component**:
   ```bash
   snc ui-component deploy
   ```

## Component Details

### Technologies Used
- **@servicenow/ui-core**: Core framework for building Now Experience components
- **@servicenow/ui-renderer-snabbdom**: Virtual DOM renderer
- **@servicenow/sass-kit**: ServiceNow's design system and utilities

### Styling Approach
- Uses `@servicenow/sass-kit` for consistent styling with ServiceNow design language
- Responsive table with sticky headers
- Professional color scheme matching ServiceNow UI standards
- Smooth transitions and hover effects

### Component Features
- **Hardcoded Data**: Currently uses sample project data (easily replaceable with API calls)
- **Health Color Mapping**: Dynamic color assignment based on health status
- **Progress Visualization**: Custom styled progress bars with gradient backgrounds
- **Row Hover Effects**: Subtle background color change on row hover
- **Professional Typography**: Clean, readable font stack for enterprise applications

## Next Steps

To connect to real data from your ServiceNow instance:

1. **Add HTTP Effects** for fetching data from your instance
2. **Implement Action Handlers** to manage component state
3. **Pass properties** to customize table behavior
4. **Add filtering/sorting** capabilities

Example implementation with HTTP calls:
```javascript
import {createHttpEffect} from '@servicenow/ui-effect-http';

actionHandlers: {
  [actionTypes.COMPONENT_BOOTSTRAPPED]: ({dispatch}) => {
    dispatch(FETCH_DATA_REQUESTED);
  },
  [FETCH_DATA_REQUESTED]: createHttpEffect('/api/now/table/project_status', {
    successActionType: FETCH_DATA_SUCCEEDED,
    errorActionType: FETCH_DATA_FAILED
  })
}
```

## Best Practices Applied

✅ Component-based architecture  
✅ Separation of concerns (view, styles, logic)  
✅ Responsive design  
✅ Accessibility considerations  
✅ Performance optimized (sticky headers, efficient rendering)  
✅ Professional UI/UX design  
✅ ServiceNow Now Experience Framework standards  
✅ Proper package structure and configuration  

## Testing

Unit tests can be added in `src/table-component/__tests__/` directory:
```bash
npm test
```

## License

ServiceNow Developer Program
