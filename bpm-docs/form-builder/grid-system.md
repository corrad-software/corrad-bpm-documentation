# Form Builder Grid System - Complete Reference

## Overview

The form builder uses an intelligent 12-column CSS Grid system that automatically manages component placement and provides intuitive width selection through visual previews and smart recommendations. This system replaces technical percentages with user-friendly names and includes automatic gap-filling optimization.

## Grid Architecture

### CSS Grid Foundation
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-flow: row dense; /* Enables automatic gap filling */
  column-gap: 16px;
  row-gap: 16px;
  width: 100%;
}
```

### Component Grid Placement
```css
.form-component {
  grid-column: span 12; /* Default to full width */
  width: 100% !important; /* Force width within grid cell */
  transition: all 0.2s ease;
}
```

## Width Options System

### Available Width Options

| Name   | Percentage | Grid Columns | Grid Span    | Use Cases |
|--------|------------|--------------|--------------|-----------|
| Narrow | 25%        | 3 of 12      | `span 3`     | Small inputs like age, zip codes, short codes |
| Small  | 33%        | 4 of 12      | `span 4`     | Short text fields, city names, grouped inputs |
| Medium | 50%        | 6 of 12      | `span 6`     | Names, phone numbers, paired inputs |
| Wide   | 75%        | 9 of 12      | `span 9`     | Addresses, URLs, prominent fields |
| Full   | 100%       | 12 of 12     | `span 12`    | Text areas, headings, single-column layouts |

### Width Selection Interface

#### Visual Grid Preview
Each width option displays a mini 12-column grid preview:
```vue
<div class="grid-container-mini">
  <div 
    v-for="i in 12" 
    :key="i"
    class="grid-cell"
    :class="{
      'active': i <= option.gridColumns,
      'inactive': i > option.gridColumns
    }"
  ></div>
</div>
```

#### Current Selection Feedback
The interface shows:
- Current width name (e.g., "Medium")
- Grid columns used (e.g., "6 of 12 columns")
- Visual representation of current selection
- Percentage equivalent for technical reference

## Smart Recommendation System

### Field Type Recommendations

The system automatically suggests optimal widths based on component type:

#### Narrow Fields (25% - 3 columns)
**Recommended for**: Small, precise inputs
- `number`: Age, quantity, counts
- `date`: Birth dates, deadlines
- `time`: Appointment times
- `color`: Color picker inputs
- `otp`: Verification codes

```javascript
const narrowRecommended = ['number', 'date', 'time', 'color', 'otp']
```

#### Small Fields (33% - 4 columns)
**Recommended for**: Short text inputs
- `text`: Names, titles, short answers

```javascript
const smallRecommended = ['text']
```

#### Medium Fields (50% - 6 columns)
**Recommended for**: Standard form inputs
- `email`: Email addresses
- `tel`: Phone numbers
- `password`: Password fields
- `mask`: Formatted inputs (SSN, phone)
- `select`: Dropdown selections
- `datetime-local`: Combined date/time

```javascript
const mediumRecommended = ['email', 'tel', 'password', 'mask', 'select', 'datetime-local']
```

#### Wide Fields (75% - 9 columns)
**Recommended for**: Longer inputs requiring more space
- `url`: Website addresses
- `file`: File upload fields
- `dropzone`: Drag & drop upload areas

```javascript
const wideRecommended = ['url', 'file', 'dropzone']
```

#### Full Width Fields (100% - 12 columns)
**Recommended for**: Content and multi-option components
- `textarea`: Multi-line text areas
- `heading`: Section headings
- `paragraph`: Descriptive text
- `checkbox`: Checkbox groups
- `radio`: Radio button groups
- `range`: Range sliders
- `switch`: Toggle switches
- `button`: Action buttons
- `info-display`: Information displays

```javascript
const fullRecommended = [
  'textarea', 'heading', 'paragraph', 'checkbox', 
  'radio', 'range', 'switch', 'button', 'info-display'
]
```

### Visual Recommendation Indicators

- **Green Ring**: Recommended options have green highlighting
- **Selection State**: Current choice highlighted in blue
- **Combined State**: Selected + recommended shows green background with checkmark
- **Recommendation Badge**: "Recommended" text appears next to optimal choices

## Smart Grid Placement Algorithm

### Optimal Placement Logic

The system automatically finds the best position for new components:

```javascript
findOptimalGridPlacement() {
  if (this.formComponents.length === 0) {
    // First component - full width
    return { 
      gridColumn: 'span 12', 
      rowIndex: 0,
      width: '100%'
    }
  }
  
  // Group components by their implicit rows
  const rows = this.analyzeGridRows()
  
  // Find row with remaining space
  const rowWithSpace = rows.find(row => row.remainingSpace > 0)
  
  if (rowWithSpace) {
    // Use remaining space in existing row
    const remainingColumns = rowWithSpace.remainingSpace
    const widthPercent = this.columnsToPercentage(remainingColumns)
    
    return {
      gridColumn: `span ${remainingColumns}`,
      rowIndex: rows.indexOf(rowWithSpace),
      width: `${widthPercent}%`
    }
  } else {
    // Create new row
    return { 
      gridColumn: 'span 12', 
      rowIndex: rows.length,
      width: '100%' 
    }
  }
}
```

### Row Analysis
```javascript
analyzeGridRows() {
  const rows = []
  let currentRowSpace = 12
  
  this.formComponents.forEach(component => {
    const spanMatch = component.props.gridColumn?.match(/span\s+(\d+)/) || []
    const columnSpan = parseInt(spanMatch[1]) || 12
    
    if (columnSpan <= currentRowSpace) {
      // Add to current row
      currentRowSpace -= columnSpan
    } else {
      // Start new row
      rows.push({ remainingSpace: currentRowSpace })
      currentRowSpace = 12 - columnSpan
    }
  })
  
  return rows
}
```

## Grid Layout Optimization

### Automatic Gap Filling

The `grid-auto-flow: row dense` CSS property enables automatic gap filling:
- Components automatically fill available spaces
- No manual positioning required
- Optimal use of screen real estate

### Layout Optimization Algorithm

```javascript
optimizeGridLayout() {
  const rows = this.groupComponentsByRows()
  
  rows.forEach(row => {
    if (row.remainingSpace > 0) {
      this.distributeRemainingSpace(row)
    }
  })
}

