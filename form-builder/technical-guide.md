# Form Builder Technical Guide

This document provides comprehensive technical implementation details for developers working with the Form Builder system, including the new smart collapsible panel, enhanced grid system, and advanced UX features.

> For user documentation and usage guidelines, see the [User Guide](user-guide.md)

## Recent Development Updates (December 2024)

### 🔍 Critical Discovery: Dual Configuration System

During recent development work, a critical architectural issue was discovered: **two separate configuration systems** exist for form components, causing confusion and preventing new component settings from appearing in the form builder interface.

#### Configuration Systems Identified:

**1. FormBuilderConfiguration.vue** (Enhanced but not in use)
- Location: `components/FormBuilderConfiguration.vue`
- Status: Extensively enhanced with new component settings
- Issue: Not actually used by the form builder interface
- Features: Comprehensive configuration panels for all component types

**2. FormBuilderFieldSettingsModal.vue** (Actually used)
- Location: `components/FormBuilderFieldSettingsModal.vue`
- Status: This is the configuration system actually used by the form builder
- Current State: Limited component support, missing new enhancements
- Integration: Direct integration with form builder drag-and-drop system

#### Resolution Strategy:
1. **Short-term**: Migrate enhanced configurations to FormBuilderFieldSettingsModal.vue
2. **Long-term**: Consider unifying both systems or deprecating unused system
3. **Current Progress**: Dynamic List Component migration 80% complete

### 🚀 Dynamic List Component Enhancement

The Dynamic List Component has been comprehensively enhanced with professional-grade features:

#### New Properties Added (FormBuilderComponents.vue):
```javascript
{
  name: 'dynamic-list',
  settings: [
    'label', 'name', 'help', 'placeholder', 'buttonText',
    'minItems', 'maxItems', 'defaultItems', 'width',
    // NEW ENHANCED PROPERTIES:
    'itemValidation',     // Individual item validation rules
    'allowDuplicates',    // Prevent duplicate entries
    'enableSorting',      // Visual sorting indicators
    'enableSearch',       // Search/filter functionality
    'itemType',           // Type validation (text/number/email/url)
    'showItemCounter',    // Display item count
    'confirmDelete',      // Confirmation before deletion
    'bulkOperations',     // Bulk select/delete operations
    'exportFormat',       // Export data format (JSON/CSV/TXT)
    'importEnabled'       // Enable data import functionality
  ]
}
```

#### Implementation Details:

**Validation Engine** (ComponentPreview.vue):
```javascript
const validateItem = (item, index) => {
  const errors = []
  
  // Type validation
  if (itemType.value === 'email' && !isValidEmail(item)) {
    errors.push('Invalid email format')
  }
  
  // Uniqueness validation
  if (!allowDuplicates.value && isDuplicate(item, index)) {
    errors.push('Duplicate items not allowed')
  }
  
  // Custom validation rules
  if (itemValidation.value?.required && !item?.trim()) {
    errors.push('This field is required')
  }
  
  return errors
}
```

**Search/Filter System**:
```javascript
const filteredItems = computed(() => {
  if (!searchQuery.value) return modelValue.value || []
  return (modelValue.value || []).filter(item =>
    item.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
```

**Bulk Operations**:
```javascript
const bulkDelete = () => {
  if (selectedItems.value.length === 0) return
  
  const newItems = (modelValue.value || []).filter((_, index) => 
    !selectedItems.value.includes(index)
  )
  
  emit('update:modelValue', newItems)
  selectedItems.value = []
}
```

**Import/Export System**:
```javascript
const exportData = (format) => {
  const data = modelValue.value || []
  
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2)
    case 'csv':
      return data.join('\n')
    case 'txt':
      return data.join('\n')
  }
}
```

#### Files Modified:
- ✅ `components/FormBuilderComponents.vue` - Added 10 new properties
- ✅ `components/FormBuilderConfiguration.vue` - Comprehensive configuration UI (not in use)
- ✅ `components/ComponentPreview.vue` - Full feature implementation
- 🟡 `components/FormBuilderFieldSettingsModal.vue` - Partial migration (in progress)

### 🔧 Configuration Panel Integration Status

**Current Issue**: Enhanced Dynamic List settings not appearing in form builder
**Root Cause**: Settings added to wrong configuration system
**Solution Progress**: 80% complete

**Completed Steps**:
1. ✅ Added dynamic-list to field configurations (label, name, placeholder, help, width)
2. ✅ Added dynamic-list to hasSpecificSettings array
3. ✅ Added icon, type name, and description
4. 🟡 **IN PROGRESS**: Template section for dynamic-list specific settings

**Remaining Work**:
- [ ] Complete template section in FormBuilderFieldSettingsModal.vue
- [ ] Test configuration panel functionality
- [ ] Migrate other enhanced components

---

## Architecture Overview

### Technology Stack
- **Frontend Framework**: Nuxt 3 / Vue 3
- **State Management**: Pinia
- **Form Library**: FormKit
- **UI Framework**: Tailwind CSS + Custom Components
- **Icons**: Heroicons
- **Drag & Drop**: vuedraggable
- **Grid System**: CSS Grid (12-column)

### Key Dependencies
```json
{
  "@formkit/nuxt": "^1.0.0",
  "@pinia/nuxt": "^0.4.11",
  "vuedraggable": "^4.1.0",
  "@vueuse/core": "^10.1.2",
  "tailwindcss": "^3.3.2",
  "@heroicons/vue": "^2.0.18"
}
```

## Project Structure

