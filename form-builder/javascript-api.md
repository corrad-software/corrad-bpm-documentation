# Form Builder JavaScript API Reference

## Overview

The Form Builder JavaScript API enables developers to create dynamic, interactive forms with real-time calculations, conditional logic, and automated field updates. This API is powered by the FormScriptEngine component that executes JavaScript code safely within form contexts.

## Quick Start

### Basic Form Script Structure

```javascript
// Form initialization - runs once when form loads
onLoad: function() {
    console.log('Form is loading...');
    
    // Set default values
    setField('status', 'new');
    setField('date_created', new Date().toISOString().split('T')[0]);
}

// Field change handler - runs when any field value changes
onFieldChange: function(fieldName, value) {
    console.log('Field changed:', fieldName, '=', value);
    
    // Handle specific field changes
    if (fieldName === 'quantity' || fieldName === 'price') {
        updateTotal();
    }
}

// Helper functions (optional)
function updateTotal() {
    const quantity = getField('quantity') || 0;
    const price = getField('price') || 0;
    const total = quantity * price;
    
    setField('total', total.toFixed(2));
}
```

## Core Functions

### setField(fieldName, value)

Updates a form field value and triggers UI refresh.

**Parameters:**
- `fieldName` (string): The name/ID of the form field to update
- `value` (any): The new value to set for the field

**Returns:** `void`

**Examples:**
```javascript
// Set text field
setField('user_name', 'John Doe');

// Set number field
setField('age', 25);

// Set date field
setField('birth_date', '1999-01-15');

// Set boolean field
setField('is_active', true);

// Set calculated field
setField('total_amount', 149.99);

// Clear field
setField('notes', '');
```

**Notes:**
- Field names are case-sensitive and must match the form field's `name` attribute exactly
- Setting a field value will trigger the `onFieldChange` handler for that field
- Values are automatically converted to appropriate types based on field type

### getField(fieldName)

Retrieves the current value of a form field.

**Parameters:**
- `fieldName` (string): The name/ID of the form field to retrieve

**Returns:** The current field value (type depends on field type)

**Examples:**
```javascript
// Get text field value
const userName = getField('user_name'); // Returns string

// Get number field value with default
const quantity = getField('quantity') || 0; // Returns number or 0

// Get date field value
const birthDate = getField('birth_date'); // Returns string in YYYY-MM-DD format

// Get boolean field value
const isActive = getField('is_active'); // Returns boolean

// Check if field exists and has value
const email = getField('email');
if (email) {
    console.log('Email provided:', email);
}
```

**Notes:**
- Returns `undefined` if field doesn't exist
- Returns empty string `''` for empty text fields
- Returns `false` for unchecked boolean fields
- Use logical OR `||` to provide default values for empty fields

## Event Handlers

### onLoad

Executes once when the form initially loads. Use for initialization, setting default values, and performing initial calculations.

**Signature:**
```javascript
onLoad: function() {
    // Initialization code here
}
```

**Common Use Cases:**
```javascript
onLoad: function() {
    // Set default values
    setField('country', 'United States');
    setField('currency', 'USD');
    setField('created_date', new Date().toISOString().split('T')[0]);
    
    // Initialize calculated fields
    setField('subtotal', 0);
    setField('tax_amount', 0);
    setField('total', 0);
    
    // Set up initial state
    const userRole = getField('user_role');
    if (userRole === 'admin') {
        setField('permissions', 'full_access');
    }
    
    // Perform initial calculations
    calculateTotals();
}
```

### onFieldChange

Executes whenever a user changes any field value. Receives the field name and new value as parameters.

**Signature:**
```javascript
onFieldChange: function(fieldName, value) {
    // Handle field changes here
}
```

**Parameters:**
- `fieldName` (string): Name of the field that changed
- `value` (any): New value of the field

**Common Use Cases:**
```javascript
onFieldChange: function(fieldName, value) {
    console.log('Field updated:', fieldName, '=', value);
    
    // Handle specific fields
    switch(fieldName) {
        case 'quantity':
        case 'unit_price':
            calculateLineTotal();
            break;
            
        case 'country':
            updateTaxRate(value);
            updateShippingOptions(value);
            break;
            
        case 'subscription_type':
            updateFeatures(value);
            break;
            
        case 'birth_date':
            calculateAge(value);
            break;
    }
    
    // Handle multiple related fields
    if (['first_name', 'last_name'].includes(fieldName)) {
        updateFullName();
    }
    
    // Conditional logic
    if (fieldName === 'has_insurance' && value === true) {
        setField('insurance_provider', '');
        setField('policy_number', '');
    }
}
```

