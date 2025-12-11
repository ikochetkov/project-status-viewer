# ServiceNow Table Component - Setup Guide

## ✅ Project Successfully Created!

Your ServiceNow table component has been created and is running locally. Here's everything you need to know:

---

## 🚀 Quick Start

### Local Development Server Status
✅ **Running at**: `http://127.0.0.1:8081/`

The development server is **active and watching for changes**. Any edits to your component files will automatically recompile.

### To Start the Server (if not already running)
```bash
cd /Users/ihorkochetkov/Documents/DIR/SRW
snc ui-component develop --open
```

---

## 📋 Project Structure

```
SRW/
├── src/
│   ├── table-component/
│   │   ├── index.js              # Component logic with sample data
│   │   ├── styles.scss           # Professional styling
│   │   └── __tests__/            # Unit test directory (optional)
│   └── index.js                  # Component exports
├── example/
│   └── element.js                # Demo component
├── package.json                  # Dependencies
├── now-cli.json                  # CLI configuration (instance proxy)
├── now-ui.json                   # UI Framework config
├── README.md                     # Full documentation
└── SETUP_GUIDE.md               # This file
```

---

## 📊 Component Features

### Data Structure (Hardcoded Sample)
The component renders a project status table with:
- **4 sample records** (easily replaceable)
- **10 columns**: Number, Project, Status Date, Overall Health, Cost, Scope, Schedule, Resources, Percent Complete, Effort Utilized

### Visual Features
- ✅ Color-coded health indicators (Green, Yellow, Red, Blue)
- ✅ Metric badges for status indicators
- ✅ Animated progress bars with gradient
- ✅ Effort utilization bars
- ✅ Hover effects for better UX
- ✅ Responsive table layout
- ✅ Professional ServiceNow styling

---

## 🔧 Development Workflow

### 1. Making Changes
Edit files in `src/table-component/`:
- `index.js` - Component logic, view, and data
- `styles.scss` - Component styling

**Changes auto-reload in the browser!**

### 2. Updating Sample Data
Edit the `SAMPLE_DATA` array in `src/table-component/index.js`:

```javascript
const SAMPLE_DATA = [
  {
    number: 'PRJSTAT0011122',
    project: 'Project Name',
    statusDate: '2025-12-09',
    overallHealth: 'Green',
    cost: 'Green',
    scope: 'Green',
    schedule: 'Green',
    resources: 'Green',
    percentComplete: '50%',
    effortUtilized: '75%'
  },
  // ... more records
];
```

### 3. Modifying Styling
Edit `src/table-component/styles.scss` to customize colors, spacing, and layout.

---

## 📦 Technologies Used

| Technology | Version | Purpose |
|-----------|---------|---------|
| @servicenow/ui-core | 24.1.1 | Core framework |
| @servicenow/ui-renderer-snabbdom | 24.1.1 | Virtual DOM renderer |
| @servicenow/sass-kit | latest | ServiceNow design system |
| Snabbdom | - | Efficient DOM rendering |

---

## 🔌 Adding Real Data (Next Steps)

To connect to your ServiceNow instance data, you'll need to:

### Step 1: Add HTTP Effects
```javascript
import {createHttpEffect} from '@servicenow/ui-effect-http';

actionHandlers: {
  [actionTypes.COMPONENT_BOOTSTRAPPED]: ({dispatch}) => {
    dispatch(FETCH_PROJECTS_REQUESTED);
  },
  [FETCH_PROJECTS_REQUESTED]: createHttpEffect(
    '/api/now/table/project_status',
    {
      successActionType: FETCH_PROJECTS_SUCCEEDED,
      errorActionType: FETCH_PROJECTS_FAILED
    }
  )
}
```

### Step 2: Handle API Response
```javascript
[FETCH_PROJECTS_SUCCEEDED]: ({action, updateState}) => {
  const {payload: {result = []}} = action;
  updateState({data: result, isLoading: false});
}
```

### Step 3: Add Loading State
```javascript
initialState: {
  data: [],
  isLoading: true,
  error: null
}
```

---

## 🚢 Deploying to ServiceNow

### Prerequisites
1. Configure your ServiceNow instance:
   ```bash
   snc configure
   ```
   
2. Add your instance details:
   - Instance: `mobizitincdemo10.service-now.com`
   - Username: Your ServiceNow username
   - Password: Your ServiceNow password

### Deploy Command
```bash
snc ui-component deploy
```

This will:
1. Generate an update set
2. Upload the component to your instance
3. Register it as a web component
4. Ready to use in Now Experience UI

---

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

Add test files in `src/table-component/__tests__/directory`

---

## 🎨 Customization Guide

### Change Health Indicator Colors
Edit the `getHealthColor()` function in `index.js`:
```javascript
const getHealthColor = (health) => {
  const colors = {
    'Green': '#2e7d32',
    'Yellow': '#f57c00',
    'Red': '#c62828',
    'Blue': '#1565c0'
  };
  return colors[health] || '#999';
};
```

### Modify Table Layout
Update column widths in `styles.scss`:
```scss
&.col-project {
  width: 28%;  // Change this percentage
  white-space: normal;
}
```

### Adjust Colors and Styling
Edit the SCSS variables and classes in `styles.scss` to match your branding.

---

## 📝 Important Files

### `src/table-component/index.js`
- Component definition
- Sample data (SAMPLE_DATA constant)
- View JSX markup
- Color mapping logic

### `src/table-component/styles.scss`
- All styling for the table
- Color schemes
- Responsive design
- Animations and transitions

### `now-cli.json`
- Development server configuration
- Proxy settings for your instance
- Set `development.proxy.origin` to your instance URL

### `package.json`
- Dependencies
- Project metadata
- Build scripts

---

## 🐛 Troubleshooting

### Server Not Updating
1. Check browser console for errors
2. Look at the terminal where `snc develop` is running
3. Try a hard refresh (Cmd+Shift+R on Mac)

### Component Not Rendering
1. Verify `index.js` has no syntax errors
2. Check browser console for JavaScript errors
3. Ensure all imports are correct

### Styling Issues
1. Clear browser cache
2. Check SCSS compilation warnings
3. Verify CSS class names match between JS and SCSS

---

## 📚 Resources

- **Now Experience UI Framework Docs**: https://developer.servicenow.com/dev.do#!/reference/next-experience/latest/ui-framework/getting-started/introduction
- **ServiceNow CLI Guide**: https://developer.servicenow.com/dev.do#!/reference/next-experience/latest/cli/getting-started
- **GitHub Examples**: https://github.com/ServiceNowDevProgram/now-experience-component-examples
- **ServiceNow Developer Program**: https://developer.servicenow.com/

---

## 🎯 Best Practices Applied

✅ Component-based architecture following Now Experience framework  
✅ Separation of concerns (view, styles, data)  
✅ Responsive and accessible design  
✅ Performance optimized with efficient rendering  
✅ Professional UI/UX aligned with ServiceNow design language  
✅ Proper project structure and configuration  
✅ Development server with hot-reload  
✅ Ready for deployment to ServiceNow instance  

---

## 📞 Support

For help with:
- **ServiceNow Component Development**: Check the README.md and examples
- **CLI Issues**: Run `snc ui-component --help`
- **Framework Questions**: Visit ServiceNow developer community

---

## Next Steps

1. ✅ **Review the component** at http://127.0.0.1:8081/
2. **Customize the sample data** to match your needs
3. **Adjust styling** if needed
4. **Connect to real data** using HTTP effects
5. **Deploy to ServiceNow** when ready

Happy coding! 🎉
