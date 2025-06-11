# Form History & Versioning System

## Overview

The form history system provides automatic versioning for all forms, allowing users to view previous versions and restore to any point in time. Every time a user saves a form, the previous version is automatically archived in the `formHistory` table.

## Database Schema

### formHistory Table
- `historyID` - Primary key for the history entry
- `formID` - Foreign key linking to the main form
- `formUUID` - UUID of the form for easy reference
- `formName` - Name of the form at the time of save
- `formDescription` - Description at the time of save
- `formComponents` - JSON of all form components at the time of save
- `formStatus` - Status (active/inactive) at the time of save
- `customCSS` - Custom CSS code at the time of save
- `customScript` - Custom JavaScript code at the time of save
- `formEvents` - Form events configuration at the time of save
- `scriptMode` - Script execution mode (safe/advanced) at the time of save
- `versionNumber` - Sequential version number (1, 2, 3...)
- `changeDescription` - Optional description of changes made
- `savedBy` - User ID who saved this version
- `savedDate` - Timestamp when this version was saved

## How It Works

### Automatic Versioning
1. When a user clicks "Save" on a form
2. The system first retrieves the current form data
3. The current form data is saved to `formHistory` with the next sequential version number
4. The form is then updated with the new data
5. Each save creates a complete snapshot of the form state

### Version Management
- **Version Numbers**: Sequential integers starting from 1
- **Change Descriptions**: Optional descriptions that can be added when saving
- **User Tracking**: Each version records who made the changes
- **Complete Snapshots**: Each version contains all form data, not just changes

## API Endpoints

### Get Form History
```
GET /api/forms/{formId}/history
```
Returns all versions of a form with metadata.

### Get Specific Version
```
GET /api/forms/{formId}/version/{versionId}
```
Returns details of a specific version. `versionId` can be either the `historyID` or `versionNumber`.

### Restore Version
```
POST /api/forms/{formId}/restore
```
Body:
```json
{
  "versionNumber": 5,
  "restoredBy": 1,
  "changeDescription": "Restored to working version"
}
```

## Frontend Features

### History Modal
- **Version List**: Shows all versions with timestamps and change descriptions
- **Preview**: Users can preview any version before restoring
- **Restore**: One-click restore to any previous version
- **User Information**: Shows who made each change

### History Button
- Appears in the form builder header next to "Templates"
- Only visible for saved forms (not new forms)
- Opens the history modal for the current form

## Store Functions

### Form Builder Store Methods
- `getFormHistory(formId)` - Get all versions of a form
- `getFormVersion(formId, versionId)` - Get specific version details
- `restoreFormVersion(formId, versionData)` - Restore to a specific version
- `loadFormVersionPreview(formId, versionId)` - Load version for preview only
- `setChangeDescription(description)` - Set description for next save

## Usage Examples

### Basic Save with Description
```javascript
// Set optional change description
formStore.setChangeDescription("Added validation to email field");

// Save form (automatically creates history entry)
await formStore.saveForm();
```

### View Form History
```javascript
const history = await formStore.getFormHistory(formId);
console.log(`Form has ${history.totalVersions} versions`);
```

### Restore to Previous Version
```javascript
const versionToRestore = history.history[2]; // Version 3
await formStore.restoreFormVersion(formId, versionToRestore, "Reverted problematic changes");
```

## Benefits

1. **Never Lose Data**: Every form state is preserved
2. **Easy Rollback**: One-click restore to any previous version
3. **Change Tracking**: See who made changes and when
4. **Preview Before Restore**: View any version before making it current
5. **Audit Trail**: Complete history of all form modifications

## Implementation Notes

- **Storage Efficiency**: Each version stores complete form data for simplicity and reliability
- **Cascade Deletion**: When a form is deleted, all its history is automatically removed
- **Foreign Key Constraints**: Ensures data integrity between forms and history
- **Indexing**: Optimized for fast lookups by form, date, and UUID

## Future Enhancements

- **Diff View**: Show differences between versions
- **Branch/Merge**: Allow creating branches of forms
- **Bulk Operations**: Restore multiple forms to specific dates
- **Export History**: Download form history as JSON/CSV
- **Retention Policy**: Automatic cleanup of old versions 