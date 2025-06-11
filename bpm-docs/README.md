# Corrad ProcessMaker Documentation

Welcome to the Corrad ProcessMaker documentation. This repository contains comprehensive guides and technical documentation for developers and users of the Corrad ProcessMaker platform.

## Documentation Structure

The documentation is organized into the following sections:

### Overview
- [Project Overview](./overview/PROJECT_OVERVIEW.md) - Introduction to the system and its capabilities
- [Architecture](./overview/ARCHITECTURE.md) - Technical architecture of the system
- [Development Guide](./overview/DEVELOPMENT_GUIDE.md) - Guide for new developers

### Process Builder
- [User Guide](./process-builder/USER_GUIDE.md) - How to use the Process Builder
- [Technical Guide](./process-builder/TECHNICAL_GUIDE.md) - Technical details of the Process Builder implementation
- [Roadmap](./process-builder/ROADMAP.md) - Planned improvements for the Process Builder

### Form Builder
- [User Guide](./form-builder/USER_GUIDE.md) - How to use the Form Builder
- [Technical Guide](./form-builder/TECHNICAL_GUIDE.md) - Technical details of the Form Builder implementation
- [JavaScript API Reference](./form-builder/JAVASCRIPT_API.md) - Complete JavaScript API for dynamic forms and calculations
- [Grid System Guide](./form-builder/grid-system.md) - Visual grid system and layout documentation
- [Roadmap](./form-builder/ROADMAP.md) - Development roadmap and missing essential features checklist

### Process Execution
- [User Guide](./process-execution/USER_GUIDE.md) - How to use the Process Execution interface
- [Technical Guide](./process-execution/TECHNICAL_GUIDE.md) - Technical details of the Process Execution implementation

## Getting Started

New to the project? We recommend reading the documentation in this order:

1. [Project Overview](./overview/PROJECT_OVERVIEW.md) - Understand what the system does
2. [Development Guide](./overview/DEVELOPMENT_GUIDE.md) - Learn how to set up your development environment
3. [Architecture](./overview/ARCHITECTURE.md) - Understand the technical architecture
4. User guides for components you'll be working with
5. Technical guides for deeper implementation details

## Contributing to Documentation

When contributing to this documentation:

1. Keep the structure organized and logical
2. Update cross-references when moving or renaming files
3. Ensure code examples are up-to-date
4. Include diagrams where helpful
5. Keep the language clear and concise

## Contact

If you have questions about this documentation or need help with the system, please contact the development team. 

Last updated: December 2024

## Recent Updates

### December 2024 - Major Process Builder Enhancements
- **Enhanced Form Node Configuration**: Complete redesign of form task configuration with step-by-step workflow
- **Input/Output Mappings**: Bidirectional data flow between process variables and form fields
- **Field Conditions**: Dynamic field behavior based on process variables (readonly, hidden, required states)
- **4-Point Connection System**: All nodes now have 4 connection points (top, bottom, left, right) to prevent edge overlaps
- **Improved Visual Design**: Better handle styling with hover effects and connection state feedback
- **Auto-Save Mechanism**: Reliable data persistence for form configurations and mappings
- **Variable Integration**: Seamless integration with process variables for form pre-filling and data capture
- **Conditional Logic**: Support for complex field conditions with multiple operators and actions
- **Process Settings Management**: Comprehensive process configuration with 5 organized tabs:
  - **Process Info**: Name, description, priority, category, ownership management
  - **Execution Settings**: Process type, timeouts, parallel execution, error recovery
  - **Variables & Data**: Data persistence policies, logging, encryption, retention controls
  - **Permissions**: Role-based access control, execution permissions, approval workflows
  - **JSON Export**: Complete configuration export with metadata for API integration
- **Advanced Configuration Options**: Professional-grade settings comparable to enterprise BPM platforms
- **Enhanced State Management**: Improved process store with settings persistence and history tracking

### December 2024 - Process Builder Critical Fixes & Database Integration
- **Database Integration**: Complete API system with REST endpoints for all process operations
- **URL Parameter Support**: Direct process linking via `/process-builder?id={uuid}` pattern
- **Save Functionality**: Enhanced with success/error messages and proper state management
- **Navigation Improvements**: Fixed unsaved changes detection and automatic URL synchronization
- **Connection Dragging Fix**: Resolved Vue Flow interference preventing connector dragging
- **Backward Compatibility**: Legacy process definitions with embedded nodes automatically upgraded
- **Toast Notifications**: Comprehensive user feedback system for all operations
- **Performance Optimizations**: Reduced re-renders and improved memory management
- **Error Handling**: Robust validation and graceful error recovery throughout system
- **UI Consistency**: Updated form builder management to match process builder design patterns

### December 2024 - Major Form Builder Enhancements
- **JavaScript Execution Engine**: Added FormScriptEngine component for real-time calculations
- **Dynamic Field Updates**: Implemented onFieldChange and onLoad event handlers
- **Real-time Calculations**: Forms now support live mathematical calculations and field dependencies
- **Enhanced Debugging**: Comprehensive logging and error handling for JavaScript execution
- **API Documentation**: Complete JavaScript API reference with practical examples
- **Performance Optimizations**: Improved change detection and memory management
- **Security Enhancements**: Sandboxed JavaScript execution with input validation 