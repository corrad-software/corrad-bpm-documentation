# Form Builder User Guide

## Overview

The Form Builder is a modern, intuitive drag-and-drop interface for creating dynamic forms. Featuring a smart collapsible settings panel, visual grid system, and intelligent component recommendations, it makes form creation accessible to both developers and non-technical users.

> For technical implementation details, see the [Technical Guide](technical-guide.md)

## Interface Overview

### Three-Panel Layout
- **Left Panel**: Component Library with categorized components
- **Center Panel**: Form Canvas with 12-column grid system
- **Right Panel**: Smart Collapsible Settings Panel

### Key Features
- **Smart Settings Panel**: Auto-opens when components are selected, collapses to save space
- **Visual Grid System**: Intuitive width selection with grid previews
- **Quick Settings**: Inline editing for common properties
- **Smart Recommendations**: Automatic width suggestions based on field type
- **Real-time Preview**: See changes instantly as you build

## Getting Started

### Creating Your First Form

1. **Start Building**
   - Navigate to the Form Builder
   - Click "New Form" or start with a template
   - The interface loads with an empty canvas

2. **Add Components**
   - **Drag & Drop**: Drag any component from the left panel to the canvas
   - **Click to Add**: Click a component to add it at the end of the form
   - **Smart Placement**: Components automatically find optimal grid positions

3. **Configure Components**
   - **Auto-Selection**: Click any component to select it
   - **Quick Settings**: The right panel automatically opens with common settings
   - **Inline Editing**: Edit labels, names, widths, and validation directly
   - **Full Settings**: Click "Full Settings" for advanced configuration

4. **Save & Preview**
   - **Auto-Save**: Changes are saved automatically
   - **Preview Mode**: Toggle to test your form as users will see it
   - **Form Management**: Access all saved forms from the header

## Smart Settings Panel System

### Panel Behavior
- **Auto-Open**: Automatically expands when you select a component
- **Collapsible**: Toggle between expanded (320px) and collapsed (48px) states
- **Quick Access**: Common settings available without opening full modal
- **Context-Aware**: Shows only relevant settings for each component type

### Quick Settings Available
- **Label**: Component display name
- **Field Name**: Internal identifier
- **Width**: S/M/L/XL quick sizing buttons
- **Required**: Toggle validation
- **Placeholder**: Hint text (where applicable)

### Collapsed State Features
- **Component Icon**: Visual indicator of selected component type
- **Type Badge**: Short identifier (TXT, BTN, SEL, etc.)
- **Toggle Button**: One-click expansion
- **Space-Efficient**: Only 48px wide when collapsed

## Enhanced Grid System

### Visual Width Selection
The new grid system replaces technical percentages with intuitive options:

#### Width Options
- **Narrow (25%)**: Small inputs like age, zip codes, short codes
- **Small (33%)**: Short text fields, city names, grouped inputs  
- **Medium (50%)**: Names, phone numbers, paired inputs
- **Wide (75%)**: Addresses, URLs, prominent fields
- **Full (100%)**: Text areas, headings, single-column layouts

#### Visual Grid Preview
- **12-Column Grid**: Mini preview shows exactly which columns your component will occupy
- **Active Columns**: Highlighted squares show component width
- **Current Selection**: Visual feedback shows your current choice
- **Grid Math**: Displays "6 of 12 columns" instead of technical details

### Smart Recommendations
The system automatically suggests optimal widths based on component type:

- **Narrow Recommended**: Number, Date, Time, Color, OTP fields
- **Small Recommended**: Text inputs
- **Medium Recommended**: Email, Phone, Password, Select, Masked inputs
- **Wide Recommended**: URL, File uploads
- **Full Recommended**: Text areas, Headings, Choice groups, Buttons

#### Visual Indicators
- **Green Ring**: Recommended options have green highlighting
- **Selection State**: Current choice highlighted in blue
- **Combined State**: Selected + recommended shows green background

## Component Library

