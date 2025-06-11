# Process Builder Documentation

## Overview

The Process Builder is a visual workflow designer that allows you to create, edit, and manage business processes using the BPMN (Business Process Model and Notation) standard. With an intuitive drag-and-drop interface, you can design complex workflows that model your organization's business processes.

## Recent Updates (December 2024)

### New Features & Improvements

#### **Direct Process Linking**
- **URL Parameters**: Access specific processes directly via `/process-builder?id={process-id}`
- **Bookmarkable Links**: Share and bookmark direct links to processes
- **Navigation Integration**: Seamless navigation from process management to builder
- **Error Handling**: Graceful fallback for invalid or missing process IDs

#### **Enhanced Save & Navigation**
- **Success Notifications**: Toast messages confirm successful saves and operations
- **Smart Navigation**: Automatic URL updates when creating or editing processes
- **Unsaved Changes Detection**: Improved modal that correctly detects when changes are saved
- **Loading States**: Visual feedback during save, load, and navigation operations

#### **Database Integration**
- **Persistent Storage**: All processes now saved to database with comprehensive API
- **Real-time Sync**: Changes automatically persisted with proper error handling
- **Backup Compatibility**: Legacy process definitions automatically upgraded
- **Data Validation**: Robust validation ensures data integrity

#### **Connection System Fixes**
- **Reliable Dragging**: Fixed issue with connector dragging between nodes
- **Performance Optimized**: Reduced interference with Vue Flow's internal operations
- **Smooth Interactions**: Improved responsiveness during node manipulation
- **Connection Feedback**: Better visual feedback during connection creation

#### **Process Management Consistency**
- **Unified Design**: Process and form management pages now share consistent UI
- **Search & Filter**: Enhanced search functionality across all management interfaces
- **Action Buttons**: Standardized edit, duplicate, and delete operations
- **Loading States**: Consistent loading indicators and error handling

## Getting Started

### Accessing the Process Builder
1. Navigate to `/process-builder` in your browser
2. You'll see a three-panel interface:
   - Left: Component Palette
   - Middle: Process Canvas
   - Right: Properties Panel

### Quick Start Guide
1. **Create a New Process**
   - Click "New Process" in the header
   - Enter a process name and description
   - Start adding components

2. **Add Process Elements**
   - Drag components from the left panel onto the canvas
   - Components include Start/End events, Tasks, Gateways, etc.
   - Connect elements by dragging from one node's handle to another
   - Handles appear when hovering over nodes:
     - Top handle: Input connection point
     - Bottom handle: Output connection point

3. **Configure Elements**
   - Click any element in the canvas to select it
   - Use the right panel to configure its properties
   - Changes are previewed in real-time

4. **Save and Deploy**
   - Click "Save Process" to store your changes
   - Once ready, you can deploy the process for execution

## Process Components

### Events
Events represent something that happens during the course of a process:

- **Start Event** (Green Icon)
  - Indicates where a process begins
  - Only has output handle (bottom)
  - Properties: Description, triggers

- **End Event** (Red Icon)
  - Indicates where a process path ends
  - Only has input handle (top)
  - Properties: Description, result types

### Activities
Activities represent work performed in a process:

- **Task** (Blue Icon)
  - A simple atomic activity within the process
  - Has both input and output handles
  - Properties: Assignee, description

- **Form Task** (Emerald Icon)
  - A task that requires form data
  - Has 4 connection points: top, bottom, left, right handles
  - **Enhanced Configuration**: Complete 3-step configuration workflow
  - **Step 1 - Form Selection**: Choose existing forms or create new ones
  - **Step 2 - Data Mapping**: Configure bidirectional data flow
    - **Input Mappings**: Map process variables to pre-fill form fields
    - **Output Mappings**: Capture form submission data in process variables
  - **Step 3 - Field Conditions**: Dynamic field behavior based on process state
    - Make fields readonly, hidden, required, or optional
    - Support for complex conditional logic with multiple operators
    - Real-time form adaptations based on process variables
  - Connects to forms created in the Form Builder
  - Visualizes bidirectional data flow with color-coded mapping sections

