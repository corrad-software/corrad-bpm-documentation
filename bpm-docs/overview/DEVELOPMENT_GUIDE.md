# Development Guide

This guide is intended for developers who are new to the Corrad ProcessMaker project. It covers the setup process, coding conventions, and tips for working with the major components of the system.

## Development Setup

### Prerequisites

- Node.js (v16+)
- MySQL/MariaDB database
- Git
- Yarn (recommended) or npm

### Local Development Environment

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd corrad-processmaker
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database connection details
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   yarn dev
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

The project follows a standard Nuxt 3 directory structure with some additional folders:

```
├── assets/              # Static assets (SCSS, images)
├── components/          # Vue components
│   ├── process-flow/    # Process Builder components
│   ├── formkit/         # Custom FormKit components
│   └── rs-*/            # Rose UI components
├── composables/         # Reusable Vue composables
├── doc/                 # Documentation
├── layouts/             # Page layouts
├── middleware/          # Nuxt middleware
├── pages/               # Routes and pages
├── plugins/             # Vue plugins
├── prisma/              # Database schema and migrations
├── public/              # Public static files
├── server/              # API routes and server middleware
└── stores/              # Pinia stores
```

## Naming Conventions

- **Components**: Use PascalCase for component names (e.g., `ProcessFlowCanvas.vue`)
- **Files**: Use kebab-case for filenames (e.g., `process-builder.js`)
- **Custom Rose UI components**: Prefix with `Rs` (e.g., `RsButton.vue`)
- **FormKit custom components**: Use PascalCase (e.g., `DateTimePicker.vue`)
- **Stores**: Use camelCase (e.g., `processBuilder.js`)
- **API routes**: Use kebab-case (e.g., `/api/forms/get-all`)

## Coding Standards

### Vue Components

- Use the Composition API with `<script setup>` for new components
- Define props using `defineProps()` with proper types
- Use emits with `defineEmits()`
- Keep components focused on a single responsibility
- Extract reusable logic to composables

```vue
<script setup>
// Good example
const props = defineProps({
  nodeId: {
    type: String,
    required: true
  },
  nodeType: {
    type: String,
    default: 'task'
  }
});

const emit = defineEmits(['update', 'delete']);

// Component logic
</script>
```

### CSS Guidelines

- Use Tailwind CSS utility classes when possible
- For custom styles, use SCSS with scoped styles
- Follow the BEM naming convention for custom CSS classes
- Maintain a consistent color scheme using Tailwind's theme colors

### State Management

- Use Pinia stores for shared state
- Define clear actions, getters, and state
- Use state composition for complex stores
- Document store functions

## Working with Key Components

### Process Builder

The Process Builder uses Vue Flow for visualization and consists of several components:

- `ProcessFlowCanvas.vue`: Main canvas component
- `ProcessFlowNodes.js`: Node type definitions
- `GatewayConditionManager.vue`: Manages gateway conditions
- `VariableManager.vue`: Manages process variables

To add a new node type:

1. Define the node type in `ProcessFlowNodes.js`
2. Add it to the component palette in `ProcessBuilderComponents.vue`
3. Update the node properties panel in the Process Builder page
4. Add any necessary handlers in the store

### Form Builder

The Form Builder uses FormKit and consists of these main components:

- `FormBuilderCanvas.vue`: Main canvas for form layout
- `FormBuilderComponents.vue`: Component library/palette
- `FormBuilderConfiguration.vue`: Component property editor
- `ComponentPreview.vue`: Live preview of forms

To add a new form component:

1. Add the component definition to the component library
2. Add configuration options to the configuration panel
3. Update the FormKit component if necessary
4. Add any special rendering logic to the preview component

## API Integration

The backend API is built with Nitro.js and follows RESTful conventions:

- API routes are defined in the `server/api/` directory
- Route handlers use Prisma for database operations
- Authentication is handled via middleware

Example API route:

```js
// server/api/forms/index.js
export default defineEventHandler(async (event) => {
  // Get query parameters
  const query = getQuery(event);
  
  // Get forms from database
  const forms = await prisma.form.findMany({
    where: {
      status: 'active'
    },
    orderBy: {
      createdDate: 'desc'
    }
  });
  
  return forms;
});
```

## Testing

TODO: Add testing guidelines once testing is implemented.

## Deployment

For production deployment:

1. Build the application:
   ```bash
   yarn build
   ```

2. Start the production server:
   ```bash
   yarn start
   ```

Alternatively, you can use PM2 for process management:
```bash
pm2 start ecosystem.config.js
```

## Getting Help

- Check the existing documentation in the `doc/` directory
- Read the codebase, particularly the main components
- Ask for help from other team members
- Consult the Nuxt, Vue, and FormKit documentation for framework-specific questions

---

Remember that this is a complex application. Take time to understand how the components interact before making significant changes. 