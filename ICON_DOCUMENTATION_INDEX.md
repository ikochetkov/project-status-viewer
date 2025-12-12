# ServiceNow Icon Library Documentation

## 📚 Quick Navigation

This directory contains complete documentation for all icons available in the `@servicenow/now-icon` package used in your ServiceNow table component project.

### Start Here
👉 **[SERVICENOW_ICONS_README.md](SERVICENOW_ICONS_README.md)** - Overview, statistics, and quick start guide

---

## 📋 Available Documentation Files

| File | Purpose | Best For |
|------|---------|----------|
| **SERVICENOW_ICONS_README.md** | Overview and usage guide | Getting started |
| **ICONS_COMPLETE_LIST.md** | List of 335 unique icon base names | Quick reference |
| **SERVICENOW_ICONS_REFERENCE.md** | Comprehensive guide with examples | In-depth learning |
| **SERVICENOW_ICONS_LIST.txt** | Complete list of 2,680 variants | Searching/copy-paste |
| **icons.json** | Structured JSON format | Programmatic access |

---

## 🎨 Icon Facts

```
Total Unique Icons: 335
Total Variants: 2,680

Each icon is available in:
├─ Sizes: 12px, 16px, 24px, 32px (4 options)
└─ Styles: Fill, Outline (2 options)
   └─ Total per icon: 4 sizes × 2 styles = 8 variants
```

---

## 🔍 Finding Icons

### By Category

**Navigation & Arrows** (20+ icons)
- `arrowUp`, `arrowDown`, `arrowLeft`, `arrowRight`
- `caretUp`, `caretDown`, `caretLeft`, `caretRight`
- `arrowClockwise`, `arrowCounterclockwise`

**Status & State** (15+ icons)
- `circleCheck`, `circleExclamation`, `circleInfo`, `circleQuestion`
- `triangleExclamation`, `ban`, `check`, `xmark`

**User & Organization** (10+ icons)
- `user`, `userGroup`, `userAdd`, `userRemove`
- `team`, `building`, `department`

**Data & Analytics** (15+ icons)
- `chartArea`, `chartBarColumn`, `chartBarGroup`
- `analytics*`, `report*`, `dashboard*`

**Files & Storage** (10+ icons)
- `file`, `folder`, `document`, `disk`
- `download`, `upload`, `save`

**Actions & Controls** (20+ icons)
- `trash`, `delete`, `edit`, `pencil`
- `add`, `remove`, `settings`, `gear`
- `refresh`, `reload`, `sync`

**Communication** (15+ icons)
- `email`, `chat`, `message`, `comment`
- `phone`, `notification`, `bell`

---

## 💻 Code Examples

### Basic Usage

```javascript
// Import
import { circleCheckFill16 } from '@servicenow/now-icon';

// Use in component
<now-icon icon="circle-check-fill" size="md"></now-icon>
```

### All Size Options

```javascript
// Icon name format: [baseName][Style][Size]
// Sizes: 12, 16, 24, 32
// Styles: Fill, Outline

// Examples
circleCheckFill12      // 12px solid circle check
circleCheckFill16      // 16px solid circle check
circleCheckFill24      // 24px solid circle check
circleCheckFill32      // 32px solid circle check
circleCheckOutline12   // 12px outlined circle check
circleCheckOutline16   // 16px outlined circle check
// ... etc
```

### Component Size Mapping

| Component Size | Pixel Size |
|---|---|
| `sm` (small) | 12px |
| `md` (medium) | 16px |
| `lg` (large) | 24px |
| `xl` (extra large) | 32px |

---

## 📖 Icon Naming Pattern

All icon names follow a consistent pattern:

```
[baseIconName][Style][Size]
        ↓          ↓      ↓
    circleCheck + Fill + 16
```

### Pattern Details

1. **Base Icon Name** (camelCase)
   - Examples: `circle`, `arrow`, `check`, `user`, `trash`
   - Can include sub-categories: `circleCheck`, `arrowUp`, `userGroup`

2. **Style**
   - `Fill` = Solid/filled version
   - `Outline` = Stroke/outline version
   - Note: Some icons may only have one style available

3. **Size**
   - `12` = 12 pixels (small)
   - `16` = 16 pixels (default)
   - `24` = 24 pixels (large)
   - `32` = 32 pixels (extra large)

### Examples

| Icon | Meaning |
|------|---------|
| `checkmarkFill16` | 16px solid checkmark |
| `arrowDownOutline24` | 24px outlined down arrow |
| `circleQuestionFill12` | 12px solid circle with question mark |
| `settingsOutline32` | 32px outlined settings/gear icon |

---

## 🎯 Common Icons by Use Case

### Form Controls
- `checkboxChecked`, `checkboxUnchecked`
- `radioButtonChecked`, `radioButtonUnchecked`
- `toggle*`

### Status Indicators
- `circleCheck` - Success
- `circleExclamation` - Warning/Alert
- `circleInfo` - Information
- `ban` - Blocked/Disabled

### Navigation
- `chevronRight` - Next/Forward
- `chevronLeft` - Previous/Back
- `arrowUp` - Expand/Collapse
- `arrowDown` - Expand/Collapse
- `hamburger` - Menu toggle

### CRUD Operations
- `add`, `plus` - Create/Add
- `edit`, `pencil` - Update/Edit
- `trash`, `delete` - Delete/Remove
- `copy`, `duplicate` - Duplicate
- `download` - Export/Download

---

## 📝 Pro Tips

1. **Icons are responsive**: Choose the size based on your UI context
   - Small buttons: use 12 or 16
   - Large buttons or headers: use 24 or 32

2. **Outline vs Fill**: 
   - Use `Fill` for: Primary actions, important states
   - Use `Outline` for: Secondary actions, neutral states

3. **Component case conversion**:
   - JavaScript import: `circleCheckFill16` (camelCase)
   - Component attribute: `circle-check-fill` (kebab-case)

4. **All icons available**: Every icon has all 8 variants (2 styles × 4 sizes)

5. **Aliases available**: See SERVICENOW_ICONS_REFERENCE.md for backward-compatible aliases

---

## 🔗 References

- **Package**: `@servicenow/now-icon`
- **Version**: 19.8.2-ecd
- **Location**: `node_modules/@servicenow/now-icon/`
- **ServiceNow UI Version**: 24.1.1

---

## ❓ Quick Questions

**Q: How many icons are available?**
A: 335 unique icons, 2,680 total variants (including all sizes and styles)

**Q: Can I use custom icons?**
A: This documentation covers only the ServiceNow icons. Custom icons would need to be hosted separately.

**Q: Which size should I use?**
A: It depends on your context:
- 12 = Small buttons, badges, compact UI
- 16 = Default, most common use case
- 24 = Large buttons, prominent UI elements
- 32 = Headers, key visual elements

**Q: Can I change icon color?**
A: Yes, using CSS. The icons inherit the `currentColor` property by default.

**Q: Are all icons in both Fill and Outline?**
A: Yes, all 335 icons have both variants available.

---

## 📞 Support

For issues with ServiceNow icons or components, refer to:
1. Official ServiceNow UI documentation
2. Package README: `node_modules/@servicenow/now-icon/README.md`
3. Component source: `node_modules/@servicenow/now-icon/src/now-icon.js`

---

**Documentation Generated**: December 12, 2025
**Package Version**: @servicenow/now-icon 19.8.2-ecd