- **API Task** (Indigo Icon)
  - Automated task that makes API calls
  - Has both input and output handles
  - Step-by-step configuration workflow
  - Properties: Endpoint, method, headers, request/response mapping

- **Business Rule Task** (Purple Icon)
  - Executes custom business rules and logic
  - Has both input and output handles
  - Step-by-step configuration workflow
  - Properties: Rule conditions, actions, and variables

- **Script Task** (Grey Icon)
  - Automated task that executes code
  - Has both input and output handles
  - Properties: Language, description, script content

### Gateways
Decision points control flow divergence and convergence:

- **Decision Point** (Orange Diamond Icon)
  - Creates alternative paths based on conditions
  - Has both input and output handles
  - Shows the number of configured paths in a badge
  - Displays path names within the diamond
  - Enhanced configuration with visual flow indicators
  - Properties: Conditions, default path, description
  - Connection labels automatically match condition paths

## Node Configuration UI

All node configuration components follow a consistent design pattern for improved usability:

### Common UI Elements
- **Modal Headers**: Clear titles with descriptive text and appropriate icons
- **Step Indicators**: Numbered workflow steps for complex configurations
- **Quick Reference**: Help text and examples for common use cases
- **Color-Coding**: Consistent color themes for each node type
  - Purple for Business Rules
  - Indigo for API Tasks
  - Emerald for Form Tasks
  - Blue for Variables

### Form Task Configuration
1. **Form Selection**: Choose from available forms or create a new one
2. **Data Mapping**: Bidirectional mapping between process variables and form fields
3. **Options**: Configure submission behavior and user experience

### Business Rule Configuration
1. **Rule Definition**: Create conditions based on process variables
2. **Actions**: Define what happens when conditions are met
3. **Testing**: Validate rules against sample data

### API Task Configuration
1. **Endpoint Definition**: Configure API URL, method, and authentication
2. **Request Mapping**: Map process variables to API request parameters
3. **Response Mapping**: Extract data from API responses into process variables

### Decision Point Configuration
1. **Path Creation**: Add multiple decision paths
2. **Condition Building**: Create boolean conditions for each path
3. **Default Path**: Configure fallback path when no conditions are met

## Working with Variables

The Variable Manager provides a central location to define and manage global process variables:

- **Variable Types**: String, Int, Decimal, Object, DateTime, Date, Boolean
- **Search**: Quickly find variables with the search functionality
- **Organization**: Variables displayed in cards with type indicators
- **Editing**: Easily edit or delete variables as needed
- **Empty State**: Clear guidance when no variables exist

## Working with the Process Canvas

### Navigation
- **Pan**: Click and drag the canvas background or use middle mouse button
- **Zoom**: Use mouse wheel or zoom controls in top-right
- **Reset View**: Use the fit-view button in controls

### Element Manipulation
- **Select**: Click on an element
- **Multi-select**: Hold Shift while clicking elements
- **Move**: Drag selected elements
- **Delete**: Press Delete key, double-click element, or use the Delete button in the properties panel
- **Connect**: Drag from one node's handle to another's

### Keyboard Shortcuts
- **Delete**: Remove selected elements
- **Shift**: Enable node selection
- **Control**: Multi-select nodes

### Connection Points
All nodes now feature **4 connection points** for maximum flexibility:
- **Top Handle**: Primary input connection point
- **Right Handle**: Secondary output connection point  
- **Bottom Handle**: Primary output connection point
- **Left Handle**: Secondary input connection point

**Special Cases**:
- **Start Nodes**: Only have output handles (right + bottom)
- **End Nodes**: Only have input handles (top + left)

**Enhanced Visibility**:
- Handles are invisible by default for clean appearance
- Handles become visible when hovering over nodes
- Handles are highlighted during connection mode
- Color-coded: Green for outputs, Blue for inputs
- Smooth transitions and hover effects for better user experience

**Creating Connections**:
1. Hover over a node to reveal handles
2. Click and drag from any handle
3. Drop on another node's compatible handle
4. Connection automatically routes to prevent overlaps
5. Use specific handles to control connection positioning

## Process Properties