### Basic Inputs
Perfect for collecting simple data:

**Text Field**
- Single-line text input
- Smart width: Small (33%)
  - Use for: Names, titles, short answers
- Quick settings: Label, name, placeholder, required

**Text Area**
- Multi-line text input  
- Smart width: Full (100%)
- Use for: Comments, descriptions, long text
- Features: Resizable, character limits

**Number Field**
- Numeric input with validation
- Smart width: Narrow (25%)
- Use for: Age, quantity, prices
  - Features: Min/max limits, step values

**Email Field**
- Email input with validation
- Smart width: Medium (50%)
- Use for: Contact forms, registration
- Features: Built-in email format validation

**Password Field**
- Secure password input
- Smart width: Medium (50%)
- Use for: Authentication forms
  - Features: Password masking, strength indicators

### Selection Components
For choosing from options:

**Select Dropdown**
- Single selection from options
- Smart width: Medium (50%)
- Use for: Countries, categories, status
- Features: Search, custom values, option groups

**Checkbox Group**
- Multiple selection options
- Smart width: Full (100%)
- Use for: Preferences, multiple choices
- Features: Select all option, layout control

**Radio Group**  
- Single choice from group
- Smart width: Full (100%)
  - Use for: Exclusive choices, yes/no questions
- Features: Button or traditional styles

**Switch Toggle**
- Boolean on/off control
- Smart width: Full (100%)
- Use for: Settings, feature toggles
- Features: Custom labels, default states

### Date & Time Components
For temporal inputs:

**Date Picker**
- Date selection interface
- Smart width: Narrow (25%)
- Use for: Birthdays, deadlines, scheduling
- Features: Date ranges, format options, validation

**Time Picker**
- Time selection interface  
- Smart width: Narrow (25%)
- Use for: Appointments, schedules
- Features: 12/24 hour format, minute intervals

**Date & Time**
- Combined date and time picker
- Smart width: Medium (50%)
- Use for: Event scheduling, timestamps
- Features: Single field for both values

### Advanced Components
Specialized functionality:

**File Upload**
- Standard file input
- Smart width: Wide (75%)
- Use for: Document uploads, attachments
  - Features: File type restrictions, size limits

**File Drop Zone**
- Drag & drop upload area
- Smart width: Wide (75%)
- Use for: Multiple files, intuitive uploads
- Features: Visual feedback, progress indicators

**OTP Input**
- One-time password entry
- Smart width: Narrow (25%)
- Use for: Two-factor authentication
- Features: Auto-focus, numeric only

**Masked Input**
- Formatted text input
- Smart width: Medium (50%)
- Use for: Phone numbers, SSN, custom formats
- Features: Real-time formatting, validation

### Layout Components
Form structure and organization:

**Heading**
- Section titles and organization
- Smart width: Full (100%)
  - Use for: Form sections, categories
- Features: Multiple heading levels (H1-H6)

**Paragraph**
- Descriptive text content
- Smart width: Full (100%)
- Use for: Instructions, explanations
- Features: Rich text formatting options

**Divider**
- Visual section separator
- Smart width: Full (100%)
- Use for: Content organization
- Features: Various visual styles

**Button**
- Action triggers
- Smart width: Full (100%)
- Use for: Form submission, navigation
- Features: Custom styling, click handlers

## Form Configuration Workflows

### Quick Settings Workflow (80% of edits)
1. Click any component to select it
2. Settings panel auto-opens on the right
3. Edit common properties inline:
   - Change label text
   - Adjust field width with S/M/L/XL buttons
   - Toggle required validation
   - Set placeholder text
4. Changes apply immediately

### Full Settings Workflow (20% of edits)
1. Select component in quick settings panel
2. Click "Full Settings" button
3. Access comprehensive modal with:
   - All component properties
   - Advanced validation rules
   - Visual width selector with grid preview
   - Component-specific options
   - Reset to defaults option