## Practical Examples

### Invoice Calculator

```javascript
onLoad: function() {
    // Initialize invoice
    setField('invoice_number', 'INV-' + Date.now());
    setField('invoice_date', new Date().toISOString().split('T')[0]);
    setField('tax_rate', 8.5); // 8.5% default tax
    
    // Initialize line items
    setField('quantity', 1);
    setField('unit_price', 0);
    setField('subtotal', 0);
    setField('tax_amount', 0);
    setField('total', 0);
}

onFieldChange: function(fieldName, value) {
    // Recalculate when quantity, price, or tax rate changes
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

### User Registration with Validation

```javascript
onLoad: function() {
    setField('registration_date', new Date().toISOString().split('T')[0]);
    setField('account_status', 'pending');
}

onFieldChange: function(fieldName, value) {
    // Email validation
    if (fieldName === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailPattern.test(value);
        
        setField('email_valid', isValid);
        setField('email_status', isValid ? 'Valid' : 'Invalid email format');
    }
    
    // Password strength
    if (fieldName === 'password') {
        let strength = 'Weak';
        
        if (value.length >= 8) {
            if (/[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value)) {
                strength = 'Strong';
            } else {
                strength = 'Medium';
            }
        }
        
        setField('password_strength', strength);
    }
    
    // Full name combination
    if (['first_name', 'last_name'].includes(fieldName)) {
        const firstName = getField('first_name') || '';
        const lastName = getField('last_name') || '';
        const fullName = (firstName + ' ' + lastName).trim();
        
        setField('full_name', fullName);
    }
}
```

### E-commerce Order Form

```javascript
onLoad: function() {
    setField('order_date', new Date().toISOString().split('T')[0]);
    setField('shipping_method', 'standard');
    setField('gift_wrap', false);
    
    // Initialize pricing
    updateShipping();
}

onFieldChange: function(fieldName, value) {
    // Product selection
    if (fieldName === 'product') {
        const prices = {
            'laptop': 999.99,
            'mouse': 29.99,
            'keyboard': 79.99,
            'monitor': 299.99
        };
        
        const price = prices[value] || 0;
        setField('unit_price', price);
    }
    
    // Quantity and pricing updates
    if (['quantity', 'unit_price'].includes(fieldName)) {
        const quantity = parseFloat(getField('quantity')) || 0;
        const unitPrice = parseFloat(getField('unit_price')) || 0;
        const itemTotal = quantity * unitPrice;
        
        setField('item_total', itemTotal.toFixed(2));
        updateOrderTotal();
    }
    
    // Shipping calculation
    if (['shipping_method', 'country'].includes(fieldName)) {
        updateShipping();
    }
    
    // Gift wrap fee
    if (fieldName === 'gift_wrap') {
        const giftWrapFee = value ? 9.99 : 0;
        setField('gift_wrap_fee', giftWrapFee.toFixed(2));
        updateOrderTotal();
    }
}

function updateShipping() {
    const method = getField('shipping_method');
    const country = getField('country');
    
    let shippingCost = 0;
    
    if (country === 'US') {
        switch(method) {
            case 'standard': shippingCost = 5.99; break;
            case 'express': shippingCost = 14.99; break;
            case 'overnight': shippingCost = 24.99; break;
        }
    } else {
        switch(method) {
            case 'standard': shippingCost = 19.99; break;
            case 'express': shippingCost = 39.99; break;
        }
    }
    
    setField('shipping_cost', shippingCost.toFixed(2));
    updateOrderTotal();
}

function updateOrderTotal() {
    const itemTotal = parseFloat(getField('item_total')) || 0;
    const shippingCost = parseFloat(getField('shipping_cost')) || 0;
    const giftWrapFee = parseFloat(getField('gift_wrap_fee')) || 0;
    
    const orderTotal = itemTotal + shippingCost + giftWrapFee;
    setField('order_total', orderTotal.toFixed(2));
}
```

### Loan Calculator

```javascript
onLoad: function() {
    // Set default loan parameters
    setField('loan_amount', 100000);
    setField('interest_rate', 4.5);
    setField('loan_term_years', 30);
    
    // Calculate initial payment
    calculateLoanPayment();
}

onFieldChange: function(fieldName, value) {
    if (['loan_amount', 'interest_rate', 'loan_term_years'].includes(fieldName)) {
        calculateLoanPayment();
    }
}