### Basic Settings
- Process name and description
- Version information
- Start conditions
- Process timeouts

### Variables
- Process data variables
- Input and output parameters
- Data types and validation

### Participants
- User assignments
- Role-based assignments
- Group assignments

## Process Settings

The Process Settings feature provides comprehensive configuration options for managing all aspects of your business process. Access Process Settings through the dropdown menu in the header by clicking the three-dot menu and selecting "Process Settings".

### Accessing Process Settings

1. **From the Header Menu**
   - Click the three-dot menu (⋮) in the top-right of the Process Builder
   - Select "Process Settings" from the dropdown menu
   - The settings modal opens with tabbed configuration options

2. **When to Use Process Settings**
   - Configure process metadata and ownership
   - Set execution parameters and timeouts
   - Define data persistence and security policies
   - Manage permissions and access control
   - Export process configuration for integration

### Settings Tabs Overview

The Process Settings modal is organized into five comprehensive tabs:

#### 1. Process Info Tab 📋

Configure basic process information and ownership:

**Process Details**:
- **Process Name**: The display name for your process
- **Process Description**: Detailed description of what the process accomplishes
- **Priority Level**: Set process priority (Low, Normal, High, Critical)
- **Process Category**: Department or functional area (e.g., HR, Finance, Operations)
- **Owner/Manager**: Person responsible for the process

**Best Practices**:
- Use descriptive names that clearly indicate the process purpose
- Include business context in descriptions
- Set appropriate priority levels to help with resource allocation
- Assign clear ownership for accountability

#### 2. Execution Settings Tab ⚙️

Control how your process executes and handles different scenarios:

**Process Type Configuration**:
- **Standard Process**: Regular business workflow
- **Approval Workflow**: Multi-step approval process
- **Data Collection**: Information gathering process
- **Automated Task**: System-driven automation
- **Review Process**: Quality assurance or compliance review

**Timing and Performance**:
- **Max Execution Time**: Maximum time allowed for process completion (1-10,080 minutes)
- **Auto-Timeout**: Automatically timeout after specified hours (1-168 hours)
- **Allow Parallel Execution**: Enable multiple instances to run simultaneously
- **Enable Error Recovery**: Automatically retry failed steps before stopping

**Notifications**:
- **Send Completion Notifications**: Notify stakeholders when process completes

**Example Configuration**:
```
Process Type: Approval Workflow
Max Execution Time: 480 minutes (8 hours)
Auto-Timeout: 72 hours (3 days)
Parallel Execution: Enabled
Error Recovery: Enabled
Notifications: Enabled
```

#### 3. Variables & Data Tab 🗄️

Configure data handling and variable persistence:

**Data Persistence Options**:
- **Session Only**: Data deleted when session ends
- **Temporary (24 hours)**: Data retained for 24 hours
- **Short Term (7 days)**: Data retained for one week
- **Long Term (30 days)**: Data retained for one month
- **Permanent**: Data retained indefinitely

**Security and Compliance**:
- **Log Variable Changes**: Track all variable modifications during execution
- **Encrypt Sensitive Data**: Automatically encrypt variables marked as sensitive
- **Data Retention Policy**: Custom policy description for compliance requirements

**Best Practices**:
- Choose appropriate persistence based on business and legal requirements
- Enable variable change logging for audit trails
- Document retention policies clearly for compliance
- Consider data privacy regulations (GDPR, CCPA) when setting retention

#### 4. Permissions Tab 🔒

Define access control and security settings:

**Execution Permissions**:
- **Anyone**: Public access (use with caution)
- **Authenticated Users**: Any logged-in user
- **Specific Roles**: Define custom role-based access
- **Process Managers Only**: Restrict to process managers
- **Administrators Only**: Admin-only access

**Modification Permissions**:
- **Process Owner Only**: Original creator only
- **Process Managers**: Designated process managers
- **Administrators**: System administrators
- **Anyone with Edit Rights**: Users with edit permissions

**Advanced Security**:
- **Require Approval for Changes**: Changes must be approved before taking effect
- **Enable Audit Trail**: Detailed logs of all access and modifications