### Bulk Operations
- **Duplicate**: Copy component with "Duplicate" button
- **Delete**: Remove component with "Delete" button  
- **Reorder**: Drag components to reposition
- **Multi-select**: Select multiple components for batch operations

## Form Templates & Management

### Template System
- **Blank Form**: Start from scratch
- **Contact Form**: Pre-built contact form
- **Survey Form**: Multi-question survey template
- **Registration Form**: User registration template
- **Custom Templates**: Save your own templates

### Form Management
- **Auto-Save**: Changes saved automatically every 30 seconds
- **Version History**: Track form changes over time
- **Duplicate Forms**: Copy existing forms as starting points
- **Export/Import**: JSON format for form portability
- **Form Library**: Organize forms by category or project

## Process Builder Integration

### Workflow Integration
Forms integrate seamlessly with the Process Builder for automated workflows:

1. **Create Form**: Design your form in Form Builder
2. **Save Form**: Forms must be saved before use in processes  
3. **Add to Process**: Select saved form in Process Builder Form Task
4. **Data Flow**: Form submissions become process variables
5. **Decision Logic**: Use form data in process gateways and conditions

### Advanced Integration Features
- **URL Parameters**: Pre-populate form fields from process variables
- **Conditional Logic**: Show/hide fields based on process state
- **Multi-Step Forms**: Split complex forms across multiple process steps
- **Data Validation**: Cross-reference form data with process requirements

## Best Practices

### Form Design
1. **Start Simple**: Begin with essential fields only
2. **Use Smart Widths**: Trust the width recommendations
3. **Group Related Fields**: Use consistent widths for grouped fields
4. **Logical Flow**: Order fields in a natural sequence
5. **Mobile-First**: Test forms on mobile devices

### Grid Layout Optimization
1. **Mix Widths**: Combine narrow and wide fields effectively
2. **Visual Balance**: Avoid too many full-width fields in sequence  
3. **Logical Grouping**: Use similar widths for related fields
4. **Space Efficiency**: Let the system auto-optimize grid placement

### User Experience
1. **Clear Labels**: Use descriptive, action-oriented labels
2. **Helpful Placeholders**: Provide examples in placeholder text
3. **Progressive Disclosure**: Use sections for complex forms
4. **Validation Feedback**: Set appropriate validation rules
5. **Success States**: Configure clear success messages

### Performance Optimization
1. **Component Limits**: Keep forms under 50 components when possible
2. **Conditional Logic**: Use sparingly to maintain performance
3. **File Uploads**: Set reasonable file size limits
4. **Auto-Save**: Leverage automatic saving features

## Accessibility Features

### Built-in Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Clear focus indicators
- **High Contrast**: Accessible color combinations
- **Touch Targets**: Mobile-friendly touch targets

### Accessibility Best Practices
1. **Descriptive Labels**: Always provide clear field labels
2. **Help Text**: Use help text for complex fields
3. **Error Messages**: Provide clear, actionable error messages
4. **Logical Order**: Ensure tab order follows visual layout
5. **Alternative Text**: Provide alt text for any images

## Troubleshooting

### Common Issues

**Panel Not Opening**
- Ensure component is properly selected
- Check browser console for JavaScript errors
- Refresh page if panel state becomes stuck

**Grid Layout Issues**
- Use the optimize layout feature
- Check for invalid width values
- Reset component to default width

**Components Not Saving**
- Verify internet connection
- Check browser local storage limits
- Try manual save if auto-save fails

**Performance Issues**  
- Reduce number of components
- Simplify conditional logic
   - Clear browser cache

### Getting Help
- **Documentation**: Complete technical guides available
- **Examples**: Sample forms and templates provided
- **Support**: Contact support team for assistance
- **Community**: Join user community forums

## JavaScript & Dynamic Calculations

### Real-time Calculations
The Form Builder supports powerful JavaScript-based calculations that update in real-time as users interact with your forms. This enables dynamic forms with automatic calculations, conditional logic, and interactive behavior.