distributeRemainingSpace(row) {
  if (row.components.length === 1 && row.remainingSpace > 0) {
    // Expand single component to fill row
    const comp = row.components[0]
    this.updateComponentSize(comp.component, 12)
  } else if (row.components.length > 1) {
    // Distribute space proportionally
    const extraSpanPerComponent = Math.floor(row.remainingSpace / row.components.length)
    let remainingExtraSpan = row.remainingSpace % row.components.length
    
    row.components.forEach(comp => {
      let extraSpan = extraSpanPerComponent
      if (remainingExtraSpan > 0) {
        extraSpan += 1
        remainingExtraSpan--
      }
      
      const newSpan = comp.span + extraSpan
      this.updateComponentSize(comp.component, newSpan)
    })
  }
}
```

## Collapsible Panel Integration

### Quick Width Selector

The collapsible panel includes a compact width selector:

```vue
<div class="width-selector-compact">
  <button
    v-for="option in compactWidthOptions"
    :key="option.value"
    @click="updateQuickSetting('width', option.value, option.gridColumns)"
    class="width-btn"
    :class="{ 'active': getComponentWidthPercent() === option.value }"
  >
    {{ option.name }}
  </button>
</div>
```

### Compact Options
```javascript
const compactWidthOptions = [
  { name: 'S', value: 25, gridColumns: 3, description: 'Small (25%)' },
  { name: 'M', value: 50, gridColumns: 6, description: 'Medium (50%)' },
  { name: 'L', value: 75, gridColumns: 9, description: 'Large (75%)' },
  { name: 'XL', value: 100, gridColumns: 12, description: 'Extra Large (100%)' }
]
```

## Grid Component Implementation

### Component Props Structure
```typescript
interface ComponentProps {
  width: string        // e.g., "50%"
  gridColumn: string   // e.g., "span 6"
  label?: string
  name?: string
  // ... other props
}
```

### Width Calculation Functions

```javascript
// Convert percentage to grid columns
const percentageToGridColumns = (percentage) => {
  const mapping = {
    25: 3,   // 3/12 = 25%
    33: 4,   // 4/12 = 33.33%
    50: 6,   // 6/12 = 50%
    66: 8,   // 8/12 = 66.67%
    75: 9,   // 9/12 = 75%
    100: 12  // 12/12 = 100%
  }
  return mapping[percentage] || Math.round((percentage / 100) * 12)
}

// Convert grid columns to percentage
const gridColumnsToPercentage = (columns) => {
  const mapping = {
    3: 25,   // 3/12 = 25%
    4: 33,   // 4/12 = 33.33%
    6: 50,   // 6/12 = 50%
    8: 66,   // 8/12 = 66.67%
    9: 75,   // 9/12 = 75%
    12: 100  // 12/12 = 100%
  }
  return mapping[columns] || Math.round((columns / 12) * 100)
}

// Set component width with grid sync
const setComponentWidth = (percentage, gridColumns) => {
  component.props.width = `${percentage}%`
  component.props.gridColumn = `span ${gridColumns}`
}
```

## Responsive Behavior

### Mobile Optimization
```css
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr; /* Single column on mobile */
    column-gap: 0;
  }
  
  .form-component {
    grid-column: span 1 !important; /* Force single column */
  }
}
```

### Tablet Optimization
```css
@media (min-width: 769px) and (max-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(8, 1fr); /* 8 columns on tablet */
  }
  
  .form-component[style*="span 12"] {
    grid-column: span 8 !important; /* Adjust full-width components */
  }
}
```

## Resize Handle System

### Interactive Resizing
```vue
<div v-if="selectedComponentId === component.id && resizeMode" class="resize-handles">
  <div
    class="resize-handle resize-handle-right"
    @mousedown="startResize($event, component)"
  ></div>