**Role-Based Configuration Example**:
```
Execution Permission: Specific Roles
Allowed Roles: hr_manager, hr_admin, department_head
Modification Permission: Process Managers
Require Approval: Enabled
Audit Trail: Enabled
```

#### 5. JSON Export Tab 📊

Export complete process configuration for developers and system integration:

**Export Features**:
- **Process Metadata**: Complete process information and settings
- **Workflow Structure**: All nodes and edges with their configurations
- **Variables**: All process variables and their definitions
- **Permissions**: Access control and security settings
- **Timestamps**: Creation and modification dates

**Export Options**:
- **Copy to Clipboard**: Quick copy for immediate use
- **Download JSON**: Save complete configuration file
- **Developer Integration**: Use exported JSON for API integration or backup

**Export Data Structure**:
```json
{
  "processInfo": {
    "id": "process-uuid",
    "name": "Customer Onboarding",
    "description": "Complete customer onboarding workflow",
    "priority": "high",
    "category": "Sales",
    "owner": "Sales Manager"
  },
  "settings": {
    "processType": "approval",
    "maxExecutionTime": 480,
    "allowParallel": true,
    "enableErrorRecovery": true
  },
  "workflow": {
    "nodes": [...],
    "edges": [...]
  },
  "variables": {...},
  "permissions": {...},
  "metadata": {
    "exportedAt": "2024-12-20T10:30:00Z"
  }
}
```

### Common Process Settings Scenarios

#### Scenario 1: HR Onboarding Process
```
Process Type: Standard Process
Priority: High
Max Execution Time: 1440 minutes (24 hours)
Data Persistence: Long Term (30 days)
Execution Permission: HR Managers
Audit Trail: Enabled
```

#### Scenario 2: Financial Approval Workflow
```
Process Type: Approval Workflow
Priority: Critical
Auto-Timeout: 48 hours
Data Persistence: Permanent
Execution Permission: Finance Team
Require Approval: Enabled for changes
```

#### Scenario 3: Customer Support Automation
```
Process Type: Automated Task
Priority: Normal
Parallel Execution: Enabled
Data Persistence: Short Term (7 days)
Execution Permission: Support Staff
Error Recovery: Enabled
```

### Process Settings Best Practices

#### Planning and Design
1. **Define Clear Ownership**
   - Assign process owners for accountability
   - Document roles and responsibilities
   - Regular review and updates

2. **Set Appropriate Permissions**
   - Follow principle of least privilege
   - Use role-based access control
   - Regular permission audits

3. **Configure Realistic Timeouts**
   - Consider business requirements
   - Account for user availability
   - Set appropriate escalation procedures

#### Data Management
1. **Choose Appropriate Persistence**
   - Balance performance with compliance needs
   - Consider storage costs
   - Document retention policies

2. **Implement Security Measures**
   - Enable audit trails for sensitive processes
   - Use encryption for PII data
   - Regular security reviews

#### Monitoring and Maintenance
1. **Regular Settings Review**
   - Quarterly configuration reviews
   - Update settings as requirements change
   - Monitor performance and adjust timeouts

2. **Documentation Updates**
   - Keep process descriptions current
   - Document any changes made
   - Maintain version history

### Troubleshooting Process Settings

#### Common Issues
1. **Settings Not Saving**
   - Verify all required fields are completed
   - Check permission levels
   - Ensure network connectivity

2. **Permission Errors**
   - Verify user roles and permissions
   - Check with administrator if needed
   - Review audit trail for access attempts

3. **Export/Import Issues**
   - Validate JSON format
   - Check file size limits
   - Verify browser clipboard permissions

#### Getting Help
- Review error messages for specific guidance
- Check the audit trail for permission issues
- Contact administrators for role-related problems
- Use the JSON export for debugging configuration issues

## Advanced Form Integration

The Process Builder features sophisticated integration with the Form Builder, enabling complex data flows and dynamic form behavior.

### Adding and Configuring Form Tasks

1. **Adding a Form Task**
   - Drag a Form Task component (emerald icon) onto the canvas
   - Connect it to your process flow using the 4-point connection system
   - Click "Configure Form Task" to open the configuration modal