#### Key Features
- **Real-time Updates**: Calculations execute instantly when users change field values
- **onFieldChange Handlers**: Trigger custom logic when specific fields change
- **setField Function**: Programmatically update field values from JavaScript
- **Cross-field Dependencies**: Create complex relationships between form fields
- **Calculation Templates**: Pre-built templates for common calculation patterns

#### Basic Example
```javascript
// Form with real-time total calculation
onLoad: function() {
    console.log('Form loaded, setting up calculations...');
    
    // Initialize fields
    setField('quantity', 1);
    setField('price', 0);
    setField('total', 0);
}

onFieldChange: function(fieldName, value) {
    console.log('Field changed:', fieldName, '=', value);
    
    if (fieldName === 'quantity' || fieldName === 'price') {
        // Get current values
        const quantity = getField('quantity') || 0;
        const price = getField('price') || 0;
        
        // Calculate and update total
        const total = quantity * price;
        setField('total', total.toFixed(2));
        
        console.log('Updated total:', total);
    }
}
```

### Available JavaScript Functions

#### setField(fieldName, value)
Updates a form field value and triggers the UI to refresh.
```javascript
// Set text field
setField('user_name', 'John Doe');

// Set number field
setField('quantity', 5);

// Set calculated field
setField('total', 99.95);
```

#### getField(fieldName)
Retrieves the current value of a form field.
```javascript
const userName = getField('user_name');
const quantity = getField('quantity') || 0; // Default to 0 if empty
```

#### onLoad Event Handler
Executes when the form first loads. Use for initialization and setting default values.
```javascript
onLoad: function() {
    // Set default values
    setField('country', 'USA');
    setField('currency', 'USD');
    
    // Perform initial calculations
    calculateTotals();
}
```

#### onFieldChange Event Handler
Executes whenever a user changes a field value. Receives fieldName and new value as parameters.
```javascript
onFieldChange: function(fieldName, value) {
    switch(fieldName) {
        case 'quantity':
        case 'price':
            updateTotal();
            break;
            
        case 'country':
            updateShippingOptions(value);
            break;
    }
}
```

### Real-world Examples

#### Invoice Calculator
```javascript
onLoad: function() {
    // Initialize invoice fields
    setField('quantity', 1);
    setField('unit_price', 0);
    setField('tax_rate', 8.5); // 8.5% tax
    setField('subtotal', 0);
    setField('tax_amount', 0);
    setField('total', 0);
}

onFieldChange: function(fieldName, value) {
    if (['quantity', 'unit_price', 'tax_rate'].includes(fieldName)) {
        const quantity = parseFloat(getField('quantity')) || 0;
        const unitPrice = parseFloat(getField('unit_price')) || 0;
        const taxRate = parseFloat(getField('tax_rate')) || 0;
        
        const subtotal = quantity * unitPrice;
        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount;
        
        setField('subtotal', subtotal.toFixed(2));
        setField('tax_amount', taxAmount.toFixed(2));
        setField('total', total.toFixed(2));
    }
}
```

#### Conditional Field Logic
```javascript
onFieldChange: function(fieldName, value) {
    if (fieldName === 'subscription_type') {
        if (value === 'premium') {
            setField('premium_features', 'Available');
            setField('support_level', '24/7 Priority');
        } else {
            setField('premium_features', 'Not Available');
            setField('support_level', 'Standard Business Hours');
        }
    }
}
```

#### Age Calculator
```javascript
onFieldChange: function(fieldName, value) {
    if (fieldName === 'birth_date') {
        const birthDate = new Date(value);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        setField('age', age);
        
        // Set eligibility based on age
        if (age >= 18) {
            setField('eligible', 'Yes');
        } else {
            setField('eligible', 'No');
        }
    }
}
```

### Best Practices for JavaScript Forms

#### Performance Optimization
1. **Minimize Calculations**: Only calculate when necessary fields change
2. **Use Default Values**: Provide fallbacks for empty fields
3. **Debounce Heavy Operations**: For complex calculations, consider debouncing
4. **Cache Results**: Store calculation results when appropriate

