# ServiceNow Icon Library Reference

## Overview
Complete reference for all icons available in the `@servicenow/now-icon` package (version 19.8.2-ecd).

**Total unique icons: 335**
**Total variants (including sizes and styles): 2,680**

## Icon Variants
Each base icon name comes in 8 variants:
- **Sizes**: 12, 16, 24, 32 pixels
- **Styles**: Fill, Outline

### Usage Example
```javascript
// Using now-icon component with ServiceNow
<now-icon icon="circle-check-fill" size="md"></now-icon>
<now-icon icon="circle-check-outline" size="lg"></now-icon>
```

**Note**: In component usage, icon names are in kebab-case (e.g., `circle-check-fill`), but in the export list, they are in camelCase (e.g., `circleCheckFill12`).

## Complete Icon List

### A
- addItemAbove (Fill/Outline - 12, 16, 24, 32)
- addItemBelow (Fill/Outline - 12, 16, 24, 32)
- addItemLeft (Fill/Outline - 12, 16, 24, 32)
- addItemRight (Fill/Outline - 12, 16, 24, 32)
- addressBook (Fill/Outline - 12, 16, 24, 32)
- addressCard (Fill/Outline - 12, 16, 24, 32)
- analyticsCenter (Fill/Outline - 12, 16, 24, 32)
- arrowClockwise (Fill/Outline - 12, 16, 24, 32)
- arrowCounterclockwise (Fill/Outline - 12, 16, 24, 32)
- arrowDown (Fill/Outline - 12, 16, 24, 32)
- arrowDownLeft (Fill/Outline - 12, 16, 24, 32)
- arrowDownRight (Fill/Outline - 12, 16, 24, 32)
- arrowLeft (Fill/Outline - 12, 16, 24, 32)
- arrowLeftMost (Fill/Outline - 12, 16, 24, 32)
- arrowReorder (Fill/Outline - 12, 16, 24, 32)
- arrowRight (Fill/Outline - 12, 16, 24, 32)
- arrowRightMost (Fill/Outline - 12, 16, 24, 32)
- arrowUp (Fill/Outline - 12, 16, 24, 32)
- arrowUpDown (Fill/Outline - 12, 16, 24, 32)
- arrowUpLeft (Fill/Outline - 12, 16, 24, 32)
- arrowUpRight (Fill/Outline - 12, 16, 24, 32)
- asterisk (Fill/Outline - 12, 16, 24, 32)

### B
- ban (Fill/Outline - 12, 16, 24, 32)
- bell (Fill/Outline - 12, 16, 24, 32)
- bellSlash (Fill/Outline - 12, 16, 24, 32)
- bind (Fill/Outline - 12, 16, 24, 32)
- boardFlexible (Fill/Outline - 12, 16, 24, 32)
- boardGuided (Fill/Outline - 12, 16, 24, 32)
- book (Fill/Outline - 12, 16, 24, 32)
- bookmark (Fill/Outline - 12, 16, 24, 32)
- broadcastTower (Fill/Outline - 12, 16, 24, 32)
- bug (Fill/Outline - 12, 16, 24, 32)
- building (Fill/Outline - 12, 16, 24, 32)
- bundle (Fill/Outline - 12, 16, 24, 32)

### C
- calendar (Fill/Outline - 12, 16, 24, 32)
- calendarClock (Fill/Outline - 12, 16, 24, 32)
- camera (Fill/Outline - 12, 16, 24, 32)
- caretDown (Fill/Outline - 12, 16, 24, 32)
- caretLeft (Fill/Outline - 12, 16, 24, 32)
- caretRight (Fill/Outline - 12, 16, 24, 32)
- caretUp (Fill/Outline - 12, 16, 24, 32)
- caretUpDown (Fill/Outline - 12, 16, 24, 32)
- catalogBuilder (Fill/Outline - 12, 16, 24, 32)
- cellphone (Fill/Outline - 12, 16, 24, 32)
- change (Fill/Outline - 12, 16, 24, 32)
- changePast (Fill/Outline - 12, 16, 24, 32)
- changePlanned (Fill/Outline - 12, 16, 24, 32)
- chartArea (Fill/Outline - 12, 16, 24, 32)
- chartBarColumn (Fill/Outline - 12, 16, 24, 32)
- chartBarGroup (Fill/Outline - 12, 16, 24, 32)

## Quick Search Guide

### Common Use Cases

**Navigation Icons**
- arrowLeft, arrowRight, arrowUp, arrowDown
- arrowUpDown, arrowUpLeft, arrowUpRight
- arrowDownLeft, arrowDownRight
- caretLeft, caretRight, caretUp, caretDown

**Status Icons**
- circleCheck, circleExclamation, circleInfo, circleQuestion
- ban, checkmark, xmark
- triangleExclamation

**Object Icons**
- building, addressBook, calendar, camera
- book, bookmark, clock, cogwheel

**Action Icons**
- trash, delete, edit, pencil
- refresh, reload, sync, download, upload

**Social/User Icons**
- user, userGroup, userAdd, userRemove

**Media Icons**
- image, video, camera, play, pause

---

## Icon Naming Convention

Icons follow a consistent naming pattern:

1. **Base Name**: Describes the icon (e.g., `circle`, `check`, `arrow`)
2. **Variant**: Indicates if filled or outlined
   - `Fill`: Solid version
   - `Outline`: Outlined/stroke version
3. **Size**: Icon dimensions in pixels (12, 16, 24, 32)

**Examples:**
- `circleCheckFill12` - 12px solid circle with check
- `circleCheckOutline16` - 16px outlined circle with check
- `arrowRightFill24` - 24px solid right arrow
- `arrowRightOutline32` - 32px outlined right arrow

## Icon Aliases

Some icons have aliases for backward compatibility:

- `arrowFirst` → `arrowLeftMost`
- `arrowLast` → `arrowRightMost`
- `checkCircle` → `circleCheck`
- `infoCircle` → `circleInfo`
- `exclamationCircle` → `circleExclamation`
- `questionCircle` → `circleQuestion`
- `exclamationTriangle` → `triangleExclamation`
- `group` → `userGroup`
- `lightningBan` → `lightningSlash`
- `openLink` → `openLinkRight`
- `recordDetails` → `recordActivityDetails`
- `agentTransfer` → `userTransfer`

---

## Implementation Tips

### Displaying Icons in ServiceNow UI Components

```javascript
// In component template
<now-icon icon="circle-check-fill" size="md"></now-icon>

// Available sizes: sm, md, lg, xl
// Note: Use kebab-case for component attributes
```

### Icon Import (if using directly)

```javascript
import { circleCheckFill16 } from '@servicenow/now-icon';

// circleCheckFill16 contains the SVG content
```

---

**Generated from @servicenow/now-icon v19.8.2-ecd**
**Last Updated: $(date)**