2. **Step 1: Form Selection**
   - **Choose Existing Form**: Browse and select from available forms
   - **Form Preview**: See form structure and field details
   - **Create New Form**: Direct integration with Form Builder
   - The selected form determines available fields for mapping

3. **Step 2: Form Data Mapping**
   Configure bidirectional data flow between your process and the form:

   **Input Variables (Process → Form)**
   - Map process variables to pre-fill form fields
   - Users see pre-populated data when the form loads
   - Useful for displaying existing customer data, calculated values, or previous submissions
   - Example: Map `customer.email` process variable to "Email Address" form field

   **Output Variables (Form → Process)**
   - Capture form submission data in process variables
   - Create new variables automatically from form fields
   - Use captured data in subsequent process steps
   - Example: Map "Order Total" form field to `order.total` process variable

4. **Step 3: Field Conditions**
   Create dynamic form behavior based on process state:

   **Condition Components**:
   - **Process Variable**: The variable to evaluate
   - **Operator**: Comparison type (equals, not equals, greater than, etc.)
   - **Value**: Comparison value (when applicable)
   - **Target Field**: The form field to control
   - **Action**: What to do when condition is met

   **Available Actions**:
   - **Make Readonly**: Field displays value but cannot be edited
   - **Hide Field**: Field is completely hidden from user
   - **Make Required**: Field becomes mandatory for submission
   - **Make Optional**: Field becomes optional
   - **Show Field**: Field becomes visible (opposite of hide)
   - **Enable Field**: Field becomes editable (opposite of readonly)

   **Operators**:
   - **Equals/Not Equals**: Exact value comparison
   - **Is True/Is False**: Boolean value checks
   - **Is Empty/Is Not Empty**: Check for presence of data
   - **Contains**: Text substring matching
   - **Greater Than/Less Than**: Numeric comparisons

### Example Use Cases

**Customer Onboarding Process**:
```
Input Mapping: 
- customer.type → "Customer Type" field (pre-select existing customers)

Output Mapping:
- "Company Name" field → customer.company
- "Industry" field → customer.industry

Field Conditions:
- IF customer.type = "Existing" THEN "Company Name" = Readonly
- IF customer.type = "Enterprise" THEN "Dedicated Rep" = Required
```

**Expense Approval Process**:
```
Input Mapping:
- employee.name → "Employee Name" field
- expense.amount → "Amount" field

Output Mapping:
- "Justification" field → expense.justification
- "Manager Approval" field → expense.approved

Field Conditions:
- IF expense.amount > 1000 THEN "Manager Approval" = Required
- IF employee.level = "Executive" THEN "Amount" = Readonly
```

**Support Ticket Process**:
```
Input Mapping:
- ticket.priority → "Priority" field
- customer.tier → "Customer Tier" field

Output Mapping:
- "Resolution" field → ticket.resolution
- "Satisfaction Rating" field → ticket.rating

Field Conditions:
- IF customer.tier = "Premium" THEN "Priority" = Readonly AND "Escalation" = Show
- IF ticket.priority = "Critical" THEN "Manager Review" = Required
```

### Best Practices for Form Integration

1. **Data Flow Planning**
   - Map the complete data journey from process start to end
   - Identify which data needs to be captured vs. displayed
   - Plan for data validation and transformation needs

2. **Variable Naming**
   - Use consistent, descriptive variable names
   - Follow a naming convention (e.g., `customer.email`, `order.total`)
   - Create variables in the Variable Manager before mapping

3. **Field Condition Design**
   - Start with simple conditions and build complexity gradually
   - Test conditions with various scenarios
   - Document complex logic for future maintenance

4. **User Experience**
   - Pre-fill forms whenever possible to reduce user effort
   - Use conditional logic to show only relevant fields
   - Provide clear feedback when fields become readonly or required

5. **Performance Considerations**
   - Avoid excessive field conditions that could slow form rendering
   - Test forms with realistic data volumes
   - Consider caching for frequently accessed reference data

## Best Practices