function calculateLoanPayment() {
    const principal = parseFloat(getField('loan_amount')) || 0;
    const annualRate = parseFloat(getField('interest_rate')) || 0;
    const years = parseFloat(getField('loan_term_years')) || 0;
    
    if (principal > 0 && annualRate > 0 && years > 0) {
        const monthlyRate = (annualRate / 100) / 12;
        const numberOfPayments = years * 12;
        
        const monthlyPayment = principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        const totalPayments = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayments - principal;
        
        setField('monthly_payment', monthlyPayment.toFixed(2));
        setField('total_payments', totalPayments.toFixed(2));
        setField('total_interest', totalInterest.toFixed(2));
    } else {
        setField('monthly_payment', '0.00');
        setField('total_payments', '0.00');
        setField('total_interest', '0.00');
    }
}
```

## Available Global Objects

### Math Object
Full JavaScript Math object with all methods:

```javascript
// Common math operations
const rounded = Math.round(getField('price') * 1.1);
const randomId = Math.floor(Math.random() * 1000000);
const maxValue = Math.max(getField('value1'), getField('value2'));

// Advanced math
const power = Math.pow(getField('base'), getField('exponent'));
const squareRoot = Math.sqrt(getField('area'));
```

### Date Object
Full JavaScript Date object for date/time operations:

```javascript
// Current date/time
const now = new Date();
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// Date calculations
const birthDate = new Date(getField('birth_date'));
const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

// Date formatting
const formatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});
```

### String Methods
Standard JavaScript string methods:

```javascript
// String manipulation
const name = getField('user_name').toUpperCase();
const initials = getField('first_name').charAt(0) + getField('last_name').charAt(0);
const slug = getField('title').toLowerCase().replace(/\s+/g, '-');
```

### Number Parsing
Standard parsing functions:

```javascript
// Parse numbers
const quantity = parseInt(getField('quantity_str')) || 0;
const price = parseFloat(getField('price_str')) || 0.0;

// Validation
const isValidNumber = !isNaN(parseFloat(getField('amount')));
```

### Console Logging
Console object for debugging:

```javascript
// Debug logging
console.log('Processing field:', fieldName, 'with value:', value);
console.warn('Invalid input detected:', value);
console.error('Calculation failed:', error);

// Grouped logging
console.group('Order Calculation');
console.log('Subtotal:', subtotal);
console.log('Tax:', tax);
console.log('Total:', total);
console.groupEnd();
```

## Best Practices

### Error Handling
```javascript
onFieldChange: function(fieldName, value) {
    try {
        if (fieldName === 'price') {
            const price = parseFloat(value);
            
            if (isNaN(price)) {
                console.warn('Invalid price value:', value);
                setField('price_error', 'Please enter a valid number');
                return;
            }
            
            if (price < 0) {
                console.warn('Negative price not allowed:', price);
                setField('price_error', 'Price cannot be negative');
                return;
            }
            
            // Clear error and proceed
            setField('price_error', '');
            calculateTotal(price);
        }
    } catch (error) {
        console.error('Error processing field change:', error);
    }
}
```

### Performance Optimization
```javascript
// Cache calculations
let cachedTaxRate = null;

function getTaxRate(country) {
    if (cachedTaxRate === null) {
        const rates = {
            'US': 8.5,
            'CA': 12.0,
            'UK': 20.0
        };
        cachedTaxRate = rates[country] || 0;
    }
    return cachedTaxRate;
}

// Minimize calculations
onFieldChange: function(fieldName, value) {
    // Only calculate when relevant fields change
    if (['quantity', 'price', 'tax_rate'].includes(fieldName)) {
        // Batch related calculations
        updateAllTotals();
    }
    
    // Avoid recalculating if value hasn't actually changed
    const currentTotal = getField('total');
    const newTotal = calculateNewTotal();
    
    if (currentTotal !== newTotal) {
        setField('total', newTotal);
    }
}
```

### Data Validation
```javascript
// Validation helper functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
}