</div>
```

### Resize Logic with Snap-to-Grid
```javascript
const handleResize = (event) => {
  const deltaX = event.clientX - initialX.value
  const container = document.querySelector('.grid-container')
  const containerWidth = container.offsetWidth
  const deltaPercentage = (deltaX / containerWidth) * 100
  
  let newWidth = initialWidth.value + deltaPercentage
  newWidth = Math.max(25, Math.min(100, newWidth))
  
  // Snap to standard widths
  const standardWidths = [25, 33, 50, 66, 75, 100]
  for (const std of standardWidths) {
    if (Math.abs(newWidth - std) < 5) {
      newWidth = std
      break
    }
  }
  
  // Convert to grid columns and update
  const gridColumns = percentageToGridColumns(newWidth)
  updateComponentSize(component, newWidth, gridColumns)
}
```

## CSS Styling Reference

### Grid Container Styles
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-flow: row dense;
  column-gap: 16px;
  row-gap: 16px;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}
```

### Width Selector Modal Styles
```css
.width-option {
  @apply border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer flex items-center space-x-4;
}

.width-option.selected {
  @apply border-blue-500 bg-blue-50 ring-2 ring-blue-200;
}

.width-option.recommended {
  @apply ring-2 ring-green-200 border-green-300;
}

.width-option.selected.recommended {
  @apply border-green-500 bg-green-50 ring-2 ring-green-200;
}
```

### Grid Preview Styles
```css
.grid-container-mini {
  @apply grid grid-cols-12 gap-1 w-32;
}

.grid-cell {
  @apply h-2 rounded-sm transition-colors duration-200;
}

.grid-cell.active {
  @apply bg-blue-500;
}

.grid-cell.inactive {
  @apply bg-gray-200;
}
```

### Quick Selector Styles
```css
.width-selector-compact {
  @apply flex space-x-1;
}

.width-btn {
  @apply flex-1 px-2 py-1.5 text-xs font-medium text-center rounded-md border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200;
}

.width-btn.active {
  @apply border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200;
}
```

## Best Practices

### Grid Layout Design
1. **Start Simple**: Begin with recommended widths
2. **Mix Widths**: Combine different widths for visual interest
3. **Logical Grouping**: Use consistent widths for related fields
4. **Visual Balance**: Avoid too many full-width fields in sequence
5. **Mobile-First**: Consider how layouts adapt on smaller screens

### Performance Considerations
1. **Grid Optimization**: Use the automatic optimization feature
2. **Component Limits**: Keep forms under 50 components for best performance
3. **Responsive Testing**: Test across different screen sizes
4. **Browser Support**: Ensure CSS Grid polyfills for older browsers

### User Experience Guidelines
1. **Intuitive Widths**: Trust the recommendation system
2. **Visual Feedback**: Use the grid preview for precision
3. **Consistent Patterns**: Establish width patterns across forms
4. **Progressive Enhancement**: Start with basics, add complexity gradually

## Troubleshooting

### Common Issues

**Grid Layout Not Working**
- Check CSS Grid browser support
- Verify `grid-template-columns` is applied
- Ensure components have valid `gridColumn` values

**Components Overlapping**
- Check for invalid span values (must be 1-12)
- Verify total spans in row don't exceed 12
- Use grid optimization to fix layouts

**Responsive Issues**
- Test media query breakpoints
- Verify mobile-specific grid rules
- Check component width calculations

**Performance Problems**
- Reduce number of components
- Use virtual scrolling for large forms
- Optimize grid calculations

### Debugging Tools

```javascript
// Debug grid layout
const debugGridLayout = () => {
  const rows = groupComponentsByRows()
  console.table(rows.map(row => ({
    components: row.components.length,
    remainingSpace: row.remainingSpace,
    totalSpan: 12 - row.remainingSpace
  })))
}

// Validate component grid properties
const validateGridProps = (component) => {
  const span = component.props.gridColumn?.match(/span\s+(\d+)/)?.[1]
  const width = parseInt(component.props.width)
  
  console.log({
    id: component.id,
    span: parseInt(span),
    width: width,
    valid: span >= 1 && span <= 12 && width > 0 && width <= 100
  })
}
```

## Migration Guide

### Upgrading from Percentage-Only System

1. **Update Component Props**:
```javascript
// Old system
component.props.width = "50%"

// New system  
component.props.width = "50%"
component.props.gridColumn = "span 6"
```

2. **Migrate Existing Forms**:
```javascript
const migrateFormToGrid = (form) => {
  return {
    ...form,
    components: form.components.map(component => ({
      ...component,
      props: {
        ...component.props,
        gridColumn: component.props.gridColumn || 
          `span ${percentageToGridColumns(parseInt(component.props.width) || 100)}`
      }
    }))
  }
}
```

3. **Update CSS**:
```css
/* Remove old percentage-based widths */
.form-component {
  /* width: var(--component-width); // Remove this */
  grid-column: var(--grid-column); /* Add this */
}
```

---

*This grid system documentation reflects the complete implementation including visual selection, smart recommendations, automatic optimization, and responsive behavior.*

**Last updated**: December 2024 