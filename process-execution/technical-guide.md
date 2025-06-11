# Process Execution - Technical Guide

## Introduction

The Process Execution module forms the user-facing interface of the workflow system, enabling end-users to interact with processes designed in the Process Builder. This document outlines the technical implementation of the Process Execution module, aimed at developers who need to understand, maintain, or extend the system.

## Architecture Overview

The Process Execution module is built with the following technologies:

- **Frontend**: Vue 3 components with Nuxt 3 for routing and SSR
- **State Management**: Pinia stores for managing process and task data
- **UI Components**: Rose UI components (rs-prefixed) for consistent styling
- **Form Handling**: FormKit for dynamic form rendering and validation
- **Data Fetching**: Fetch composables with caching for API interactions

```
┌─────────────────────────────────────────────────────────────┐
│                   Process Execution Module                   │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│  Dashboard  │  New Case   │ Task Inbox  │  Case History    │
├─────────────┴─────────────┴─────────────┴──────────────────┤
│              Task Detail & Form Rendering Engine            │
├─────────────────────────────────────────────────────────────┤
│                        API Layer                            │
└─────────────────────────────────────────────────────────────┘
```

## Module Components

### Pages

The module consists of five main pages:

1. **Execution Dashboard** (`pages/execution/index.vue`)
   - Aggregates process and task data
   - Displays statistics and recent items
   - Provides navigation to other execution pages

2. **New Case Page** (`pages/execution/new-case.vue`)
   - Lists available processes that can be initiated
   - Includes filtering and search functionality
   - Handles process instantiation

3. **Task Inbox** (`pages/execution/inbox.vue`)
   - Lists tasks assigned to the current user
   - Provides advanced filtering options
   - Handles task status updates

4. **Case History** (`pages/execution/history.vue`)
   - Lists process instances and their statuses
   - Provides filtering by multiple criteria
   - Offers detailed case information access

5. **Task Detail** (`pages/execution/task/[id].vue`)
   - Renders task-specific forms
   - Displays case variables and process timeline
   - Handles task completion actions

### Components

Key components used throughout the module:

1. **TaskForm.vue**
   - Renders dynamic task forms based on task definition
   - Handles validation and submission
   - Uses FormKit for form element rendering

### Data Models

The module interacts with several data models:

1. **Process Instance**
   ```typescript
   interface ProcessInstance {
     id: string;
     processDefinitionId: string;
     name: string;
     status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ERROR';
     startDate: string;
     endDate?: string;
     variables: Record<string, any>;
     tasks: Task[];
   }
   ```

2. **Task**
   ```typescript
   interface Task {
     id: string;
     name: string;
     processInstanceId: string;
     status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
     assignee: string;
     dueDate?: string;
     formKey?: string;
     formData?: Record<string, any>;
   }
   ```

## API Endpoints

The module interacts with the following API endpoints:

### Processes

- `GET /api/processes` - Retrieve available process definitions
- `POST /api/processes/{processId}/start` - Start a new process instance
- `GET /api/processes/instances` - Retrieve process instances
- `GET /api/processes/instances/{instanceId}` - Get a specific process instance

### Tasks

- `GET /api/tasks` - Retrieve tasks assigned to the current user
- `GET /api/tasks/{taskId}` - Get a specific task
- `POST /api/tasks/{taskId}/complete` - Complete a task with form data
- `POST /api/tasks/{taskId}/claim` - Claim a task assignment
- `POST /api/tasks/{taskId}/unclaim` - Release a task assignment

## Authentication and Authorization

The module relies on the application's authentication system with specific considerations:

- All execution pages require authentication (using the `auth` middleware)
- Task accessibility is determined by task assignment
- Process start permissions are controlled by user roles
- Case history visibility respects process instance permissions

## State Management

Process Execution uses Pinia stores to manage state:

```typescript
// Store for task management
export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    currentTask: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchTasks() {
      // Implementation
    },
    async fetchTask(taskId) {
      // Implementation
    },
    async completeTask(taskId, formData) {
      // Implementation
    }
  }
});

// Store for process management
export const useProcessStore = defineStore('process', {
  state: () => ({
    processDefinitions: [],
    processInstances: [],
    currentInstance: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchProcessDefinitions() {
      // Implementation
    },
    async startProcess(processId, initialData) {
      // Implementation
    },
    async fetchProcessInstances() {
      // Implementation
    }
  }
});
```

## Form Rendering

Process Execution dynamically renders forms based on form definitions:

1. Forms are retrieved from the Form Builder's repository
2. FormKit schema is generated from the form definition
3. The schema is rendered using FormKit components
4. Validation rules are applied based on form configuration
5. Submission data is processed and sent to the API

```javascript
// Example of form rendering
function renderTaskForm(formDefinition) {
  const schema = convertToFormKitSchema(formDefinition);
  return createForm({
    schema,
    onSubmit: async (formData) => {
      await completeTask(currentTaskId.value, formData);
    }
  });
}
```

## Status Tracking and Visualization

Process status visualization is implemented using:

1. **Status Badges**
   - Color-coded status indicators (success, warning, danger)
   - Text labels for clear status identification

2. **Process Timeline**
   - Sequential visualization of process steps
   - Status indicators for each step
   - Current position indicator in the flow

## Performance Considerations

1. **Data Caching**
   - Task and process data is cached to minimize API calls
   - Caching invalidated on relevant state changes

2. **Pagination**
   - Task lists and process history implement pagination
   - Configurable page sizes to optimize data loading

3. **Lazy Loading**
   - Task details and forms are lazy-loaded
   - Expandable sections to reduce initial load time

## Error Handling

1. **API Error Handling**
   - Centralized error handling for API responses
   - User-friendly error messages for common issues
   - Detailed logging for debugging

2. **Form Validation**
   - Client-side validation to reduce server load
   - Consistent error presentation for form fields
   - Submission validation to prevent data loss

## Future Improvements

Planned technical enhancements for the Process Execution module:

1. **Real-time Updates**
   - WebSocket integration for task list updates
   - Notifications for new task assignments

2. **Offline Support**
   - Task caching for offline access
   - Offline form submission queuing

3. **Performance Optimization**
   - Virtual scrolling for large task lists
   - Optimized form rendering for complex forms

4. **Integration Enhancements**
   - Enhanced document handling capabilities
   - External system integrations for task actions

## Development Guidelines

When extending the Process Execution module:

1. **Component Reuse**
   - Utilize existing Rose UI components
   - Follow established patterns for new components

2. **State Management**
   - Use appropriate stores for data management
   - Maintain clear actions and mutations

3. **Form Handling**
   - Follow FormKit patterns for form implementation
   - Use validation utilities consistently

4. **API Interactions**
   - Use the established composables for API calls
   - Maintain proper error handling 