function validateCreditCard(number) {
    // Luhn algorithm
    const digits = number.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Use in field change handler
onFieldChange: function(fieldName, value) {
    if (fieldName === 'email') {
        const valid = isValidEmail(value);
        setField('email_valid', valid);
        setField('email_message', valid ? 'Valid email' : 'Invalid email format');
    }
}
```

## Common Patterns

### Conditional Field Display
```javascript
// Simulate showing/hiding fields by setting values
onFieldChange: function(fieldName, value) {
    if (fieldName === 'account_type') {
        if (value === 'business') {
            setField('company_name', '');
            setField('tax_id', '');
            setField('show_business_fields', 'true');
        } else {
            setField('show_business_fields', 'false');
        }
    }
}
```

### Multi-step Calculations
```javascript
// Break complex calculations into steps
function calculateShippingCost() {
    const weight = parseFloat(getField('package_weight')) || 0;
    const distance = parseFloat(getField('shipping_distance')) || 0;
    const method = getField('shipping_method');
    
    // Step 1: Base cost by weight
    let baseCost = 0;
    if (weight <= 1) baseCost = 5.99;
    else if (weight <= 5) baseCost = 12.99;
    else baseCost = 5.99 + (weight - 1) * 2.50;
    
    // Step 2: Distance multiplier
    let distanceMultiplier = 1;
    if (distance > 500) distanceMultiplier = 1.5;
    else if (distance > 100) distanceMultiplier = 1.2;
    
    // Step 3: Method adjustment
    let methodMultiplier = 1;
    switch(method) {
        case 'express': methodMultiplier = 2; break;
        case 'overnight': methodMultiplier = 3; break;
    }
    
    // Final calculation
    const finalCost = baseCost * distanceMultiplier * methodMultiplier;
    
    setField('shipping_cost', finalCost.toFixed(2));
    setField('shipping_breakdown', `Base: $${baseCost} × Distance: ${distanceMultiplier} × Method: ${methodMultiplier}`);
}
```

### Form State Management
```javascript
onLoad: function() {
    // Initialize form state
    setField('form_state', 'initialized');
    setField('validation_errors', '');
    setField('completion_percentage', 0);
}

onFieldChange: function(fieldName, value) {
    // Update completion percentage
    updateCompletionPercentage();
    
    // Track form state
    setField('form_state', 'editing');
    setField('last_modified', new Date().toISOString());
}

function updateCompletionPercentage() {
    const requiredFields = ['first_name', 'last_name', 'email', 'phone'];
    let completedFields = 0;
    
    requiredFields.forEach(field => {
        if (getField(field) && getField(field).trim() !== '') {
            completedFields++;
        }
    });
    
    const percentage = Math.round((completedFields / requiredFields.length) * 100);
    setField('completion_percentage', percentage);
}
```

## Debugging and Troubleshooting

### Common Issues

**1. Field names don't match**
```javascript
// ❌ Wrong - case sensitive
setField('User_Name', 'John'); // Field is actually 'user_name'

// ✅ Correct
setField('user_name', 'John');
```

**2. Missing error handling**
```javascript
// ❌ Without error handling
const price = parseFloat(getField('price'));
const total = price * quantity; // Will fail if price is invalid

// ✅ With error handling
const price = parseFloat(getField('price')) || 0;
const quantity = parseFloat(getField('quantity')) || 0;
const total = price * quantity;
```

**3. Infinite loops in onFieldChange**
```javascript
// ❌ Can cause infinite loop
onFieldChange: function(fieldName, value) {
    if (fieldName === 'total') {
        setField('total', value * 1.1); // This will trigger onFieldChange again!
    }
}

// ✅ Avoid triggering changes for calculated fields
onFieldChange: function(fieldName, value) {
    if (fieldName === 'quantity' || fieldName === 'price') {
        const total = getField('quantity') * getField('price');
        setField('total', total); // Only update when input fields change
    }
}
```

### Debug Techniques

```javascript
// Enable detailed logging
onFieldChange: function(fieldName, value) {
    console.group(`Field Change: ${fieldName}`);
    console.log('New Value:', value);
    console.log('Current Form Data:', {
        quantity: getField('quantity'),
        price: getField('price'),
        total: getField('total')
    });
    
    // Your calculation logic here
    
    console.groupEnd();
}

// Add validation checkpoints
function calculateTotal() {
    const quantity = getField('quantity');
    const price = getField('price');
    
    console.log('Calculation inputs:', { quantity, price });
    
    if (isNaN(quantity) || isNaN(price)) {
        console.error('Invalid inputs for calculation');
        return;
    }
    
    const total = quantity * price;
    console.log('Calculated total:', total);
    
    setField('total', total.toFixed(2));
}
```

---

*This API reference covers all available JavaScript functionality in the Form Builder. For implementation examples and integration details, see the [Technical Guide](technical-guide.md) and [User Guide](user-guide.md).*

Last updated: December 2024 