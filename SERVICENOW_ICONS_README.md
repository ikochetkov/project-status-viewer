# ServiceNow Icons - Summary

Generated files have been created with complete information about all available icons in your project's `@servicenow/now-icon` package.

## 📄 Generated Files

### 1. **SERVICENOW_ICONS_LIST.txt** (49 KB)
   - Complete list of all 2,680 icon variants
   - Format: Each line contains one icon export name (e.g., `circleCheckFill12`)
   - Sorted alphabetically
   - **Use this for**: Searching for specific icon names, copy-paste reference

### 2. **ICONS_COMPLETE_LIST.md** (4.2 KB)
   - List of 335 unique icon base names
   - Each icon is available in 8 variants (2 styles × 4 sizes)
   - Markdown formatted for easy reading
   - **Use this for**: Quick reference of what icons are available

### 3. **SERVICENOW_ICONS_REFERENCE.md** (5.1 KB)
   - Comprehensive guide with usage examples
   - Icon naming conventions explained
   - Icon aliases listed
   - Categorized quick search guide
   - Implementation tips and best practices
   - **Use this for**: Understanding how to use icons, naming patterns, aliases

## 🎨 Quick Facts

| Property | Value |
|----------|-------|
| **Package** | @servicenow/now-icon |
| **Version** | 19.8.2-ecd |
| **Unique Icons** | 335 |
| **Total Variants** | 2,680 |
| **Available Sizes** | 12, 16, 24, 32 pixels |
| **Available Styles** | Fill (solid), Outline (stroke) |

## 🔍 How to Use

### Finding an Icon
1. Open `ICONS_COMPLETE_LIST.md` to see all available base names
2. Example: To use a checkmark icon, look for variants like:
   - `checkmarkFill12` through `checkmarkFill32`
   - `checkmarkOutline12` through `checkmarkOutline32`

### Using in Your Component
```javascript
import { circleCheckFill16 } from '@servicenow/now-icon';

// In your component template:
<now-icon icon="circle-check-fill" size="md"></now-icon>
```

Note: Component attribute uses kebab-case, but exports use camelCase.

### Common Icon Categories

**Navigation & Arrows**
- arrow* (arrowUp, arrowDown, arrowLeft, arrowRight, etc.)
- caret* (caretUp, caretDown, caretLeft, caretRight)

**Status Indicators**
- circle* (circleCheck, circleExclamation, circleInfo, circleQuestion)
- triangle* (triangleExclamation)
- ban, checkmark, xmark

**Business Objects**
- building, calendar, book, phone, email
- user, team, department
- chart*, project

**Actions**
- trash, edit, delete, add
- download, upload, share
- lock, unlock, key

**UI Elements**
- menu, search, filter
- settings, gear, cogwheel
- expand, collapse, maximize

## 📝 Icon Naming Convention

All icons follow this pattern:

```
[base-name][Style][Size]
     ↓        ↓      ↓
  circleCheck + Fill + 16
```

- **Base Name**: Describes the icon (camelCase, e.g., `circleCheck`)
- **Style**: `Fill` or `Outline`
- **Size**: 12, 16, 24, or 32 pixels

### Examples
- `checkmarkFill12` - 12px solid checkmark
- `checkmarkOutline24` - 24px outlined checkmark
- `circleCheckFill16` - 16px solid circle with checkmark
- `arrowDownOutline32` - 32px outlined down arrow

## ⚡ Tips & Tricks

1. **All icons have both styles**: Every icon base name comes in both Fill and Outline variants
2. **All sizes available**: All 335 icons support all 4 sizes (12, 16, 24, 32)
3. **Search efficiently**: Use Ctrl+F (or Cmd+F) to search through the lists
4. **Consistent naming**: Icon names always follow the camelCase pattern with Style and Size
5. **Look for aliases**: Some icons have backwards-compatible aliases (see SERVICENOW_ICONS_REFERENCE.md)

## 📊 Icon Statistics

- **Largest categories**: arrows, circles, charts, user-related icons
- **Smallest categories**: specialized business icons
- **Most common base names**: Start with common prefixes like:
  - `arrow*` (20+ variants)
  - `circle*` (15+ variants)
  - `chart*` (10+ variants)
  - `user*` (10+ variants)

## 🔗 References

- Package: `@servicenow/now-icon` v19.8.2-ecd
- Location in your project: `node_modules/@servicenow/now-icon/`
- Source: `src/now-icon-set.js` (2,680 lines of SVG definitions)

---

**Generated**: 2025-12-12
**Service Now UI Version**: 24.1.1
