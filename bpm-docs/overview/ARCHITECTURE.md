# System Architecture

This document provides a technical overview of the Corrad ProcessMaker architecture, detailing how the different components interact and the data flows through the system.

## High-Level Architecture

The application follows a modern web architecture pattern:

```
┌────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Form Builder │  │Process Build│  │ Execution UI│             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                      State Management                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Form Store  │  │Process Store│  │Variable Store│             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                        API Layer                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Form API    │  │ Process API │  │  User API   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                       Data Layer                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │Form Database│  │Process DB   │  │  User DB    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

The frontend of Corrad ProcessMaker is built with Nuxt 3 and Vue 3, using the Composition API. It follows a component-based architecture with state management powered by Pinia.

### UI Components

1. **Rose UI Components**
   - Prefixed with `Rs` (e.g., `RsButton`, `RsCard`)
   - Form the foundation of the UI
   - Implemented using Tailwind CSS
   - Located in `/components/`

2. **Process Builder Components**
   - Located in `/components/process-flow/`
   - Use Vue Flow for visualization
   - Main components:
     - `ProcessFlowCanvas.vue`: Main canvas
     - `ProcessFlowNodes.js`: Node definitions
     - `GatewayConditionManager.vue`: Condition management
     - `FormSelector.vue`: Form selection in form tasks

3. **Form Builder Components**
   - Located in `/components/` (root)
   - Main components:
     - `FormBuilderCanvas.vue`: Main canvas
     - `FormBuilderComponents.vue`: Component library
     - `FormBuilderConfiguration.vue`: Property editor
     - `ComponentPreview.vue`: Form preview

### State Management

State is managed with Pinia stores:

1. **Process Builder Store** (`/stores/processBuilder.js`)
   - Manages process definitions
   - Handles node and edge operations
   - Manages process saving and loading

2. **Variable Store** (`/stores/variableStore.js`)
   - Manages process variables
   - Handles variable scopes (global, process, task)

3. **Form Builder Store** (`/stores/formBuilder.js`)
   - Manages form definitions
   - Handles component operations
   - Manages form saving and loading

### Routing and Pages

The application uses Nuxt's file-based routing:

- `/pages/process-builder/index.vue`: Process Builder UI
- `/pages/process-builder/manage.vue`: Process management
- `/pages/form-builder/index.vue`: Form Builder UI
- `/pages/form-builder/manage.vue`: Form management

## Backend Architecture

The backend is powered by Nitro.js (part of Nuxt 3) and uses Prisma as the ORM.

### API Endpoints

API routes are defined in the `/server/api/` directory:

1. **Form Endpoints**
   - `/api/forms`: CRUD operations for forms
   - `/api/forms/[id]`: Operations on a specific form

2. **Process Endpoints**
   - `/api/processes`: CRUD operations for processes
   - `/api/processes/[id]`: Operations on a specific process
   - `/api/processes/[id]/execute`: Process execution

3. **User and Authentication Endpoints**
   - `/api/auth`: Authentication endpoints
   - `/api/users`: User management

### Middleware

Middleware is defined in `/server/middleware/` and `/middleware/`:

- Authentication middleware
- Audit logging middleware
- Error handling middleware

## Database Architecture

The database schema is defined in Prisma schema (`/prisma/schema.prisma`) and includes the following models:

1. **User and Role Models**
   - `user`: User information
   - `role`: Role definitions
   - `userrole`: User-role associations

2. **Form Model**
   - Stores form definitions
   - Components stored as JSON
   - Associated with creators

3. **Process Model**
   - Stores process definitions
   - Process nodes and edges stored as JSON
   - Associated with creators

4. **Task Model**
   - Stores task instances
   - Linked to processes and forms
   - Tracks task status and assignees

5. **Audit Model**
   - Logs system actions
   - Tracks changes to entities
   - Associated with users

## Data Flow

### Form Builder Flow

1. User designs a form in the Form Builder
2. Form components and properties are stored in the Form Builder store
3. When saved, the form definition is sent to the server via API
4. The server stores the form in the database
5. The form becomes available for use in processes

### Process Builder Flow

1. User designs a process in the Process Builder
2. Process nodes, edges, and properties are stored in the Process Builder store
3. When saved, the process definition is sent to the server via API
4. The server stores the process in the database
5. The process becomes available for execution

### Process Execution Flow

1. A process is started through the API
2. The server creates a process instance
3. As the process executes, it creates tasks
4. Users are assigned tasks based on the process definition
5. When form tasks are encountered, users fill out forms
6. Form data is stored in process variables
7. Decision Points determine the next path
8. The process continues until completion

## Security Architecture

1. **Authentication**
   - Username/password authentication
   - JWT tokens for session management
   - Token refresh mechanism

2. **Authorization**
   - Role-based access control
   - Permission checks at API endpoints
   - UI-level permission handling

3. **Data Security**
   - Password hashing
   - Input validation and sanitization
   - Database query parameterization

## Deployment Architecture

The application is designed to be deployed in various environments:

1. **Development**
   - Local development server
   - Hot module replacement
   - Development database

2. **Production**
   - Server-side rendering
   - Static asset optimization
   - Database connection pooling
   - PM2 process management

## Integration Points

The system offers several integration points:

1. **API Endpoints**
   - RESTful API for external system integration
   - Webhook support for notifications

2. **Database**
   - Direct database access for reporting
   - Database triggers for advanced integrations

3. **Authentication**
   - Potential for SSO integration
   - External identity provider support

## Performance Considerations

1. **Frontend Optimization**
   - Component lazy loading
   - State management optimization
   - UI rendering performance

2. **Backend Optimization**
   - Database query optimization
   - API response caching
   - Server-side rendering

3. **Database Optimization**
   - Indexing strategy
   - Query optimization
   - Connection pooling

## Future Architecture Considerations

1. **Microservices**
   - Potential split into microservices for better scaling
   - Separate services for forms, processes, and user management

2. **Real-time Features**
   - WebSocket integration for real-time updates
   - Notification system

3. **Scalability**
   - Horizontal scaling for API servers
   - Database sharding and replication
   - Caching layer 