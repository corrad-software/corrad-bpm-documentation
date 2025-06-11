# Corrad ProcessMaker - Project Overview

## Introduction

Corrad ProcessMaker is a comprehensive Business Process Management (BPM) platform designed to help organizations automate workflows and streamline business processes. It combines a visual process designer with a powerful form builder to create end-to-end business process solutions.

## System Architecture

The application follows a modern web architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │     │     Backend     │     │    Database     │
│   (Nuxt/Vue)    │────▶│    (Nitro.js)   │────▶│     (MySQL)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Frontend
- Built with Nuxt 3 and Vue 3
- Uses Pinia for state management
- Rich UI components built with Tailwind CSS
- Form components powered by FormKit
- Process visualization with Vue Flow

### Backend
- NitroJS server (part of Nuxt 3 ecosystem)
- RESTful API endpoints
- Server middleware for authentication
- Database interactions via Prisma ORM

### Database
- MySQL/MariaDB relational database
- Schema managed via Prisma
- Key tables:
  - Users and Roles
  - Forms
  - Processes
  - Tasks
  - Audit logs

## Core Modules

### Process Builder

The Process Builder is the heart of the system, allowing users to design executable business processes following the BPMN standard. Key features include:

- Visual process design with drag-and-drop interface
- Support for various node types:
  - Start/End events
  - Tasks (manual, form, script)
  - Decision Points for branching workflows
- Connection management between nodes
- Properties panel for node configuration
- Variable management for process data
- Integration with forms

### Form Builder

The Form Builder complements the Process Builder, enabling users to create forms that integrate with process tasks. Features include:

- Drag-and-drop form designer
- Rich component library
  - Text inputs, select dropdowns, checkboxes
  - Date/time pickers, file uploads
  - Layout components
- Real-time form preview
- Configuration panel for component properties
- Form versioning and management
- Integration with processes

### Process Execution

The Process Execution module provides the end-user interface for interacting with deployed workflow processes. Key features include:

- Execution Dashboard for process overview
  - Task statistics and metrics
  - Recent tasks and processes
- Task Inbox for managing assigned tasks
  - Task filtering and search
  - Status indicators and due dates
- New Case interface for initiating processes
  - Process catalog with descriptions
  - Categorized process listing
- Case History for tracking process instances
  - Historical record of completed processes
  - Timeline visualization of process steps
- Task Detail interface for completing tasks
  - Dynamic form rendering
  - Case context and variables
  - Process timeline visualization

## User Flows

### Process Design and Execution

1. User creates a new process in Process Builder
2. User adds and configures process nodes (start, tasks, gateways, end)
3. User connects nodes to establish the process flow
4. For form tasks, user selects or creates forms
5. User sets conditions for gateways
6. User deploys the process
7. The process becomes available for execution
8. Users receive tasks based on assignments
9. Process progresses as tasks are completed

### Form Creation and Usage

1. User creates a new form in Form Builder
2. User adds and configures form components
3. User sets validation rules and field properties
4. User saves and publishes the form
5. The form becomes available for use in processes
6. When a form task is encountered in a process, the assigned user sees the form
7. Form submissions store data in the process variables

### Process Participation

1. User logs into the system and views their task inbox
2. User opens and completes assigned tasks
3. User submits task forms with required data
4. Process advances based on task completion
5. User can view process history and status
6. User can initiate new process instances

## Data Flow

1. Process execution begins at a start event
2. As the process moves through tasks, data is collected and transformed
3. Forms collect user input and store it in process variables
4. Gateway conditions evaluate process variables to determine flow paths
5. Script tasks manipulate process data
6. Process completion provides output data

## Authentication and Authorization

- User authentication via username/password
- Role-based access control
- Permission management for processes and forms
- Audit logging of user actions

## Integration Points

The system is designed for extensibility with several integration points:

- API endpoints for external system communication
- Script tasks for custom code execution
- Database connections for data persistence
- Authentication integration with external identity providers

## Future Development Areas

- Process templates and versioning
- Advanced analytics and reporting
- Mobile-friendly execution interface
- Expanded notification system
- Enhanced variable validation
- Subprocess support
- API expansion for 3rd party integration 