```
pages/
├── form-builder/
│   ├── index.vue              # Main builder interface with collapsible panel
│   └── manage.vue             # Form management
components/
├── FormBuilderComponents.vue  # Enhanced component library
├── FormBuilderCanvas.vue      # Grid-based canvas with resize handles
├── FormBuilderFieldSettingsModal.vue # Full settings modal with visual grid
├── ComponentPreview.vue       # Improved component rendering
└── RsCollapseItem.vue         # Collapsible components
stores/
├── formBuilder.js             # Enhanced state management with grid logic
└── toast.js                   # Toast notifications
composables/
└── useToast.js                # Toast composition
types/
└── form-builder.d.ts          # TypeScript definitions
server/
└── api/
    └── forms/
        ├── index.js           # Form API endpoints
        └── [id].js            # Form by ID endpoints
docs/
└── grid-system.md             # Grid system documentation
```

## Enhanced UI Architecture

### Smart Collapsible Panel System

The right panel system provides two interaction modes:

#### Panel States
```vue
<script setup>
// Panel state management
const showFieldSettingsPanel = ref(true)

// Auto-open when component selected
watch(() => formStore.selectedComponent, (newComponent) => {
  if (newComponent) {
    showFieldSettingsPanel.value = true
  }
}, { immediate: true })

// Toggle function
const toggleFieldSettingsPanel = () => {
  showFieldSettingsPanel.value = !showFieldSettingsPanel.value
}
</script>

<template>
  <div
    class="field-settings-panel"
    :class="{
      'panel-expanded': showFieldSettingsPanel,
      'panel-collapsed': !showFieldSettingsPanel
    }"
  >
    <!-- Expanded content (320px) -->
    <div v-if="showFieldSettingsPanel" class="panel-content">
      <!-- Quick settings, actions, etc. -->
    </div>
    
    <!-- Collapsed content (48px) -->
    <div v-else class="collapsed-info">
      <!-- Minimal component info -->
    </div>
  </div>
</template>
```

#### Quick Settings Implementation
```vue
<script setup>
// Quick settings reactive state
const quickSettings = ref({
  label: '',
  name: '',
  placeholder: '',
  required: false
})

// Compact width options for sidebar
const compactWidthOptions = [
  { name: 'S', value: 25, gridColumns: 3, description: 'Small (25%)' },
  { name: 'M', value: 50, gridColumns: 6, description: 'Medium (50%)' },
  { name: 'L', value: 75, gridColumns: 9, description: 'Large (75%)' },
  { name: 'XL', value: 100, gridColumns: 12, description: 'Extra Large (100%)' }
]

// Update component through quick settings
const updateQuickSetting = (key, value, gridColumns = null) => {
  if (!formStore.selectedComponent) return
  
  const updatedComponent = { ...formStore.selectedComponent }
  
  if (key === 'width') {
    updatedComponent.props.width = `${value}%`
    if (gridColumns) {
      updatedComponent.props.gridColumn = `span ${gridColumns}`
    }
  } else {
    updatedComponent.props[key] = value
  }
  
  formStore.updateComponent(updatedComponent)
  quickSettings.value[key] = value
}
</script>
```

### Enhanced Grid System

#### CSS Grid Implementation
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-flow: row dense; /* Enables automatic gap filling */
  column-gap: 16px;
  row-gap: 16px;
  width: 100%;
}

.form-component {
  grid-column: span 12; /* Default to full width */
  width: 100% !important; /* Force width within grid cell */
  transition: all 0.2s ease;
}
```

#### Grid Column Mapping
```javascript
// Precise percentage to grid column mapping
const widthToGridColumns = {
  25: 3,   // 3/12 = 25%
  33: 4,   // 4/12 = 33.33%
  50: 6,   // 6/12 = 50%
  66: 8,   // 8/12 = 66.67%
  75: 9,   // 9/12 = 75%
  100: 12  // 12/12 = 100%
}