### Process Design
1. Start with a Start event and end with End event(s)
2. Use clear, descriptive labels for all elements
3. Connect nodes in a logical flow
4. Use gateways to manage decision points
5. Keep the process layout organized and clear

### Flow Control
1. Ensure all paths lead to an End event
2. Validate connections make logical sense
3. Use appropriate node types for each step
4. Consider the process flow direction (typically top to bottom)

### Visual Organization
1. Maintain consistent spacing between nodes
2. Align nodes for better readability
3. Use the auto-arrange feature when available
4. Keep related elements grouped together

## Troubleshooting

### Common Issues
1. **Can't Create Connection**
   - Verify you're dragging from a handle
   - Check that source and target are compatible
   - Ensure you're connecting to a handle, not the node body

2. **Node Won't Delete**
   - Make sure the node is selected
   - Try using the Delete key
   - Use the Delete button in the properties panel
   - Double-click the node to remove it

3. **Connection Looks Wrong**
   - Try repositioning nodes for better flow
   - Check that connections are made to correct handles
   - Consider using different connection types

4. **Form Not Showing in Selector**
   - Verify the form was saved in the Form Builder
   - Check that you have permission to access the form
   - Refresh the page to update the form list

### Getting Help
- Use the control panel hints in top-right
- Review this documentation
- Contact support team for additional assistance

---

For technical details about implementation and integration, please refer to the [Process Builder Technical Documentation](technical-guide.md).

Last updated: December 2024 

## Working with Business Rules

Business Rules allow you to implement conditional logic in your process flows without writing code. They are essential for creating dynamic, data-driven processes.

### Creating Business Rules

To add business rule logic to your process:

1. **Add a Business Rule Node**
   - Drag the Business Rule component (purple icon) from the palette onto the canvas
   - Connect it to the appropriate nodes in your process flow

2. **Configure the Business Rule**
   - Click on the Business Rule node to open its configuration panel
   - Follow the three-step configuration process:

#### Step 1: Select Variables
- Choose which process variables will be used in your rule conditions
- These variables must be defined in the Variable Manager before use
- You can filter and search for variables by name or type
- If you need a new variable, you can create one directly from this screen

#### Step 2: Create Rule Conditions
- Add one or more rules, each with its own set of conditions
- For each condition, specify:
  - The variable to evaluate
  - The operator (equals, not equals, greater than, etc.)
  - The comparison value
- Multiple conditions within a rule are combined with AND logic
- Multiple rules are evaluated independently (OR logic between rules)

#### Step 3: Define Actions
- For each rule, specify the action to take when its conditions are met
- Action types include:
  - Setting variable values
  - Executing predefined functions
  - Triggering process events
- Configure action parameters based on the selected action type
- Actions execute in the order they are defined

### Testing Business Rules

Before saving your business rules, you can test them with sample data:

1. Click the "Test Rules" button at the bottom of the configuration panel
2. Enter test values for each variable used in your conditions
3. See which rules would trigger with the provided values
4. Review the actions that would execute

### Best Practices for Business Rules

1. **Keep Rules Simple**
   - Create multiple simple rules instead of one complex rule
   - Name rules clearly to describe their purpose

2. **Use Consistent Naming**
   - Follow a naming convention for your variables
   - Use descriptive names that indicate the variable's purpose

3. **Document Your Logic**
   - Add descriptions to rules to explain their business purpose
   - Comment on complex conditions to clarify the logic

4. **Test Thoroughly**
   - Validate rules with various test cases
   - Check edge cases and boundary conditions

5. **Consider Performance**
   - Rules are evaluated in the order they appear
   - Place frequently triggered rules at the top for efficiency

### Example Use Cases

Business rules are useful in many scenarios, including:

1. **Customer Segmentation**
   - Route customers to different paths based on attributes like account size or loyalty status

2. **Data Validation**
   - Verify that data meets specific criteria before proceeding

3. **Dynamic Assignment**
   - Assign tasks to different teams based on request category, priority, or workload

4. **Automated Decisions**
   - Automatically approve or reject requests based on predefined criteria

5. **Conditional Notifications**
   - Send notifications only when specific conditions are met 