#### Error Handling
```javascript
onFieldChange: function(fieldName, value) {
    try {
        if (fieldName === 'price') {
            const price = parseFloat(value);
            if (isNaN(price)) {
                console.warn('Invalid price value:', value);
                return;
            }
            
            // Perform calculation
            calculateTotal(price);
        }
    } catch (error) {
        console.error('Error in field change handler:', error);
    }
}
```

#### Debugging Tips
1. **Use Console Logging**: Add console.log statements to track execution
2. **Check Field Names**: Ensure field names in code match form field names exactly
3. **Validate Data Types**: Always parse and validate input values
4. **Test Edge Cases**: Test with empty values, zero, and negative numbers

### Form Templates with JavaScript

#### CSS & JavaScript Test Form
A comprehensive template demonstrating real-time calculations:

**Field Structure:**
- `user_name` (Text): User's name
- `quantity` (Number): Quantity of items
- `price` (Number): Price per item  
- `total` (Number): Calculated total (read-only)

**JavaScript Logic:**
```javascript
onLoad: function() {
    console.log('Form loaded, initializing...');
    setField('user_name', '');
    setField('quantity', 1);
    setField('price', 0);
    setField('total', 0);
}

onFieldChange: function(fieldName, value) {
    console.log('Field changed:', fieldName, '=', value);
    
    if (fieldName === 'user_name') {
        console.log('User name updated to:', value);
    }
    
    if (fieldName === 'quantity' || fieldName === 'price') {
        const quantity = parseFloat(getField('quantity')) || 0;
        const price = parseFloat(getField('price')) || 0;
        const total = quantity * price;
        
        setField('total', total.toFixed(2));
        console.log('Calculated total:', total);
    }
}
```

### Troubleshooting JavaScript Forms

#### Common Issues

**Calculations Not Updating**
- Verify field names match exactly (case-sensitive)
- Check browser console for JavaScript errors
- Ensure `onFieldChange` handler is properly defined
- Confirm form is in preview mode for testing

**Initial Values Not Setting**
- Make sure `onLoad` handler is defined
- Check that `setField` calls use correct field names
- Verify form data structure in browser developer tools

**Console Errors**
- **"getField/setField is not defined"**: JavaScript engine not properly initialized
- **"Cannot read property"**: Field name doesn't exist or typo in field name
- **"Unexpected token"**: Syntax error in JavaScript code

#### Debugging Workflow
1. **Open Browser Developer Tools** (F12)
2. **Check Console Tab** for error messages
3. **Add Debug Logging**:
   ```javascript
   onFieldChange: function(fieldName, value) {
       console.log('=== Field Change Debug ===');
       console.log('Field:', fieldName);
       console.log('New Value:', value);
       console.log('Current Form Data:', Object.keys(formData));
       
       // Your calculation logic here
   }
   ```
4. **Test in Preview Mode** - JavaScript only executes in preview mode
5. **Verify Field Names** - Use browser inspect element to confirm field name attributes

## Advanced Features

### Custom Components
- **Component Extensions**: Add custom component types
- **Styling Overrides**: Custom CSS for branded forms
- **Validation Rules**: Create custom validation logic
- **Integration Hooks**: Connect to external services

### API Integration
- **Form Data API**: Programmatic access to form submissions
- **Component API**: Dynamically modify form components
- **Validation API**: Custom server-side validation
- **Webhook Support**: Real-time form submission notifications

### Enterprise Features
- **Team Collaboration**: Multi-user form editing
- **Permission Management**: Role-based access control
- **Audit Logging**: Track all form changes
- **White Labeling**: Custom branding options

---

*This documentation reflects all current features including the smart collapsible settings panel, enhanced grid system with visual previews, intelligent width recommendations, and comprehensive UX improvements implemented in the latest version.*

Last updated: December 2024 