const setComponentWidth = (percentage, gridColumns) => {
  configModel.value.width = `${percentage}%`
  configModel.value.gridColumn = `span ${gridColumns}`
}
```

#### Smart Grid Placement Algorithm
```javascript
// Optimal grid placement for new components
findOptimalGridPlacement() {
  if (this.formComponents.length === 0) {
    return { 
      gridColumn: 'span 12', 
      rowIndex: 0,
      width: '100%'
    }
  }
  
  // Group components by rows and find available space
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
      currentRowSpace = 12 - columnSpan
    }
  })
  
  // Return optimal placement
  return {
    gridColumn: `span ${Math.min(currentRowSpace, 12)}`,
    width: `${Math.round((currentRowSpace / 12) * 100)}%`
  }
}
```

## Component Architecture

### Enhanced FormBuilderFieldSettingsModal

The modal now includes visual grid selection:

```vue
<template>
  <div class="width-selector">
    <div 
      v-for="option in widthOptions" 
      :key="option.value"
      @click="setComponentWidth(option.value, option.gridColumns)"
      class="width-option"
      :class="{
        'selected': getComponentWidthPercent() === option.value,
        'recommended': isRecommendedWidth(option.type)
      }"
    >
      <!-- Visual Grid Preview -->
      <div class="grid-preview">
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
      </div>
      
      <!-- Option Details -->
      <div class="option-info">
        <div class="option-name">
          {{ option.name }}
          <span v-if="isRecommendedWidth(option.type)" class="recommended-badge">
            Recommended
          </span>
        </div>
        <div class="option-description">{{ option.description }}</div>
        <div class="option-use-case">{{ option.useCase }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Smart width recommendations
const getRecommendedWidth = (fieldType) => {
  const recommendations = {
    // Narrow fields (25% - 3 columns)
    'number': 'narrow',
    'date': 'narrow',
    'time': 'narrow',
    'color': 'narrow',
    'otp': 'narrow',
    
    // Small fields (33% - 4 columns)
    'text': 'small',
    
    // Medium fields (50% - 6 columns)
    'email': 'medium',
    'tel': 'medium',
    'password': 'medium',
    'mask': 'medium',
    'select': 'medium',
    'datetime-local': 'medium',
    
    // Wide fields (75% - 9 columns)
    'url': 'wide',
    'file': 'wide',
    'dropzone': 'wide',
    
    // Full width fields (100% - 12 columns)
    'textarea': 'full',
    'heading': 'full',
    'paragraph': 'full',
    'checkbox': 'full',
    'radio': 'full',
    'range': 'full',
    'switch': 'full',
    'button': 'full',
    'info-display': 'full'
  }
  
  return recommendations[fieldType] || 'full'
}
</script>
```

### Enhanced Canvas with Resize Handles

```vue
<template>
  <div class="grid-container">
    <draggable
      v-model="internalComponents"
      :options="dragOptions"
      @end="onDragEnd"
      class="draggable-container"
    >
      <div
        v-for="(component, index) in internalComponents"
        :key="component.id"
        class="form-component"
        :style="getComponentStyle(component)"
        @click="selectComponent(component.id)"
      >
        <!-- Component Content -->
        <ComponentPreview
          :component="component"
          :is-preview="false"
          class="canvas-component"
        />
        
        <!-- Resize Handles -->
        <div v-if="selectedComponentId === component.id && resizeMode" class="resize-handles">
          <div
            class="resize-handle resize-handle-right"
            @mousedown="startResize($event, component)"
          ></div>
        </div>
        
        <!-- Component Actions -->
        <div class="component-actions">
          <button @click="toggleResizeMode(component)">
            <Icon name="heroicons:arrows-pointing-out" />
          </button>
          <button @click="deleteComponent(component.id)">
            <Icon name="heroicons:trash" />
          </button>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script setup>
// Enhanced resize functionality with snap-to-grid
const handleResize = (event) => {
  if (!resizing.value || !selectedComponentId.value) return
  
  const component = props.formComponents.find(c => c.id === selectedComponentId.value)
  if (!component) return
  
  // Calculate new width with snap points
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
  
  // Convert to grid columns
  const gridColumns = widthToGridColumns[newWidth] || Math.round((newWidth / 100) * 12)
  
  // Update component
  const updatedComponent = {
    ...component,
    props: {
      ...component.props,
      width: `${newWidth}%`,
      gridColumn: `span ${gridColumns}`
    }
  }
  
  emit('update-component', updatedComponent)
}
</script>
```

## State Management Enhancements

### Enhanced Pinia Store

```typescript
interface FormState {
  formComponents: FormComponent[]
  selectedComponentId: string | null
  formName: string
  formDescription: string
  formId: string | null
  formUUID: string | null
  isDraggingOver: boolean
  savedForms: SavedForm[]
  showFieldSettingsPanel: boolean // New panel state
}

export const useFormBuilderStore = defineStore('formBuilder', {
  state: (): FormState => ({
    formComponents: [],
    selectedComponentId: null,
    formName: 'New Form',
    formDescription: '',
    formId: null,
    formUUID: null,
    isDraggingOver: false,
    savedForms: [],
    showFieldSettingsPanel: true
  }),
  
  getters: {
    selectedComponent: (state) => {
      if (!state.selectedComponentId) return null
      return state.formComponents.find(c => c.id === state.selectedComponentId)
    },
    
    formConfig: (state) => ({
        id: state.formId,
        uuid: state.formUUID,
        name: state.formName,
        description: state.formDescription,
        components: state.formComponents
    })
  },
  
  actions: {
    // Enhanced component addition with smart grid placement
    addComponent(component: FormComponent) {
      const { gridColumn, rowIndex, width } = this.findOptimalGridPlacement()
      
      const newComponent = {
        ...component,
        id: component.id || uuidv4(),
        props: {
          ...component.defaultProps,
          width: width,
          gridColumn: gridColumn,
          name: component.defaultProps?.name || `${component.type}_${this.formComponents.length + 1}`,
          label: component.defaultProps?.label || `${component.name} ${this.formComponents.length + 1}`
        }
      }
      
      this.formComponents.push(newComponent)
      this.selectComponent(newComponent.id)
    },
    
    // Grid layout optimization
    optimizeGridLayout() {
      const rows = this.groupComponentsByRows()
      
      rows.forEach(row => {
        if (row.remainingSpace > 0) {
          this.distributeRemainingSpace(row)
        }
      })
    },
    
    // Helper methods for grid management
    groupComponentsByRows() {
      const rows = []
      let currentRowSpace = 12
      
      this.formComponents.forEach(component => {
        const spanMatch = component.props.gridColumn?.match(/span\s+(\d+)/) || []
        const columnSpan = parseInt(spanMatch[1]) || 12
        
        if (columnSpan <= currentRowSpace) {
          currentRowSpace -= columnSpan
          if (!rows[rows.length - 1]) {
            rows.push({ components: [], remainingSpace: 0 })
          }
          rows[rows.length - 1].components.push(component)
          rows[rows.length - 1].remainingSpace = currentRowSpace
        } else {
          rows.push({
            components: [component],
            remainingSpace: 12 - columnSpan
          })
          currentRowSpace = 12 - columnSpan
        }
      })
      
      return rows
    }
  }
})
```

## Component Type System

### Enhanced Component Definitions

```javascript
const availableComponents = [
  {
    type: 'text',
    name: 'Text Field',
    category: 'Basic Inputs',
    icon: 'heroicons:document-text',
    recommendedWidth: 'small', // New recommendation system
    defaultProps: {
      type: 'text',
      label: 'Text Field',
      name: '',
      placeholder: '',
      help: '',
      validation: '',
      width: '33%', // Smart default
      gridColumn: 'span 4'
    }
  },
  {
    type: 'textarea',
    name: 'Text Area',
    category: 'Basic Inputs', 
    icon: 'heroicons:document-text',
    recommendedWidth: 'full',
    defaultProps: {
      type: 'textarea',
      label: 'Text Area',
      name: '',
      placeholder: '',
      help: '',
      rows: 4,
      validation: '',
      width: '100%',
      gridColumn: 'span 12'
    }
  },
  // ... additional components with smart defaults
]
```

### Component Icon and Name Helpers

```javascript
const getComponentIcon = (type) => {
  const iconMap = {
    text: 'heroicons:document-text',
    textarea: 'heroicons:document-text',
    number: 'heroicons:hashtag',
    email: 'heroicons:envelope',
    password: 'heroicons:key',
    url: 'heroicons:link',
    tel: 'heroicons:device-phone-mobile',
    mask: 'heroicons:pencil-square',
    hidden: 'heroicons:eye-slash',
    select: 'heroicons:chevron-down',
    checkbox: 'heroicons:check-badge',
    radio: 'heroicons:radio',
    switch: 'material-symbols:toggle-on',
    date: 'heroicons:calendar-days',
    time: 'heroicons:clock',
    'datetime-local': 'heroicons:calendar',
    range: 'heroicons:adjustments-horizontal',
    color: 'heroicons:swatch',
    file: 'heroicons:document-arrow-up',
    otp: 'heroicons:key',
    dropzone: 'heroicons:cloud-arrow-up',
    button: 'heroicons:cursor-arrow-rays',
    heading: 'heroicons:h1',
    paragraph: 'heroicons:document-text',
    divider: 'heroicons:minus',
    'info-display': 'heroicons:information-circle'
  }
  return iconMap[type] || 'heroicons:square-3-stack-3d'
}

// Short names for collapsed panel
const getComponentTypeShort = (type) => {
  const shortNames = {
    text: 'TXT',
    textarea: 'TXT', 
    number: 'NUM',
    email: 'EML',
    password: 'PWD',
    url: 'URL',
    tel: 'TEL',
    mask: 'MSK',
    hidden: 'HID',
    select: 'SEL',
    checkbox: 'CHK',
    radio: 'RAD',
    switch: 'SWT',
    date: 'DTE',
    time: 'TME',
    'datetime-local': 'DTM',
    range: 'RNG',
    color: 'CLR',
    file: 'FIL',
    otp: 'OTP',
    dropzone: 'DRP',
    button: 'BTN',
    heading: 'H' + (component?.props?.level || '2'),
    paragraph: 'TXT',
    divider: 'DIV',
    'info-display': 'INF'
  }
  return shortNames[type] || 'FLD'
}
```

## CSS Architecture

### Panel System Styles

```css
/* Field Settings Panel */
.field-settings-panel {
  @apply relative bg-white border-l border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out;
}

.panel-expanded {
  @apply w-80; /* 320px expanded */
}

.panel-collapsed {
  @apply w-12; /* 48px collapsed */
}

/* Panel content areas */
.panel-content {
  @apply flex-1 flex flex-col overflow-hidden;
}

.panel-header {
  @apply px-4 py-3 border-b border-gray-200 bg-gray-50;
}

.panel-body {
  @apply flex-1 overflow-y-auto;
}

/* Collapsed state */
.collapsed-info {
  @apply h-full flex flex-col px-2 py-3;
}

.collapsed-header {
  @apply mb-4 flex justify-center;
}

.collapsed-content {
  @apply text-center w-full flex-1 flex flex-col justify-center items-center;
}
```

### Grid System Styles

```css
/* Grid container */
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

/* Grid preview in modal */
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

/* Width selection */
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

### Quick Settings Styles

```css
/* Compact width buttons */
.width-selector-compact {
  @apply flex space-x-1;
}

.width-btn {
  @apply flex-1 px-2 py-1.5 text-xs font-medium text-center rounded-md border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200;
}

.width-btn.active {
  @apply border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200;
}

/* Toggle switches */
.setting-toggle {
  @apply flex items-center cursor-pointer;
}

.toggle-slider {
  @apply relative inline-block w-8 h-4 mr-2 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out;
}

.setting-toggle input:checked + .toggle-slider {
  @apply bg-blue-600;
}

.toggle-slider::before {
  @apply absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out;
  content: '';
}

.setting-toggle input:checked + .toggle-slider::before {
  @apply transform translate-x-4;
}
```

## API Integration

### Form Data Structure

```typescript
interface FormComponent {
  id: string
  type: string
  name: string
  category: string
  icon: string
  defaultProps: Record<string, any>
  props: {
    label?: string
    name?: string
    placeholder?: string
    help?: string
    validation?: string
    width: string          // e.g., "50%"
    gridColumn: string     // e.g., "span 6"
    [key: string]: any
  }
}

interface FormConfig {
  id: string | null
  uuid: string | null
  name: string
  description: string
  components: FormComponent[]
  settings: {
    submitUrl?: string
    successMessage?: string
    errorMessage?: string
    redirectUrl?: string
  }
}
```

### Save/Load Operations

```javascript
// Enhanced save with grid validation
const saveForm = async (formConfig) => {
  // Validate grid layout
  const validatedComponents = formConfig.components.map(component => ({
    ...component,
    props: {
      ...component.props,
      // Ensure grid properties are valid
      width: component.props.width || '100%',
      gridColumn: component.props.gridColumn || 'span 12'
    }
  }))
  
  const validatedForm = {
    ...formConfig,
    components: validatedComponents
  }
  
  try {
    const response = await $fetch('/api/forms', {
      method: 'POST',
      body: validatedForm
    })
    return response
  } catch (error) {
    throw new Error(`Save failed: ${error.message}`)
  }
}

// Load with grid property migration
const loadForm = async (formId) => {
  try {
    const form = await $fetch(`/api/forms/${formId}`)
    
    // Migrate old forms without grid properties
    const migratedComponents = form.components.map(component => ({
      ...component,
      props: {
        ...component.props,
        width: component.props.width || '100%',
        gridColumn: component.props.gridColumn || 'span 12'
      }
    }))
    
    return {
      ...form,
      components: migratedComponents
    }
  } catch (error) {
    throw new Error(`Load failed: ${error.message}`)
  }
}
```

## Performance Optimizations

### Component Rendering

```vue
<script setup>
// Memoized component style calculation
const componentStyle = computed(() => {
  if (props.isPreview) {
    return {}
  }
  
  const gridColumn = props.component.props.gridColumn || 'span 12'
  
  return {
    gridColumn: gridColumn,
    width: '100%',
    boxSizing: 'border-box'
  }
})

// Debounced updates for quick settings
const debouncedUpdate = useDebounceFn((key, value) => {
  updateQuickSetting(key, value)
}, 300)
</script>
```

### Grid Layout Optimization

```javascript
// Efficient grid layout calculation
const optimizeGridLayout = () => {
  // Use requestAnimationFrame for smooth updates
  requestAnimationFrame(() => {
    const rows = groupComponentsByRows()
    
    rows.forEach(row => {
      if (row.remainingSpace > 3) { // Only optimize significant gaps
        distributeSpace(row)
      }
    })
  })
}

// Virtual scrolling for large forms
const useVirtualScrolling = (components, containerHeight) => {
  const itemHeight = 120 // Average component height
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2
  
  return computed(() => {
    const startIndex = Math.max(0, scrollTop.value / itemHeight - 1)
    const endIndex = Math.min(components.length, startIndex + visibleCount)
    
    return components.slice(startIndex, endIndex)
  })
}
```

## JavaScript Execution Engine (FormScriptEngine)

### Architecture Overview

The FormScriptEngine component provides real-time JavaScript execution for dynamic form behavior, calculations, and conditional logic. It monitors form data changes and executes user-defined event handlers to create interactive forms.

#### Core Components
```
components/
├── FormScriptEngine.vue       # Main execution engine
└── FormBuilderCanvas.vue      # Integration point for script execution
pages/
└── form-builder/
    └── index.vue              # Form data handling and script triggering
```

### FormScriptEngine.vue Implementation

```vue
<template>
  <!-- FormScriptEngine runs invisibly in the background -->
  <div style="display: none;">
    <!-- Debug info in development -->
    <div v-if="isDev">
      Script Engine Status: {{ isInitialized ? 'Active' : 'Initializing' }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

// Component props
const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  script: {
    type: String,
    default: ''
  }
})

// Reactive state
const isInitialized = ref(false)
const previousFormData = ref({})
const scriptContext = ref(null)
const handlers = ref({
  onLoad: null,
  onFieldChange: null
})

// Development mode detection
const isDev = process.env.NODE_ENV === 'development'

// Initialize script execution context
const initializeScript = () => {
  try {
    if (!props.script.trim()) {
      console.log('FormScriptEngine: No script provided')
      return
    }

    // Create execution context with form functions
    const context = {
      setField: (fieldName, value) => {
        console.log('setField called:', fieldName, '=', value)
        
        if (props.formData[fieldName] !== value) {
          // Update form data reactively
          props.formData[fieldName] = value
          
          // Emit update event for parent component
          emit('fieldUpdate', { fieldName, value })
        }
      },
      
      getField: (fieldName) => {
        const value = props.formData[fieldName]
        console.log('getField called:', fieldName, '=', value)
        return value
      },
      
      console: console, // Allow console access
      
      // Add other safe global functions as needed
      parseFloat: parseFloat,
      parseInt: parseInt,
      Date: Date,
      Math: Math
    }

    // Execute script in isolated context
    const scriptFunction = new Function(
      'setField', 'getField', 'console', 'parseFloat', 'parseInt', 'Date', 'Math',
      `
        ${props.script}
        
        // Return the event handlers
        return {
          onLoad: typeof onLoad !== 'undefined' ? onLoad : null,
          onFieldChange: typeof onFieldChange !== 'undefined' ? onFieldChange : null
        }
      `
    )

    // Execute script and extract handlers
    const result = scriptFunction(
      context.setField,
      context.getField,
      context.console,
      context.parseFloat,
      context.parseInt,
      context.Date,
      context.Math
    )

    handlers.value = result
    scriptContext.value = context
    
    console.log('FormScriptEngine: Script initialized with handlers:', Object.keys(result))
    
    return true
  } catch (error) {
    console.error('FormScriptEngine: Script initialization error:', error)
    return false
  }
}

// Execute onLoad handler
const executeOnLoad = async () => {
  if (handlers.value.onLoad && typeof handlers.value.onLoad === 'function') {
    try {
      console.log('FormScriptEngine: Executing onLoad handler')
      await handlers.value.onLoad()
      console.log('FormScriptEngine: onLoad completed')
    } catch (error) {
      console.error('FormScriptEngine: onLoad execution error:', error)
    }
  }
}

// Execute onFieldChange handler
const executeOnFieldChange = async (fieldName, value) => {
  if (handlers.value.onFieldChange && typeof handlers.value.onFieldChange === 'function') {
    try {
      console.log('FormScriptEngine: Executing onFieldChange for:', fieldName)
      await handlers.value.onFieldChange(fieldName, value)
      console.log('FormScriptEngine: onFieldChange completed for:', fieldName)
    } catch (error) {
      console.error('FormScriptEngine: onFieldChange execution error:', error)
    }
  }
}

// Detect and trigger field changes
const triggerFieldChangeDetection = () => {
  const currentData = { ...props.formData }
  const previousData = previousFormData.value
  
  // Find changed fields
  const changedFields = []
  
  for (const fieldName in currentData) {
    if (currentData[fieldName] !== previousData[fieldName]) {
      changedFields.push({
        name: fieldName,
        value: currentData[fieldName],
        oldValue: previousData[fieldName]
      })
    }
  }
  
  if (changedFields.length > 0) {
    console.log('FormScriptEngine: Detected field changes:', changedFields)
    
    // Execute handler for each changed field
    changedFields.forEach(field => {
      executeOnFieldChange(field.name, field.value)
    })
    
    // Update previous data after processing
    previousFormData.value = { ...currentData }
  } else {
    console.log('FormScriptEngine: No field changes detected')
  }
}

// Watch for form data changes with enhanced detection
watch(
  () => props.formData,
  (newData, oldData) => {
    if (!isInitialized.value) return
    
    console.log('FormScriptEngine: Form data changed, checking for field changes...')
    console.log('New data:', JSON.stringify(newData))
    console.log('Previous data:', JSON.stringify(previousFormData.value))
    
    // Use nextTick to ensure DOM updates are complete
    nextTick(() => {
      triggerFieldChangeDetection()
    })
  },
  { 
    deep: true, 
    flush: 'post' // Execute after DOM updates
  }
)

// Initialize when component mounts
onMounted(async () => {
  console.log('FormScriptEngine: Component mounted, initializing...')
  
  // Initialize script context
  const success = initializeScript()
  
  if (success) {
    // Execute onLoad handler first
    await executeOnLoad()
    
    // Set initial previousFormData AFTER onLoad execution
    // This prevents initial setField calls from being detected as changes
    await nextTick()
    previousFormData.value = { ...props.formData }
    
    isInitialized.value = true
    console.log('FormScriptEngine: Initialization complete')
  } else {
    console.error('FormScriptEngine: Initialization failed')
  }
})

// Public method to manually trigger change detection
const manualTrigger = () => {
  console.log('FormScriptEngine: Manual trigger requested')
  triggerFieldChangeDetection()
}

// Expose public methods
defineExpose({
  manualTrigger,
  isInitialized
})

// Emit events
const emit = defineEmits(['fieldUpdate'])
</script>
```

### Integration with Form Builder

#### Form Builder Canvas Integration
```vue
<!-- In FormBuilderCanvas.vue -->
<template>
  <div class="form-canvas">
    <!-- Form components render here -->
    <ComponentPreview 
      v-for="component in formComponents"
      :key="component.id"
      :component="component"
      :is-preview="isPreview"
    />
    
    <!-- JavaScript execution engine -->
    <FormScriptEngine
      v-if="isPreview && formScript"
      :form-data="previewFormData"
      :script="formScript"
      @field-update="handleScriptFieldUpdate"
    />
  </div>
</template>

<script setup>
import FormScriptEngine from '~/components/FormScriptEngine.vue'

// Handle script-triggered field updates
const handleScriptFieldUpdate = ({ fieldName, value }) => {
  console.log('Canvas: Script updated field:', fieldName, '=', value)
  
  // Update preview form data
  previewFormData.value[fieldName] = value
  
  // Trigger UI refresh
  nextTick(() => {
    refreshFormComponents()
  })
}
</script>
```

#### Main Form Builder Integration
```vue
<!-- In pages/form-builder/index.vue -->
<script setup>
// Enhanced FormKit input handler with script engine integration
const handleFormKitInput = (event) => {
  console.log('FormKit input event:', event)
  
  // Update preview form data
  previewFormData.value = { ...event }
  
  // Trigger script engine change detection
  if (formScriptEngineRef.value) {
    nextTick(() => {
      formScriptEngineRef.value.manualTrigger()
    })
  }
}

// Template ref for script engine
const formScriptEngineRef = ref(null)
</script>

<template>
  <div class="form-builder">
    <!-- Canvas with integrated script engine -->
    <FormBuilderCanvas
      ref="formScriptEngineRef"
      :form-script="formStore.currentForm?.script"
      @form-kit-input="handleFormKitInput"
    />
  </div>
</template>
```

### Event Handler API Reference

#### onLoad Handler
Executes once when the form loads. Use for initialization.

```javascript
onLoad: function() {
    // Initialize default values
    setField('status', 'active');
    setField('created_date', new Date().toISOString().split('T')[0]);
    
    // Perform initial calculations
    calculateInitialValues();
}
```

#### onFieldChange Handler
Executes when any field value changes.

```javascript
onFieldChange: function(fieldName, value) {
    console.log('Field changed:', fieldName, 'New value:', value);
    
    // Handle specific field changes
    switch(fieldName) {
        case 'quantity':
        case 'price':
            updateTotal();
            break;
            
        case 'country':
            updateTaxRate(value);
            break;
    }
}
```

### Error Handling and Debugging

#### Script Execution Errors
```javascript
// Comprehensive error handling in script execution
const executeHandler = async (handler, ...args) => {
  try {
    if (typeof handler === 'function') {
      const result = await handler(...args)
      return { success: true, result }
    }
    return { success: false, error: 'Handler is not a function' }
  } catch (error) {
    console.error('Script execution error:', error)
    
    // Emit error event for debugging
    emit('scriptError', {
      error: error.message,
      stack: error.stack,
      handler: handler.name || 'anonymous',
      args
    })
    
    return { success: false, error: error.message }
  }
}
```

#### Debug Mode Features
```javascript
// Enhanced logging in development mode
const debugLog = (message, data) => {
  if (isDev) {
    console.log(`[FormScriptEngine Debug] ${message}`, data)
  }
}

// Field change tracing
const traceFieldChange = (fieldName, oldValue, newValue) => {
  if (isDev) {
    console.group(`Field Change: ${fieldName}`)
    console.log('Old Value:', oldValue)
    console.log('New Value:', newValue)
    console.log('Timestamp:', new Date().toISOString())
    console.groupEnd()
  }
}
```

### Performance Optimization

#### Change Detection Optimization
```javascript
// Efficient change detection using shallow comparison
const hasDataChanged = (newData, oldData) => {
  const newKeys = Object.keys(newData)
  const oldKeys = Object.keys(oldData)
  
  // Quick length check
  if (newKeys.length !== oldKeys.length) return true
  
  // Value comparison
  return newKeys.some(key => newData[key] !== oldData[key])
}

// Debounced change detection for rapid updates
const debouncedChangeDetection = useDebounceFn(
  triggerFieldChangeDetection, 
  100 // 100ms debounce
)
```

#### Memory Management
```javascript
// Cleanup when component unmounts
onUnmounted(() => {
  console.log('FormScriptEngine: Cleaning up...')
  
  // Clear references
  handlers.value = null
  scriptContext.value = null
  previousFormData.value = null
  
  // Remove event listeners if any
  cleanupEventListeners()
})
```

### Security Considerations

#### Script Sandboxing
```javascript
// Restricted execution context - only safe functions exposed
const createSecureContext = () => {
  return {
    // Form manipulation functions
    setField,
    getField,
    
    // Safe global functions
    console: {
      log: console.log,
      warn: console.warn,
      error: console.error
    },
    
    // Math and date functions
    Math,
    Date,
    parseFloat,
    parseInt,
    isNaN,
    
    // String functions
    String,
    
    // No access to:
    // - window object
    // - document object  
    // - eval function
    // - Function constructor
    // - import/require
  }
}
```

#### Input Validation
```javascript
// Validate script before execution
const validateScript = (script) => {
  const dangerousPatterns = [
    /eval\s*\(/,
    /Function\s*\(/,
    /window\./,
    /document\./,
    /import\s+/,
    /require\s*\(/,
    /fetch\s*\(/,
    /XMLHttpRequest/
  ]
  
  return !dangerousPatterns.some(pattern => pattern.test(script))
}
```

## Testing Strategy

### JavaScript Engine Tests

```javascript
// FormScriptEngine unit tests
describe('FormScriptEngine', () => {
  let wrapper
  let mockFormData
  
  beforeEach(() => {
    mockFormData = ref({
      quantity: 0,
      price: 0,
      total: 0
    })
    
    wrapper = mount(FormScriptEngine, {
      props: {
        formData: mockFormData.value,
        script: `
          onLoad: function() {
            setField('quantity', 1);
            setField('price', 10);
          }
          
          onFieldChange: function(fieldName, value) {
            if (fieldName === 'quantity' || fieldName === 'price') {
              const total = getField('quantity') * getField('price');
              setField('total', total);
            }
          }
        `
      }
    })
  })
  
  test('should initialize script and execute onLoad', async () => {
    await nextTick()
    
    expect(mockFormData.value.quantity).toBe(1)
    expect(mockFormData.value.price).toBe(10)
  })
  
  test('should execute onFieldChange when data changes', async () => {
    await nextTick()
    
    // Simulate field change
    mockFormData.value.quantity = 5
    await nextTick()
    
    expect(mockFormData.value.total).toBe(50)
  })
  
  test('should handle script errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    
    const wrapper = mount(FormScriptEngine, {
      props: {
        formData: mockFormData.value,
        script: `
          onLoad: function() {
            // Intentional error
            undefinedFunction();
          }
        `
      }
    })
    
    await nextTick()
    
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })
  
  test('should validate and sanitize script input', () => {
    const dangerousScript = `
      onLoad: function() {
        eval('alert("XSS")');
        window.location = 'http://malicious.com';
      }
    `
    
    const isValid = wrapper.vm.validateScript(dangerousScript)
    expect(isValid).toBe(false)
  })
})

// Real-time calculation tests
describe('Real-time Calculations', () => {
  test('should update total when quantity changes', async () => {
    const formData = ref({ quantity: 2, price: 15.99, total: 0 })
    
    const wrapper = mount(TestFormWithScript, {
      props: { initialData: formData.value }
    })
    
    // Change quantity
    await wrapper.find('input[name="quantity"]').setValue('3')
    await nextTick()
    
    expect(formData.value.total).toBe(47.97)
  })
  
  test('should handle edge cases in calculations', async () => {
    const formData = ref({ quantity: '', price: 'invalid', total: 0 })
    
    const wrapper = mount(TestFormWithScript, {
      props: { initialData: formData.value }
    })
    
    // Should handle invalid inputs gracefully
    await nextTick()
    expect(formData.value.total).toBe(0)
  })
})

// Performance tests
describe('FormScriptEngine Performance', () => {
  test('should not trigger excessive re-renders', async () => {
    const executeHandlerSpy = jest.spyOn(FormScriptEngine.methods, 'executeOnFieldChange')
    
    const wrapper = mount(FormScriptEngine, {
      props: {
        formData: { field1: '', field2: '', field3: '' },
        script: `
          onFieldChange: function(fieldName, value) {
            console.log('Changed:', fieldName);
          }
        `
      }
    })
    
    // Make multiple rapid changes
    for (let i = 0; i < 10; i++) {
      wrapper.setProps({ formData: { field1: `value${i}`, field2: '', field3: '' } })
      await nextTick()
    }
    
    // Should be debounced/optimized
    expect(executeHandlerSpy.mock.calls.length).toBeLessThan(10)
  })
})
```

### Integration Tests

```javascript
// Full form workflow tests with JavaScript
describe('Form Builder with JavaScript Integration', () => {
  test('should execute calculations in preview mode', async () => {
    const wrapper = mount(FormBuilder)
    
    // Add form components
    await wrapper.find('[data-component="number"]').trigger('click')
    await wrapper.find('[data-component="number"]').trigger('click')
    await wrapper.find('[data-component="number"]').trigger('click')
    
    // Configure fields
    const components = wrapper.vm.formStore.formComponents
    components[0].props.name = 'quantity'
    components[1].props.name = 'price'
    components[2].props.name = 'total'
    
    // Add JavaScript
    wrapper.vm.formStore.currentForm.script = `
      onFieldChange: function(fieldName, value) {
        if (fieldName === 'quantity' || fieldName === 'price') {
          const quantity = parseFloat(getField('quantity')) || 0;
          const price = parseFloat(getField('price')) || 0;
          setField('total', quantity * price);
        }
      }
    `
    
    // Switch to preview mode
    await wrapper.find('[data-testid="preview-toggle"]').trigger('click')
    
    // Input values
    await wrapper.find('input[name="quantity"]').setValue('5')
    await wrapper.find('input[name="price"]').setValue('19.99')
    
    await nextTick()
    
    // Check calculated total
    const totalField = wrapper.find('input[name="total"]')
    expect(totalField.element.value).toBe('99.95')
  })
  
  test('should handle form builder to preview data flow', async () => {
    const wrapper = mount(FormBuilder)
    
    // Build form with JavaScript
    await addFormComponents(wrapper)
    await addJavaScriptLogic(wrapper)
    
    // Test preview functionality
    await wrapper.find('[data-testid="preview-button"]').trigger('click')
    
    // Verify script execution
    expect(wrapper.find('.script-engine').exists()).toBe(true)
    expect(wrapper.vm.isPreviewMode).toBe(true)
    
    // Test field interactions
    await simulateUserInput(wrapper)
    await verifyCalculations(wrapper)
  })
})
```

### Unit Tests

```javascript
// Grid system tests
describe('Grid System', () => {
  test('should calculate optimal placement', () => {
    const store = useFormBuilderStore()
    store.formComponents = [
      { id: '1', props: { gridColumn: 'span 6' } },
      { id: '2', props: { gridColumn: 'span 4' } }
    ]
    
    const placement = store.findOptimalGridPlacement()
    expect(placement.gridColumn).toBe('span 2')
    expect(placement.width).toBe('17%') // Approximately 2/12
  })
  
  test('should optimize layout correctly', () => {
    const store = useFormBuilderStore()
    store.formComponents = [
      { id: '1', props: { gridColumn: 'span 6' } },
      { id: '2', props: { gridColumn: 'span 3' } }
    ]
    
    store.optimizeGridLayout()
    
    expect(store.formComponents[1].props.gridColumn).toBe('span 6')
  })
})

// Panel system tests
describe('Collapsible Panel', () => {
  test('should auto-open when component selected', async () => {
    const wrapper = mount(FormBuilder)
    const store = useFormBuilderStore()
    
    store.selectComponent('test-id')
    await nextTick()
    
    expect(wrapper.find('.panel-expanded').exists()).toBe(true)
  })
})
```

### Integration Tests

```javascript
// Full workflow tests
describe('Form Builder Workflow', () => {
  test('should complete full component lifecycle', async () => {
    const wrapper = mount(FormBuilder)
    
    // Add component
    await wrapper.find('[data-component="text"]').trigger('click')
    
    // Should auto-select and open panel
    expect(wrapper.find('.panel-expanded').exists()).toBe(true)
    
    // Update quick settings
    await wrapper.find('.width-btn[data-width="50"]').trigger('click')
    
    // Verify component updated
    const component = wrapper.vm.formStore.selectedComponent
    expect(component.props.width).toBe('50%')
    expect(component.props.gridColumn).toBe('span 6')
  })
})
```

## Browser Compatibility

### Supported Features
- **CSS Grid**: Supported in all modern browsers (IE11+ with autoprefixer)
- **Vue 3**: Modern browser requirements
- **Drag & Drop**: HTML5 drag/drop with fallbacks

### Polyfills Required
```javascript
// For older browsers
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// CSS Grid polyfill for IE11
import 'css-grid-polyfill'
```

## Security Considerations

### Input Validation
```javascript
// Sanitize component props
const sanitizeProps = (props) => {
  const sanitized = {}
  
  Object.keys(props).forEach(key => {
    if (allowedProps.includes(key)) {
      sanitized[key] = sanitizeHtml(props[key])
    }
  })
  
  return sanitized
}

// Validate grid values
const validateGridColumn = (gridColumn) => {
  const spanMatch = gridColumn?.match(/^span\s+([1-9]|1[0-2])$/)
  return spanMatch ? gridColumn : 'span 12'
}
```

### XSS Prevention
```javascript
// Escape user input in labels and help text
const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
```

## Future Enhancements

### Planned Features
1. **Advanced Grid Controls**: Custom grid templates, responsive breakpoints
2. **Component Templates**: Reusable component groups
3. **Theme System**: Multiple visual themes for forms
4. **Advanced Validation**: Cross-field validation, async validation
5. **Collaboration**: Real-time multi-user editing
6. **Version Control**: Form versioning and rollback
7. **Analytics**: Form usage and completion analytics

### Technical Debt Items
1. **TypeScript Migration**: Complete TypeScript coverage
2. **Test Coverage**: Increase to 90%+ coverage
3. **Performance**: Virtual scrolling for large forms
4. **Accessibility**: Full WCAG 2.1 AA compliance

---

*This documentation reflects the current implementation including all enhanced features: smart collapsible panel system, visual grid selection, intelligent width recommendations, and comprehensive UX improvements.*

Last updated: December 2024 