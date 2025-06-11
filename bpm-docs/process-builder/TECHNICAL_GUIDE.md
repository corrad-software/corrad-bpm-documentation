# Process Builder Technical Appendix

This document provides technical implementation details for developers working with the Process Builder system.

> For user documentation and usage guidelines, please refer to [Process Builder Documentation](USER_GUIDE.md)

## Recent Updates (December 2024)

### Critical Bug Fixes and Enhancements
- **Process Definition Loading**: Fixed issue where processes with empty nodes array but nodes embedded in edges wouldn't display on canvas
- **URL Parameter Support**: Added direct linking to processes via `/process-builder?id=uuid` pattern
- **Save Functionality**: Enhanced with success/error messages and proper state management
- **Navigation State**: Fixed unsaved changes modal appearing after successful saves
- **Connection Dragging**: Resolved Vue Flow interference with connector dragging functionality
- **Database Integration**: Full API integration with comprehensive error handling and validation
- **Toast Notifications**: Implemented user feedback system for all operations
- **Form Builder Consistency**: Updated form builder manage page to match process builder design

### Breaking Changes
- Process store now requires API integration for all operations
- Local state has been eliminated in favor of database-driven architecture
- URL parameters are now required for process editing workflows

## Architecture Overview

### Technology Stack
- **Frontend Framework**: Nuxt 3 / Vue 3
- **State Management**: Pinia
- **Flow Visualization**: Vue Flow
- **UI Framework**: Tailwind CSS
- **Icons**: Material Design Icons
- **Validation**: Zod
- **Form Components**: FormKit

### Key Dependencies
```json
{
  "@vue-flow/core": "^1.42.5",
  "@vue-flow/background": "^1.3.2",
  "@vue-flow/controls": "^1.1.2",
  "@vue-flow/minimap": "^1.5.3",
  "@pinia/nuxt": "^0.4.11",
  "@formkit/nuxt": "^1.5.5",
  "uuid": "^10.0.0",
  "zod": "^3.22.2"
}
```

## Project Structure

```
pages/
├── process-builder/
│   ├── index.vue           # Main builder interface
│   └── manage.vue          # Process management
components/
├── process-flow/
│   ├── ProcessFlowCanvas.vue     # Flow canvas
│   ├── ProcessFlowNodes.js       # Custom node types
│   ├── FormSelector.vue          # Form selection component
│   ├── GatewayConditionManager.vue # Gateway conditions UI
│   ├── ApiNodeConfiguration.vue  # API node configuration
│   ├── FormNodeConfiguration.vue # Form node configuration
│   ├── BusinessRuleConfiguration.vue # Business rule configuration
│   └── VariableManager.vue       # Process variables manager
stores/
├── processBuilder.js       # State management
└── variableStore.js        # Variable state management
composables/
└── useProcessValidation.js # Process validation
types/
└── process-builder.d.ts    # TypeScript definitions
```

## URL Parameter System

The Process Builder now supports direct linking to specific processes via URL parameters, enabling seamless navigation and bookmarking.

### Implementation

#### Route Handling
```javascript
// pages/process-builder/index.vue
const route = useRoute();
const router = useRouter();

// Watch for URL parameter changes
watch(() => route.query.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    try {
      await loadProcessFromUrl(newId);
    } catch (error) {
      console.error('Error loading process from URL:', error);
      // Redirect to clean state on error
      router.push('/process-builder');
    }
  }
}, { immediate: true });

// Load process from URL parameter
const loadProcessFromUrl = async (processId) => {
  if (!processId || processId === 'new') return;
  
  try {
    setLoading(true);
    await processStore.loadProcess(processId);
    
    if (!processStore.currentProcess) {
      throw new Error('Process not found');
    }
    
    // Update URL without triggering navigation
    await router.replace({ 
      path: '/process-builder', 
      query: { id: processId } 
    });
    
  } catch (error) {
    console.error('Failed to load process:', error);
    toast.error('Failed to load process: ' + (error.message || 'Unknown error'));
    
    // Clear invalid URL parameter
    await router.replace('/process-builder');
  } finally {
    setLoading(false);
  }
};
```

#### Navigation Updates
```javascript
// Create new process with URL update
const createNewProcess = async () => {
  try {
    processStore.clearProcess();
    // Navigate to clean URL for new process
    await router.push('/process-builder');
  } catch (error) {
    console.error('Error creating new process:', error);
  }
};

// Save process with URL synchronization
const saveProcess = async () => {
  try {
    const result = await processStore.saveProcess();
    
    if (result && result.id) {
      // Update URL with saved process ID
      await router.replace({ 
        path: '/process-builder', 
        query: { id: result.id } 
      });
      
      toast.success('Process saved successfully');
    }
  } catch (error) {
    toast.error('Failed to save process');
  }
};
```

### URL Patterns

- **New Process**: `/process-builder` (no parameters)
- **Edit Process**: `/process-builder?id={uuid}` 
- **Navigation**: Automatic URL updates when saving new processes
- **Validation**: Invalid IDs redirect to clean builder state

### Error Handling

- **Invalid Process ID**: Graceful fallback to new process state
- **Network Errors**: User-friendly error messages with toast notifications
- **Missing Processes**: Automatic cleanup of invalid URL parameters
- **Loading States**: Visual feedback during process loading

### Integration Points

- **Process Management**: Direct links from manage page to builder
- **Form Builder**: Consistent URL pattern across builders
- **Navigation Guards**: Unsaved changes detection with URL awareness
- **Bookmarking**: Users can bookmark specific processes for quick access

## Database Integration & API System

The Process Builder now features comprehensive database integration with a RESTful API system, replacing local state management with persistent storage.

### API Endpoints

#### Core Process Operations
```javascript
// GET /api/process - List all processes with pagination
GET /api/process?page=1&limit=10&search=workflow&status=draft

// GET /api/process/[id] - Get specific process
GET /api/process/550e8400-e29b-41d4-a716-446655440000

// POST /api/process - Create new process
POST /api/process
{
  "name": "New Workflow",
  "description": "Process description",
  "processDefinition": { nodes: [], edges: [] },
  "processVariables": [],
  "isTemplate": false
}

// PUT /api/process/[id] - Update existing process
PUT /api/process/550e8400-e29b-41d4-a716-446655440000
{
  "name": "Updated Workflow",
  "processDefinition": { /* updated definition */ }
}

// DELETE /api/process/[id] - Delete process
DELETE /api/process/550e8400-e29b-41d4-a716-446655440000
```

#### Advanced Operations
```javascript
// POST /api/process/[id]/duplicate - Duplicate process
POST /api/process/550e8400-e29b-41d4-a716-446655440000/duplicate
{
  "name": "Workflow Copy",
  "regenerateIds": true
}

// POST /api/process/[id]/publish - Publish process
POST /api/process/550e8400-e29b-41d4-a716-446655440000/publish
{
  "version": "1.0.0",
  "notes": "Initial release"
}

// GET /api/process/templates - Get process templates
GET /api/process/templates
```

### Process Store Integration

#### Enhanced Store Methods
```javascript
// stores/processBuilder.js
export const useProcessBuilderStore = defineStore('processBuilder', () => {
  
  // Load process from API with error handling
  const loadProcess = async (processId) => {
    try {
      loading.value = true;
      const { data } = await $fetch(`/api/process/${processId}`);
      
      if (!data) {
        throw new Error('Process not found');
      }
      
      currentProcess.value = data;
      
      // Handle backward compatibility for process definitions
      if (data.processDefinition) {
        if (data.processDefinition.nodes?.length === 0 && 
            data.processDefinition.edges?.length > 0) {
          // Extract nodes from edges for backward compatibility
          const extractedNodes = extractNodesFromEdges(data.processDefinition.edges);
          nodes.value = extractedNodes;
          edges.value = data.processDefinition.edges;
        } else {
          nodes.value = data.processDefinition.nodes || [];
          edges.value = data.processDefinition.edges || [];
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error loading process:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  
  // Save process with validation and success feedback
  const saveProcess = async () => {
    try {
      loading.value = true;
      
      const processData = {
        name: localProcess.value.name,
        description: localProcess.value.description,
        processDefinition: {
          nodes: nodes.value,
          edges: edges.value
        },
        processVariables: processVariables.value,
        processSettings: {
          // Process configuration settings
          processType: localProcess.value.processType,
          priority: localProcess.value.priority,
          category: localProcess.value.category,
          timeoutDuration: localProcess.value.timeoutDuration,
          allowParallel: localProcess.value.allowParallel,
          enableErrorRecovery: localProcess.value.enableErrorRecovery,
          sendNotifications: localProcess.value.sendNotifications
        }
      };
      
      let result;
      if (currentProcess.value?.id) {
        // Update existing process
        result = await $fetch(`/api/process/${currentProcess.value.id}`, {
          method: 'PUT',
          body: processData
        });
      } else {
        // Create new process
        result = await $fetch('/api/process', {
          method: 'POST',
          body: processData
        });
      }
      
      if (result?.data) {
        currentProcess.value = result.data;
        hasUnsavedChanges.value = false;
        lastSavedState.value = JSON.stringify(processData);
        return result.data;
      }
      
      throw new Error('Save operation failed');
    } catch (error) {
      console.error('Error saving process:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  
  // Fetch all processes with filtering
  const fetchProcesses = async (options = {}) => {
    try {
      const params = new URLSearchParams({
        page: options.page || 1,
        limit: options.limit || 20,
        ...(options.search && { search: options.search }),
        ...(options.status && { status: options.status })
      });
      
      const response = await $fetch(`/api/process?${params}`);
      processes.value = response.data || [];
      return response;
    } catch (error) {
      console.error('Error fetching processes:', error);
      throw error;
    }
  };
  
  return {
    // State
    currentProcess: readonly(currentProcess),
    processes: readonly(processes),
    loading: readonly(loading),
    hasUnsavedChanges: readonly(hasUnsavedChanges),
    
    // Actions
    loadProcess,
    saveProcess,
    fetchProcesses,
    clearProcess,
    duplicateProcess,
    deleteProcess
  };
});
```

### Backward Compatibility

#### Process Definition Loading
```javascript
// Handle legacy process definitions with embedded nodes in edges
const extractNodesFromEdges = (edges) => {
  const nodeMap = new Map();
  
  edges.forEach(edge => {
    // Extract source node
    if (edge.sourceNode && !nodeMap.has(edge.source)) {
      nodeMap.set(edge.source, {
        id: edge.source,
        type: edge.sourceNode.type,
        position: edge.sourceNode.position || { x: 0, y: 0 },
        data: edge.sourceNode.data || {}
      });
    }
    
    // Extract target node
    if (edge.targetNode && !nodeMap.has(edge.target)) {
      nodeMap.set(edge.target, {
        id: edge.target,
        type: edge.targetNode.type,
        position: edge.targetNode.position || { x: 0, y: 0 },
        data: edge.targetNode.data || {}
      });
    }
  });
  
  return Array.from(nodeMap.values());
};
```

### Error Handling & Validation

#### API Error Responses
```javascript
// Standardized error response format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Process name is required",
    "details": {
      "field": "name",
      "value": "",
      "constraint": "required"
    }
  }
}

// Network error handling
try {
  await processStore.saveProcess();
} catch (error) {
  if (error.statusCode === 404) {
    toast.error('Process not found');
  } else if (error.statusCode === 422) {
    toast.error('Validation error: ' + error.data?.error?.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

#### Data Validation
```javascript
// Process validation using Zod schemas
import { z } from 'zod';

const ProcessSchema = z.object({
  name: z.string().min(1, 'Process name is required'),
  description: z.string().optional(),
  processDefinition: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any())
  }),
  processVariables: z.array(z.any()).default([]),
  isTemplate: z.boolean().default(false)
});

// Validate before save
const validateProcess = (processData) => {
  try {
    return ProcessSchema.parse(processData);
  } catch (error) {
    throw new Error(`Validation failed: ${error.message}`);
  }
};
```

## Vue Flow Integration & Performance Fixes

Critical fixes were implemented to resolve interference between state management and Vue Flow's internal operations, particularly affecting connection dragging functionality.

### Connection Dragging Bug Fix

#### Problem
The aggressive syncing of node positions and edge updates was interfering with Vue Flow's native drag-and-drop functionality, causing connections to fail when dragging from node handles.

#### Solution
```javascript
// stores/processBuilder.js - Optimized node sync handling
const syncNodePositions = (vueFlowNodes) => {
  if (!vueFlowNodes || dragging.value) return; // Skip sync during dragging
  
  const positionsChanged = vueFlowNodes.some(vfNode => {
    const storeNode = nodes.value.find(n => n.id === vfNode.id);
    if (!storeNode) return false;
    
    return Math.abs(storeNode.position.x - vfNode.position.x) > 1 || 
           Math.abs(storeNode.position.y - vfNode.position.y) > 1;
  });
  
  if (positionsChanged) {
    vueFlowNodes.forEach(vfNode => {
      const nodeIndex = nodes.value.findIndex(n => n.id === vfNode.id);
      if (nodeIndex !== -1) {
        nodes.value[nodeIndex].position = { ...vfNode.position };
      }
    });
  }
};

// Enhanced edge handling with change detection
const handleEdgeChanges = (changes, currentEdges) => {
  if (!changes || changes.length === 0) return;
  
  let hasChanges = false;
  
  changes.forEach(change => {
    if (change.type === 'add' && change.item) {
      // Only add if it doesn't already exist
      const exists = edges.value.some(e => e.id === change.item.id);
      if (!exists) {
        addEdge(change.item);
        hasChanges = true;
      }
    } else if (change.type === 'remove') {
      const index = edges.value.findIndex(e => e.id === change.id);
      if (index !== -1) {
        edges.value.splice(index, 1);
        hasChanges = true;
      }
    }
  });
  
  if (hasChanges) {
    markUnsavedChanges();
  }
};
```

#### Canvas Component Updates
```vue
<!-- components/process-flow/ProcessFlowCanvas.vue -->
<template>
  <VueFlow
    v-model:nodes="flowNodes"
    v-model:edges="flowEdges"
    :node-types="nodeTypes"
    @nodes-change="handleNodesChange"
    @edges-change="handleEdgesChange"
    @connect="handleConnect"
    @node-drag-start="onNodeDragStart"
    @node-drag-stop="onNodeDragStop"
    :default-edge-options="defaultEdgeOptions"
    :connection-mode="ConnectionMode.Loose"
    :delete-key-code="'Delete'"
    :selection-key-code="'Shift'"
    :multi-selection-key-code="'Control'"
    class="vue-flow-container"
  >
    <!-- Vue Flow components -->
  </VueFlow>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { VueFlow, ConnectionMode } from '@vue-flow/core';

// Drag state management
const isDragging = ref(false);

const onNodeDragStart = () => {
  isDragging.value = true;
  processStore.setDragging(true);
};

const onNodeDragStop = (event) => {
  isDragging.value = false;
  processStore.setDragging(false);
  
  // Sync positions after drag is complete
  if (event.nodes && event.nodes.length > 0) {
    processStore.syncNodePositions(event.nodes);
  }
};

// Optimized change handlers
const handleNodesChange = (changes) => {
  // Let Vue Flow handle internal changes first
  nextTick(() => {
    if (!isDragging.value) {
      processStore.handleNodeChanges(changes, flowNodes.value);
    }
  });
};

const handleEdgesChange = (changes) => {
  processStore.handleEdgeChanges(changes, flowEdges.value);
};

// Enhanced connection handling
const handleConnect = (connection) => {
  if (!connection.source || !connection.target) return;
  
  const newEdge = {
    id: `${connection.source}-${connection.target}`,
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle,
    targetHandle: connection.targetHandle,
    type: 'smoothstep',
    animated: true
  };
  
  processStore.addEdge(newEdge);
};
</script>
```

### Performance Optimizations

#### Reduced Re-renders
```javascript
// Computed properties for reactive data binding
const flowNodes = computed({
  get: () => processStore.nodes,
  set: (newNodes) => {
    if (!isDragging.value) {
      processStore.updateNodes(newNodes);
    }
  }
});

const flowEdges = computed({
  get: () => processStore.edges,
  set: (newEdges) => {
    processStore.updateEdges(newEdges);
  }
});

// Debounced position sync for smooth dragging
import { debounce } from 'lodash-es';

const debouncedSync = debounce((nodes) => {
  processStore.syncNodePositions(nodes);
}, 100);
```

#### Memory Management
```javascript
// Cleanup watchers and event listeners
onBeforeUnmount(() => {
  // Clear any pending debounced calls
  debouncedSync.cancel();
  
  // Reset dragging state
  processStore.setDragging(false);
  
  // Clear selections
  if (vueFlowInstance.value) {
    vueFlowInstance.value.setSelectedNodes([]);
    vueFlowInstance.value.setSelectedEdges([]);
  }
});
```

### State Synchronization

#### Bidirectional Data Flow
```javascript
// Process Store - Enhanced state management
export const useProcessBuilderStore = defineStore('processBuilder', () => {
  const dragging = ref(false);
  
  const setDragging = (value) => {
    dragging.value = value;
  };
  
  const updateNodes = (newNodes) => {
    if (!dragging.value) {
      nodes.value = newNodes.map(node => ({
        ...node,
        position: { ...node.position }
      }));
      markUnsavedChanges();
    }
  };
  
  const updateEdges = (newEdges) => {
    edges.value = newEdges.map(edge => ({ ...edge }));
    markUnsavedChanges();
  };
  
  // Smart change detection
  const markUnsavedChanges = () => {
    const currentState = JSON.stringify({
      nodes: nodes.value,
      edges: edges.value,
      variables: processVariables.value
    });
    
    if (currentState !== lastSavedState.value) {
      hasUnsavedChanges.value = true;
    }
  };
  
  return {
    // State
    dragging: readonly(dragging),
    
    // Actions
    setDragging,
    updateNodes,
    updateEdges,
    syncNodePositions,
    handleNodeChanges,
    handleEdgeChanges
  };
});
```

## Component Architecture

### Core Components

1. **ProcessFlowCanvas.vue**
```vue
<script setup>
import { ref, onMounted } from 'vue';
import { VueFlow, useVueFlow, Panel } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { nodeTypes } from './ProcessFlowNodes';

// Initialize Vue Flow with options
const {
  nodes,
  edges,
  addNodes,
  addEdges,
  removeNodes,
  removeEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  fitView,
  project
} = useVueFlow({
  defaultEdgeOptions: {
    animated: true,
    type: 'smoothstep'
  },
  deleteKeyCode: 'Delete',
  selectionKeyCode: 'Shift',
  multiSelectionKeyCode: 'Control',
  connectionMode: 'loose'
});

// Flow configuration
const flowOptions = {
  defaultZoom: 1,
  minZoom: 0.2,
  maxZoom: 4,
  fitViewOnInit: true,
  snapToGrid: true,
  snapGrid: [15, 15],
  connectionMode: 'loose',
  elementsSelectable: true,
  nodesDraggable: true,
  nodesConnectable: true
};

// Event handlers for node/edge changes
onNodesChange((changes) => {
  emit('nodesChange', changes, nodes.value);
});

onEdgesChange((changes) => {
  emit('edgesChange', changes, edges.value);
});

// Handle new connections
const handleConnect = (connection) => {
  if (!connection.source || !connection.target) return;
  
  const newEdge = {
    id: `${connection.source}-${connection.target}`,
    source: connection.source,
    target: connection.target,
    type: 'smoothstep',
    animated: true
  };

  addEdges([newEdge]);
};

// Handle node deletion
const onNodeDelete = (event) => {
  if (event && event.node) {
    removeNodes([event.node]);
    emit('nodesChange', nodes.value);
  }
};

// Handle edge deletion
const onEdgeDelete = (event) => {
  if (event && event.edge) {
    removeEdges([event.edge]);
    emit('edgesChange', edges.value);
  }
};

// Handle delete key press
const onDeleteKeyPress = () => {
  const { getSelectedNodes, getSelectedEdges } = flowInstance.value;
  const selectedNodes = getSelectedNodes();
  const selectedEdges = getSelectedEdges();
  
  if (selectedNodes.length > 0) {
    removeNodes(selectedNodes);
    emit('nodesChange', nodes.value);
  }
  
  if (selectedEdges.length > 0) {
    removeEdges(selectedEdges);
    emit('edgesChange', edges.value);
  }
};
</script>
```

2. **ProcessFlowNodes.js**
```javascript
import { h, markRaw } from 'vue';
import { Handle, Position } from '@vue-flow/core';

// Enhanced custom node renderer with 4-point connection system
const CustomNode = markRaw({
  template: `
    <div :class="['custom-node', 'node-' + type]">
      <!-- 4-Point Handle System -->
      <!-- Top Handle (Input) -->
      <Handle
        v-if="type !== 'start'"
        :id="id + '-top'"
        type="target"
        :position="Position.Top"
        :style="{ 
          opacity: 0,
          transition: 'all 0.2s ease',
          backgroundColor: '#3b82f6',
          borderColor: '#1d4ed8',
          width: '12px',
          height: '12px',
          transform: 'translate(-50%, -50%)',
          top: '-6px'
        }"
        class="handle-input"
      />
      
      <!-- Right Handle (Output) -->
      <Handle
        v-if="type !== 'end'"
        :id="id + '-right'"
        type="source"
        :position="Position.Right"
        :style="{ 
          opacity: 0,
          transition: 'all 0.2s ease',
          backgroundColor: '#10b981',
          borderColor: '#059669',
          width: '12px',
          height: '12px',
          transform: 'translate(50%, -50%)',
          right: '-6px'
        }"
        class="handle-output"
      />
      
      <!-- Bottom Handle (Output) -->
      <Handle
        v-if="type !== 'end'"
        :id="id + '-bottom'"
        type="source"
        :position="Position.Bottom"
        :style="{ 
          opacity: 0,
          transition: 'all 0.2s ease',
          backgroundColor: '#10b981',
          borderColor: '#059669',
          width: '12px',
          height: '12px',
          transform: 'translate(-50%, 50%)',
          bottom: '-6px'
        }"
        class="handle-output"
      />
      
      <!-- Left Handle (Input) -->
      <Handle
        v-if="type !== 'start'"
        :id="id + '-left'"
        type="target"
        :position="Position.Left"
        :style="{ 
          opacity: 0,
          transition: 'all 0.2s ease',
          backgroundColor: '#3b82f6',
          borderColor: '#1d4ed8',
          width: '12px',
          height: '12px',
          transform: 'translate(-50%, -50%)',
          left: '-6px'
        }"
        class="handle-input"
      />
      
      <div class="custom-node-header">
        <div class="custom-node-icon">
          <slot name="icon"></slot>
        </div>
        <div class="custom-node-title">{{ label }}</div>
      </div>
      
      <div class="custom-node-content">
        <slot></slot>
      </div>
    </div>
  `,
  props: ['id', 'type', 'label', 'data'],
  components: { Handle },
  mounted() {
    // Add event listeners for handle visibility
    this.$el.addEventListener('mouseenter', this.showHandles);
    this.$el.addEventListener('mouseleave', this.hideHandles);
  },
  methods: {
    showHandles() {
      const handles = this.$el.querySelectorAll('.vue-flow__handle');
      handles.forEach(handle => {
        handle.style.opacity = '1';
      });
    },
    hideHandles() {
      const handles = this.$el.querySelectorAll('.vue-flow__handle');
      handles.forEach(handle => {
        handle.style.opacity = '0';
      });
    }
  }
});

// Enhanced CSS for handles
const handleStyles = `
.custom-node:hover .vue-flow__handle {
  opacity: 1 !important;
  z-index: 100;
}

.vue-flow__handle {
  opacity: 0;
  transition: all 0.2s ease;
  cursor: crosshair;
  border: 2px solid;
  border-radius: 50%;
}

.handle-input {
  background-color: #3b82f6;
  border-color: #1d4ed8;
}

.handle-output {
  background-color: #10b981;
  border-color: #059669;
}

.vue-flow__handle:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.custom-node.connecting .vue-flow__handle {
  opacity: 1;
}

/* Special handling for gateway nodes (rotated) */
.node-gateway .vue-flow__handle {
  position: absolute;
}

.node-gateway .vue-flow__handle[data-handlepos="top"] {
  top: -6px;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
}

.node-gateway .vue-flow__handle[data-handlepos="right"] {
  right: -6px;
  top: 50%;
  transform: translate(50%, -50%) rotate(-45deg);
}

.node-gateway .vue-flow__handle[data-handlepos="bottom"] {
  bottom: -6px;
  left: 50%;
  transform: translate(-50%, 50%) rotate(-45deg);
}

.node-gateway .vue-flow__handle[data-handlepos="left"] {
  left: -6px;
  top: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
}
`;

// Node type definitions with enhanced handle system
export const nodeTypes = markRaw({
  task: TaskNode,
  start: StartNode,
  end: EndNode,
  gateway: GatewayNode,
  form: FormNode,
  api: ApiNode,
  script: ScriptNode,
  'business-rule': BusinessRuleNode,
  notification: NotificationNode
});

// Connection validation
export const isValidConnection = (connection) => {
  // Prevent self-connections
  if (connection.source === connection.target) {
    return false;
  }
  
  // Validate handle types
  const sourceHandle = connection.sourceHandle;
  const targetHandle = connection.targetHandle;
  
  // Ensure proper source/target handle types
  if (sourceHandle && !sourceHandle.includes('right') && !sourceHandle.includes('bottom')) {
    return false;
  }
  
  if (targetHandle && !targetHandle.includes('top') && !targetHandle.includes('left')) {
    return false;
  }
  
  return true;
};

// Enhanced connection handler with handle-specific routing
export const onConnect = (params) => {
  const { source, target, sourceHandle, targetHandle } = params;
  
  return {
    id: `${source}-${target}-${Date.now()}`,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: 'smoothstep',
    animated: true,
    style: {
      strokeWidth: 2,
      stroke: '#64748b'
    },
    data: {
      sourcePosition: sourceHandle?.split('-')[1] || 'bottom',
      targetPosition: targetHandle?.split('-')[1] || 'top'
    }
  };
};

#### Handle System Features

1. **4-Point Connection System**:
   - **Top Handle**: Primary input connection point (blue, target)
   - **Right Handle**: Secondary output connection point (green, source)
   - **Bottom Handle**: Primary output connection point (green, source) 
   - **Left Handle**: Secondary input connection point (blue, target)

2. **Enhanced Visibility**:
   - Handles are invisible by default for clean UI
   - Become visible on node hover with smooth transitions
   - Unique IDs for precise connection targeting (`nodeId-position`)

3. **Visual Feedback**:
   - Color-coded handles (blue for inputs, green for outputs)
   - Hover effects with scaling and shadow
   - Connection state awareness

4. **Special Node Handling**:
   - **Start Nodes**: Only output handles (right + bottom)
   - **End Nodes**: Only input handles (top + left)
   - **Gateway Nodes**: Rotated handle positioning for diamond shape

5. **Connection Validation**:
   - Prevents self-connections
   - Validates proper source/target handle types
   - Ensures logical connection flow

## Enhanced Node Configuration Components

The following components implement the improved UI/UX for node configuration:

### 1. VariableManager.vue

The Variable Manager allows users to create, edit, and manage global process variables.

```vue
<template>
  <div class="variable-manager">
    <!-- Header with Add Button -->
    <div class="bg-gray-50 border-b border-gray-200 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-start">
          <div class="mr-4 text-blue-500 flex-shrink-0 mt-1">
            <Icon name="material-symbols:data-object" class="text-2xl" />
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">Process Variables</h3>
            <p class="mt-1 text-sm text-gray-500">
              Define and manage global variables to store and pass data within your process
            </p>
          </div>
        </div>
        <RsButton
          @click="() => { resetForm(); showAddVariable = true; }"
          variant="primary"
          size="sm"
        >
          <Icon name="material-symbols:add" class="mr-1" />
          Add Variable
        </RsButton>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="px-4 pt-3 pb-2">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="material-symbols:search" class="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          v-model="searchQuery"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search variables..."
        />
      </div>
    </div>

    <!-- Variable List with Empty States -->
    <div class="p-4 overflow-auto flex-grow">
      <!-- Empty State -->
      <div v-if="!variables.length" class="text-center py-10 px-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
        <!-- ... empty state UI ... -->
      </div>

      <!-- Variable List -->
      <div v-else-if="filteredVariables.length" class="space-y-3">
        <!-- Variable Card Design -->
        <div
          v-for="variable in filteredVariables"
          :key="variable.name"
          class="variable-item"
        >
          <!-- ... variable card UI ... -->
        </div>
      </div>

      <!-- No search results -->
      <div v-else class="text-center py-8">
        <!-- ... no results UI ... -->
      </div>
    </div>

    <!-- Add/Edit Variable Modal -->
    <RsModal
      v-model="showAddVariable"
      :title="editingVariable ? 'Edit Variable' : 'Add Variable'"
      size="md"
      :hideFooter="true"
      :overlayClose="false"
    >
      <!-- ... modal content with FormKit ... -->
    </RsModal>
  </div>
</template>
```

### 2. BusinessRuleConfiguration.vue

The Business Rule Configuration component provides a stepped workflow for configuring rule nodes.

```vue
<template>
  <div>
    <!-- Header with descriptive info -->
    <div class="bg-purple-50 p-4 border-b border-purple-200">
      <div class="flex items-start">
        <div class="mr-4 text-purple-500 flex-shrink-0 mt-1">
          <Icon name="material-symbols:rule" class="text-2xl" />
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900">Business Rule Configuration</h3>
          <p class="mt-1 text-sm text-gray-500">
            Define conditional logic to control process flow based on data values
          </p>
        </div>
      </div>
    </div>

    <!-- Step-by-step configuration -->
    <div class="p-4">
      <!-- Progress steps -->
      <div class="flex items-center mb-6">
        <div class="flex-1">
          <button
            @click="activeStep = 1"
            :class="['step-button', activeStep === 1 ? 'active-step' : '']"
          >
            <span class="step-number">1</span>
            <span class="step-text">Define Variables</span>
          </button>
        </div>
        <div class="step-connector"></div>
        <div class="flex-1">
          <button
            @click="activeStep = 2"
            :class="['step-button', activeStep === 2 ? 'active-step' : '']"
          >
            <span class="step-number">2</span>
            <span class="step-text">Create Rules</span>
          </button>
        </div>
        <div class="step-connector"></div>
        <div class="flex-1">
          <button
            @click="activeStep = 3"
            :class="['step-button', activeStep === 3 ? 'active-step' : '']"
          >
            <span class="step-number">3</span>
            <span class="step-text">Define Actions</span>
          </button>
        </div>
      </div>

      <!-- Step content -->
      <div v-if="activeStep === 1">
        <!-- Variable selection UI -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">Select Process Variables</h4>
          <p class="text-sm text-gray-500">Choose variables to use in your business rules</p>
          
          <div class="variable-selector border border-gray-200 rounded-md p-4 bg-white">
            <!-- Variable list with checkboxes -->
            <div v-for="variable in availableVariables" :key="variable.name" class="py-2 flex items-center">
              <input 
                type="checkbox" 
                :id="variable.name" 
                v-model="selectedVariables" 
                :value="variable.name"
                class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label :for="variable.name" class="ml-2 text-sm text-gray-700 flex items-center">
                {{ variable.name }}
                <RsBadge :variant="getTypeColor(variable.type)" size="sm" class="ml-2">
                  {{ variable.type }}
                </RsBadge>
              </label>
            </div>
            
            <!-- Empty state -->
            <div v-if="!availableVariables.length" class="text-center py-4">
              <p class="text-sm text-gray-500 mb-2">No variables available</p>
              <RsButton @click="openVariableManager" size="sm" variant="tertiary">
                <Icon name="material-symbols:add" class="mr-1" />
                Add Variables
              </RsButton>
            </div>
          </div>
          
          <!-- Navigation buttons -->
          <div class="flex justify-end mt-4">
            <RsButton @click="activeStep = 2" variant="primary" :disabled="!selectedVariables.length">
              Continue
              <Icon name="material-symbols:arrow-forward" class="ml-1" />
            </RsButton>
          </div>
        </div>
      </div>
      
      <div v-else-if="activeStep === 2">
        <!-- Rule creation UI -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">Create Conditional Rules</h4>
          <p class="text-sm text-gray-500">Define the conditions that will trigger specific actions</p>
          
          <!-- Rule builder -->
          <div class="rules-builder bg-white border border-gray-200 rounded-md p-4">
            <div v-for="(rule, index) in rules" :key="index" class="rule-group mb-4 p-3 bg-purple-50 rounded-md border border-purple-200">
              <!-- Rule header -->
              <div class="flex justify-between items-center mb-2">
                <h5 class="font-medium text-purple-700">Rule {{ index + 1 }}</h5>
                <button @click="removeRule(index)" class="text-gray-400 hover:text-red-500">
                  <Icon name="material-symbols:delete" class="w-4 h-4" />
                </button>
              </div>
              
              <!-- Condition builder -->
              <div class="space-y-2">
                <div v-for="(condition, condIndex) in rule.conditions" :key="condIndex" class="flex items-center gap-2">
                  <select 
                    v-model="condition.variable" 
                    class="form-select rounded-md text-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="" disabled>Select variable</option>
                    <option v-for="v in selectedVariables" :key="v" :value="v">{{ v }}</option>
                  </select>
                  
                  <select 
                    v-model="condition.operator" 
                    class="form-select rounded-md text-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="" disabled>Select operator</option>
                    <option value="equals">equals</option>
                    <option value="notEquals">not equals</option>
                    <option value="greaterThan">greater than</option>
                    <option value="lessThan">less than</option>
                    <option value="contains">contains</option>
                  </select>
                  
                  <input 
                    v-model="condition.value" 
                    type="text" 
                    placeholder="Value" 
                    class="form-input rounded-md text-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500 flex-1"
                  />
                  
                  <button @click="removeCondition(rule, condIndex)" class="text-gray-400 hover:text-red-500 p-1">
                    <Icon name="material-symbols:remove" class="w-4 h-4" />
                  </button>
                </div>
                
                <button @click="addCondition(rule)" class="text-purple-600 hover:text-purple-700 text-sm flex items-center">
                  <Icon name="material-symbols:add" class="w-4 h-4 mr-1" />
                  Add condition
                </button>
              </div>
            </div>
            
            <button @click="addRule" class="mt-2 text-purple-600 hover:text-purple-700 text-sm flex items-center">
              <Icon name="material-symbols:add" class="w-4 h-4 mr-1" />
              Add Rule
            </button>
          </div>
          
          <!-- Navigation buttons -->
          <div class="flex justify-between mt-4">
            <RsButton @click="activeStep = 1" variant="tertiary">
              <Icon name="material-symbols:arrow-back" class="mr-1" />
              Back
            </RsButton>
            <RsButton @click="activeStep = 3" variant="primary" :disabled="!hasValidRules">
              Continue
              <Icon name="material-symbols:arrow-forward" class="ml-1" />
            </RsButton>
          </div>
        </div>
      </div>
      
      <div v-else-if="activeStep === 3">
        <!-- Action definition UI -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">Define Actions</h4>
          <p class="text-sm text-gray-500">Specify what happens when rules are triggered</p>
          
          <!-- Actions configuration -->
          <div class="actions-config bg-white border border-gray-200 rounded-md p-4">
            <div v-for="(rule, index) in rules" :key="index" class="mb-4 p-3 bg-purple-50 rounded-md border border-purple-200">
              <h5 class="font-medium text-purple-700 mb-2">Rule {{ index + 1 }} Actions</h5>
              
              <!-- Action type selection -->
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                <select 
                  v-model="rule.actionType" 
                  class="form-select w-full rounded-md text-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="setVariable">Set Variable Value</option>
                  <option value="executeFunction">Execute Function</option>
                  <option value="triggerEvent">Trigger Event</option>
                </select>
              </div>
              
              <!-- Action config based on type -->
              <div v-if="rule.actionType === 'setVariable'" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Target Variable</label>
                  <select 
                    v-model="rule.targetVariable" 
                    class="form-select w-full rounded-md text-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="" disabled>Select variable</option>
                    <option v-for="v in availableVariables" :key="v.name" :value="v.name">{{ v.name }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">New Value</label>
                  <input 
                    v-model="rule.targetValue" 
                    type="text" 
                    placeholder="Value expression" 
                    class="form-input w-full rounded-md text-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <!-- Other action type configurations -->
            </div>
          </div>
          
          <!-- Navigation buttons -->
          <div class="flex justify-between mt-4">
            <RsButton @click="activeStep = 2" variant="tertiary">
              <Icon name="material-symbols:arrow-back" class="mr-1" />
              Back
            </RsButton>
            <RsButton @click="saveRules" variant="primary" :disabled="!isFormValid">
              <Icon name="material-symbols:save" class="mr-1" />
              Save Rules
            </RsButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useVariableStore } from '~/stores/variableStore';

const variableStore = useVariableStore();
const activeStep = ref(1);
const selectedVariables = ref([]);
const rules = ref([]);

// Get available variables from the store
const availableVariables = computed(() => {
  return variableStore.getAllVariables.global || [];
});

// Computed property to check if rules are valid
const hasValidRules = computed(() => {
  if (!rules.value.length) return false;
  
  return rules.value.every(rule => {
    return rule.conditions.length > 0 && 
           rule.conditions.every(c => c.variable && c.operator && c.value !== '');
  });
});

// Computed property to check if form is valid for submission
const isFormValid = computed(() => {
  if (!hasValidRules.value) return false;
  
  return rules.value.every(rule => {
    if (rule.actionType === 'setVariable') {
      return rule.targetVariable && rule.targetValue !== '';
    }
    // Add validation for other action types
    return true;
  });
});

// Add a new rule
const addRule = () => {
  rules.value.push({
    conditions: [{ variable: '', operator: '', value: '' }],
    actionType: 'setVariable',
    targetVariable: '',
    targetValue: ''
  });
};

// Remove a rule
const removeRule = (index) => {
  rules.value.splice(index, 1);
};

// Add a condition to a rule
const addCondition = (rule) => {
  rule.conditions.push({ variable: '', operator: '', value: '' });
};

// Remove a condition from a rule
const removeCondition = (rule, index) => {
  rule.conditions.splice(index, 1);
};

// Open variable manager
const openVariableManager = () => {
  // Implementation to open the variable manager modal
};

// Get color for variable type badge
const getTypeColor = (type) => {
  switch (type) {
    case 'string': return 'blue';
    case 'int': 
    case 'decimal': return 'purple';
    case 'object': return 'emerald';
    case 'datetime':
    case 'date': return 'amber';
    case 'boolean': return 'indigo';
    default: return 'gray';
  }
};

// Save the rules
const saveRules = () => {
  // Emit event with rule configuration
  emit('save', {
    rules: rules.value,
    variables: selectedVariables.value
  });
};

// Initialize with existing configuration if available
const init = (config) => {
  if (config) {
    selectedVariables.value = config.variables || [];
    rules.value = config.rules || [];
    activeStep.value = 1; // Reset to first step
  }
};

// Initialize on component mount if props are provided
onMounted(() => {
  if (props.initialConfig) {
    init(props.initialConfig);
  }
});
</script>

### 3. GatewayConditionManager.vue

The Gateway Condition Manager provides an enhanced UI for decision point configuration.

```vue
<template>
  <div>
    <!-- Header with descriptive info -->
    <div class="bg-orange-50 p-4 border-b border-orange-200">
      <div class="flex items-start">
        <div class="mr-4 text-orange-500 flex-shrink-0 mt-1">
          <Icon name="material-symbols:call-split" class="text-2xl" />
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900">Decision Point Configuration</h3>
          <p class="mt-1 text-sm text-gray-500">
            Create multiple paths with conditions to direct process flow
          </p>
        </div>
      </div>
    </div>

    <!-- Path management -->
    <div class="p-4">
      <!-- Path list with conditions -->
      <div class="space-y-4">
        <div v-for="(path, index) in paths" :key="index" class="path-item">
          <!-- Path configuration UI -->
        </div>
      </div>

      <!-- Add new path -->
      <div class="mt-4">
        <RsButton @click="addPath" variant="secondary" size="sm">
          <Icon name="material-symbols:add" class="mr-1" />
          Add Path
        </RsButton>
      </div>

      <!-- Default path configuration -->
      <div class="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h4 class="font-medium text-gray-700 mb-2">Default Path</h4>
        <p class="text-sm text-gray-500 mb-4">
          This path will be followed when no other path conditions are met
        </p>
        <!-- Default path settings -->
      </div>
    </div>
  </div>
</template>
```

### 4. ApiNodeConfiguration.vue

The API Node Configuration component provides a stepped interface for configuring API calls.

```vue
<template>
  <div>
    <!-- Header with descriptive info -->
    <div class="bg-indigo-50 p-4 border-b border-indigo-200">
      <div class="flex items-start">
        <div class="mr-4 text-indigo-500 flex-shrink-0 mt-1">
          <Icon name="material-symbols:api" class="text-2xl" />
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900">API Configuration</h3>
          <p class="mt-1 text-sm text-gray-500">
            Configure external API calls to integrate with other systems
          </p>
        </div>
      </div>
    </div>

    <!-- Step-by-step configuration -->
    <div class="p-4">
      <!-- Progress steps -->
      <div class="flex items-center mb-6">
        <!-- Step indicators -->
      </div>

      <!-- Step content -->
      <div v-if="activeStep === 1">
        <!-- Endpoint configuration -->
      </div>
      <div v-else-if="activeStep === 2">
        <!-- Request mapping -->
      </div>
      <div v-else-if="activeStep === 3">
        <!-- Response mapping -->
      </div>
    </div>
  </div>
</template>
```

### 5. FormNodeConfiguration.vue

The Form Node Configuration component provides a comprehensive 3-step interface for configuring form interactions with enhanced data mapping and conditional field behavior.

#### Architecture Overview

```vue
<template>
  <div class="form-node-configuration">
    <!-- Step 1: Form Selection -->
    <div class="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
      <div class="flex items-center mb-3">
        <div class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
          <span class="text-xs font-semibold text-emerald-600">1</span>
        </div>
        <h4 class="font-medium">Form Selection</h4>
      </div>
      
      <FormSelector 
        :formId="localNodeData.formId"
        @select="handleFormSelection"
        @clear="clearFormSelection"
      />
    </div>
    
    <!-- Step 2: Form Data Mapping -->
    <div v-if="localNodeData.formId" class="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
      <!-- Input Variables Mapping (Process → Form) -->
      <div class="mb-5">
        <div class="flex justify-between items-center mb-3">
          <h5 class="text-sm font-medium flex items-center">
            <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-xs">
              <Icon name="material-symbols:arrow-outward" />
            </span>
            Input Variables (Process → Form)
          </h5>
          <RsButton @click="addInputMapping()" variant="secondary" size="sm">
            <Icon name="material-symbols:add" class="mr-1" /> Add Mapping
          </RsButton>
        </div>
        
        <div v-for="(mapping, index) in localNodeData.inputMappings" :key="'input-' + index" 
             class="p-4 border rounded-md bg-blue-50">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormKit
              type="select"
              v-model="mapping.processVariable"
              :options="processVariableOptions"
              placeholder="Select a process variable"
            />
            <FormKit
              type="select"
              v-model="mapping.formField"
              :options="formFieldOptions"
              placeholder="Select a form field"
            />
          </div>
        </div>
      </div>
      
      <!-- Output Variables Mapping (Form → Process) -->
      <div class="mb-3">
        <div class="flex justify-between items-center mb-3">
          <h5 class="text-sm font-medium flex items-center">
            <span class="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 text-xs">
              <Icon name="material-symbols:arrow-back" />
            </span>
            Output Variables (Form → Process)
          </h5>
          <RsButton @click="addOutputMapping()" variant="secondary" size="sm">
            <Icon name="material-symbols:add" class="mr-1" /> Add Mapping
          </RsButton>
        </div>
        
        <div v-for="(mapping, index) in localNodeData.outputMappings" :key="'output-' + index" 
             class="p-4 border rounded-md bg-green-50">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormKit
              type="select"
              v-model="mapping.formField"
              :options="formFieldOptions"
              placeholder="Select a form field"
            />
            <div class="flex items-center gap-2">
              <FormKit
                type="select"
                v-model="mapping.processVariable"
                :options="[
                  { label: 'Create new variable', value: 'create_new_' + getVariableNameFromFormField(mapping.formField) },
                  ...processVariableOptions
                ]"
                placeholder="Select a variable"
              />
              <RsButton
                v-if="getStringValue(mapping.processVariable) && getStringValue(mapping.processVariable).startsWith('create_new_')"
                @click="createVariableFromMapping(mapping)"
                variant="primary"
                size="sm"
                title="Create this variable"
              >
                <Icon name="material-symbols:add" />
              </RsButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Step 3: Field Conditions -->
    <div v-if="localNodeData.formId" class="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
      <div class="flex items-center mb-3">
        <div class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
          <span class="text-xs font-semibold text-emerald-600">3</span>
        </div>
        <h4 class="font-medium">Field Conditions</h4>
      </div>
      
      <div v-for="(condition, index) in localNodeData.fieldConditions" :key="'condition-' + index" 
           class="p-4 border rounded-md bg-amber-50">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <!-- Process Variable -->
          <FormKit
            type="select"
            v-model="condition.processVariable"
            :options="processVariableOptions"
            placeholder="Select variable"
          />
          
          <!-- Operator -->
          <FormKit
            type="select"
            v-model="condition.operator"
            :options="[
              { label: 'Equals', value: 'equals' },
              { label: 'Not Equals', value: 'not_equals' },
              { label: 'Is True', value: 'is_true' },
              { label: 'Is False', value: 'is_false' },
              { label: 'Is Empty', value: 'is_empty' },
              { label: 'Is Not Empty', value: 'is_not_empty' },
              { label: 'Contains', value: 'contains' },
              { label: 'Greater Than', value: 'greater_than' },
              { label: 'Less Than', value: 'less_than' }
            ]"
            placeholder="Select operator"
          />
          
          <!-- Value -->
          <FormKit
            v-if="!['is_true', 'is_false', 'is_empty', 'is_not_empty'].includes(condition.operator)"
            type="text"
            v-model="condition.value"
            placeholder="Comparison value"
          />
          
          <!-- Target Form Field -->
          <FormKit
            type="select"
            v-model="condition.targetField"
            :options="formFieldOptions"
            placeholder="Select field"
          />
        </div>
        
        <!-- Action Row -->
        <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormKit
            type="select"
            v-model="condition.action"
            :options="[
              { label: 'Make Readonly', value: 'readonly' },
              { label: 'Hide Field', value: 'hide' },
              { label: 'Make Required', value: 'required' },
              { label: 'Make Optional', value: 'optional' },
              { label: 'Show Field', value: 'show' },
              { label: 'Enable Field', value: 'enable' }
            ]"
            placeholder="Select action"
          />
          
          <FormKit
            type="text"
            v-model="condition.description"
            placeholder="e.g., Hide email when user is resubmitting"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

#### Script Implementation

```javascript
<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useVariableStore } from '@/stores/variableStore';
import FormSelector from './FormSelector.vue';

const props = defineProps({
  nodeData: {
    type: Object,
    required: true
  },
  availableVariables: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update']);

// Get the variable store for creating variables
const variableStore = useVariableStore();

// State for form fields
const formFields = ref([]);
const isLoadingFields = ref(false);

// Local state for node data - create a deep copy to avoid mutation issues
const localNodeData = ref({
  label: 'Form Task',
  description: '',
  formId: null,
  formName: '',
  formUuid: null,
  inputMappings: [],
  outputMappings: [],
  fieldConditions: []
});

// Watch for changes from parent props
watch(() => props.nodeData, async (newNodeData) => {
  if (newNodeData) {
    // Create a deep copy to break reactivity chains with parent
    localNodeData.value = {
      label: newNodeData.label || 'Form Task',
      description: newNodeData.description || '',
      formId: newNodeData.formId || null,
      formName: newNodeData.formName || '',
      formUuid: newNodeData.formUuid || null,
      inputMappings: Array.isArray(newNodeData.inputMappings) 
        ? newNodeData.inputMappings.map(mapping => ({ ...mapping }))
        : [],
      outputMappings: Array.isArray(newNodeData.outputMappings) 
        ? newNodeData.outputMappings.map(mapping => ({ ...mapping }))
        : [],
      fieldConditions: Array.isArray(newNodeData.fieldConditions) 
        ? newNodeData.fieldConditions.map(condition => ({ ...condition }))
        : []
    };
    
    // Load form fields if form is already selected
    if (newNodeData.formId || newNodeData.formUuid) {
      await loadFormFields(newNodeData.formId || newNodeData.formUuid);
    }
  }
}, { immediate: true, deep: true });

// Function to handle form selection
async function handleFormSelection(form) {
  if (!form) return;
  
  localNodeData.value = {
    ...localNodeData.value,
    formId: form.formID,
    formName: form.formName,
    formUuid: form.formUUID,
    label: form.formName || 'Form Task',
    description: `Form: ${form.formName}`,
    fieldConditions: []
  };
  
  // Load form fields for this form
  await loadFormFields(form.formID || form.formUUID);
  
  saveChanges();
}

// Load form fields for the selected form
async function loadFormFields(formId) {
  if (!formId) {
    formFields.value = [];
    return;
  }
  
  isLoadingFields.value = true;
  
  try {
    const response = await fetch(`/api/forms/${formId}/fields`);
    const result = await response.json();
    
    if (result.success && result.fields) {
      formFields.value = result.fields;
    } else {
      console.error('Failed to load form fields:', result.error);
      formFields.value = [];
    }
  } catch (error) {
    console.error('Error loading form fields:', error);
    formFields.value = [];
  } finally {
    isLoadingFields.value = false;
  }
}

// Computed property for form field options (for FormKit select)
const formFieldOptions = computed(() => {
  return formFields.value.map(field => ({
    label: `${field.label} (${field.name})`,
    value: field.name,
    description: field.description || `${field.type} field`
  }));
});

// Computed property for process variable options (for FormKit select)
const processVariableOptions = computed(() => {
  return props.availableVariables.map(variable => ({
    label: variable.label || `${variable.name} (${variable.scope || 'unknown'})`,
    value: variable.name,
    description: variable.description || `Type: ${variable.type || 'unknown'}`
  }));
});

// Save changes by emitting them to parent
function saveChanges() {
  // Create a clean copy of the data to avoid reactivity issues
  const nodeDataCopy = {
    ...localNodeData.value,
    inputMappings: localNodeData.value.inputMappings ? 
      localNodeData.value.inputMappings.map(mapping => ({ ...mapping })) : [],
    outputMappings: localNodeData.value.outputMappings ? 
      localNodeData.value.outputMappings.map(mapping => ({ ...mapping })) : [],
    fieldConditions: localNodeData.value.fieldConditions ? 
      localNodeData.value.fieldConditions.map(condition => ({ ...condition })) : []
  };
  
  // Emit the updated data to parent
  emit('update', nodeDataCopy);
}

// Explicit save function for when the Save button is clicked
function saveAllChanges() {
  saveChanges();
}

// Expose saveAllChanges so parent components can call it
defineExpose({
  saveAllChanges
});

// Helper function to safely extract string values from FormKit select options
function getStringValue(value) {
  if (typeof value === 'string') {
    return value;
  } else if (typeof value === 'object' && value.label) {
    return value.label;
  } else if (typeof value === 'object' && value.value) {
    return value.value;
  } else {
    return '';
  }
}
</script>
```

#### Key Features

1. **3-Step Configuration Workflow**:
   - **Step 1**: Form selection with integrated FormSelector component
   - **Step 2**: Bidirectional data mapping between process variables and form fields
   - **Step 3**: Dynamic field conditions for runtime form behavior

2. **Input/Output Mappings**:
   - **Input Mappings**: Map process variables to form fields for pre-filling
   - **Output Mappings**: Capture form submission data in process variables
   - **Auto-Variable Creation**: Automatically create process variables from form fields
   - **FormKit Integration**: Seamless dropdown selection with proper v-model binding

3. **Field Conditions**:
   - **Conditional Logic**: Support for 9 different operators (equals, contains, greater than, etc.)
   - **Multiple Actions**: readonly, hide, show, required, optional, enable
   - **Process Variable Integration**: Conditions based on current process state
   - **Real-time Updates**: Dynamic form behavior during process execution

4. **Data Persistence**:
   - **Deep Copying**: Proper reactivity management to prevent data corruption
   - **Explicit Save**: Manual save mechanism with `saveAllChanges()` function exposed via `defineExpose`
   - **Change Tracking**: Reliable change detection and persistence

5. **API Integration**:
   - **Form Field Loading**: Dynamic loading of form fields via `/api/forms/{formId}/fields`
   - **Error Handling**: Comprehensive error handling for API failures
   - **Loading States**: Proper loading state management

#### Component Integration

The FormNodeConfiguration component integrates with:

- **FormSelector.vue**: For form selection and browsing
- **VariableStore**: For process variable management and creation
- **FormNodeConfigurationModal.vue**: Modal wrapper with save/cancel functionality
- **ProcessBuilder**: Main process builder integration

#### Data Flow

```
1. User selects form → handleFormSelection() → loadFormFields() → Update localNodeData
2. User adds mappings → addInputMapping()/addOutputMapping() → Update arrays → saveChanges()
3. User configures conditions → addFieldCondition() → Update conditions array → saveChanges()
4. User clicks Save → FormNodeConfigurationModal calls saveAllChanges() → emit('update', data)
5. Parent receives update → Process node data is persisted
```

This architecture ensures reliable data persistence, proper reactivity management, and seamless integration with the broader process builder system.

## State Management

The project uses Pinia for state management. Key stores include:

### processBuilder.js Enhanced with Settings Management

The Process Builder store has been enhanced to handle comprehensive process settings:

```javascript
export const useProcessBuilderStore = defineStore('processBuilder', {
  state: () => ({
    processes: [],
    currentProcess: null,
    selectedNodeId: null,
    selectedEdgeId: null,
    history: [],
    historyIndex: -1,
    unsavedChanges: false
  }),

  actions: {
    /**
     * Update the current process with new data including settings
     */
    updateCurrentProcess(processUpdates) {
      if (!this.currentProcess) return;

      this.currentProcess = {
        ...this.currentProcess,
        ...processUpdates,
        updatedAt: new Date().toISOString()
      };
      
      this.unsavedChanges = true;
      this.saveToHistory('Update process settings');
    },

    /**
     * Enhanced save process with settings persistence
     */
    async saveProcess() {
      if (!this.currentProcess) return;

      try {
        // Save process data including all settings
        const processData = {
          ...this.currentProcess,
          variables: useVariableStore().getAllVariables.process,
          // Settings are now part of the process object structure
          settings: this.currentProcess.settings || {}
        };

        // TODO: Implement API call to save process with settings
        const index = this.processes.findIndex(p => p.id === this.currentProcess.id);
        if (index !== -1) {
          this.processes[index] = processData;
        } else {
          this.processes.push(processData);
        }

        this.unsavedChanges = false;
        return true;
      } catch (error) {
        console.error('Error saving process:', error);
        return false;
      }
    }
  }
});
```

### Process Settings Data Structure

The enhanced process object now includes comprehensive settings:

```typescript
interface ProcessSettings {
  // Process Info
  priority: 'low' | 'normal' | 'high' | 'critical';
  category: string;
  owner: string;
  
  // Execution Settings
  processType: 'standard' | 'approval' | 'data_collection' | 'automation' | 'review';
  maxExecutionTime: number; // minutes
  autoTimeout: number; // hours
  allowParallel: boolean;
  enableErrorRecovery: boolean;
  sendNotifications: boolean;
  
  // Data & Variables
  dataPersistence: 'session' | 'temporary' | 'short_term' | 'long_term' | 'permanent';
  logVariableChanges: boolean;
  encryptSensitiveData: boolean;
  dataRetentionPolicy: string;
  
  // Permissions
  executionPermission: 'public' | 'authenticated' | 'roles' | 'managers' | 'admin';
  allowedRoles: string;
  modificationPermission: 'owner' | 'managers' | 'admin' | 'editors';
  requireApproval: boolean;
  enableAuditTrail: boolean;
}

interface EnhancedProcess {
  id: string;
  name: string;
  description: string;
  nodes: ProcessNode[];
  edges: ProcessEdge[];
  variables: Record<string, any>;
  settings: ProcessSettings;
  createdAt: string;
  updatedAt: string;
}
```

## Process Settings Implementation

### ProcessSettingsModal.vue Component Architecture

The Process Settings modal is implemented as a comprehensive tabbed interface:

```vue
<template>
  <RsModal v-model="showModal" title="Process Settings" size="xl" position="center">
    <div>
      <RsTab :tabs="settingsTabs" v-model="activeTab">
        <!-- 5 main tabs: info, execution, variables, permissions, json -->
        <template #info>
          <!-- Process information and ownership settings -->
        </template>
        
        <template #execution>
          <!-- Execution parameters and performance settings -->
        </template>
        
        <template #variables>
          <!-- Data persistence and security settings -->
        </template>
        
        <template #permissions>
          <!-- Access control and security policies -->
        </template>
        
        <template #json>
          <!-- Complete configuration export -->
        </template>
      </RsTab>
    </div>
    
    <template #footer>
      <div class="flex justify-end gap-2">
        <RsButton @click="closeModal" variant="tertiary">Cancel</RsButton>
        <RsButton @click="saveSettings" variant="primary">Save Settings</RsButton>
      </div>
    </template>
  </RsModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProcessBuilderStore } from '~/stores/processBuilder'
import { useVariableStore } from '~/stores/variableStore'

// Modal state management
const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Local process data for settings form
const localProcess = ref({
  // Default settings with sensible defaults
  name: '',
  description: '',
  priority: 'normal',
  category: '',
  owner: '',
  processType: 'standard',
  maxExecutionTime: 60,
  autoTimeout: 24,
  allowParallel: false,
  enableErrorRecovery: true,
  sendNotifications: true,
  dataPersistence: 'short_term',
  logVariableChanges: true,
  encryptSensitiveData: false,
  dataRetentionPolicy: '',
  executionPermission: 'authenticated',
  allowedRoles: '',
  modificationPermission: 'managers',
  requireApproval: false,
  enableAuditTrail: true
})

// Reactive sync with store
watch(() => processStore.currentProcess, (newProcess) => {
  if (newProcess) {
    localProcess.value = {
      ...localProcess.value,
      id: newProcess.id,
      name: newProcess.name || '',
      description: newProcess.description || '',
      ...newProcess.settings
    }
  }
}, { immediate: true, deep: true })

// Save settings with validation
const saveSettings = () => {
  if (processStore.currentProcess) {
    const updatedProcess = {
      ...processStore.currentProcess,
      name: localProcess.value.name,
      description: localProcess.value.description,
      settings: {
        priority: localProcess.value.priority,
        category: localProcess.value.category,
        owner: localProcess.value.owner,
        processType: localProcess.value.processType,
        maxExecutionTime: localProcess.value.maxExecutionTime,
        autoTimeout: localProcess.value.autoTimeout,
        allowParallel: localProcess.value.allowParallel,
        enableErrorRecovery: localProcess.value.enableErrorRecovery,
        sendNotifications: localProcess.value.sendNotifications
      }
    }
    
    processStore.updateCurrentProcess(updatedProcess)
  }
  
  closeModal()
}
</script>
```

### JSON Export Functionality

The JSON export feature provides comprehensive process configuration export:

```javascript
// Complete export data structure
const formattedJson = computed(() => {
  const exportData = {
    processInfo: {
      id: localProcess.value.id,
      name: localProcess.value.name,
      description: localProcess.value.description,
      priority: localProcess.value.priority,
      category: localProcess.value.category,
      owner: localProcess.value.owner
    },
    settings: {
      processType: localProcess.value.processType,
      maxExecutionTime: localProcess.value.maxExecutionTime,
      autoTimeout: localProcess.value.autoTimeout,
      allowParallel: localProcess.value.allowParallel,
      enableErrorRecovery: localProcess.value.enableErrorRecovery,
      sendNotifications: localProcess.value.sendNotifications
    },
    dataSettings: {
      dataPersistence: localProcess.value.dataPersistence,
      logVariableChanges: localProcess.value.logVariableChanges,
      encryptSensitiveData: localProcess.value.encryptSensitiveData,
      dataRetentionPolicy: localProcess.value.dataRetentionPolicy
    },
    permissions: {
      executionPermission: localProcess.value.executionPermission,
      allowedRoles: localProcess.value.allowedRoles,
      modificationPermission: localProcess.value.modificationPermission,
      requireApproval: localProcess.value.requireApproval,
      enableAuditTrail: localProcess.value.enableAuditTrail
    },
    workflow: {
      nodes: processStore.currentProcess?.nodes || [],
      edges: processStore.currentProcess?.edges || []
    },
    variables: variableStore.getAllVariables,
    metadata: {
      nodeCount: nodeCount.value,
      edgeCount: edgeCount.value,
      variableCount: variableCount.value,
      exportedAt: new Date().toISOString()
    }
  }
  
  return JSON.stringify(exportData, null, 2)
})

// Export functions
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value)
    console.log('JSON copied to clipboard')
  } catch (err) {
    console.error('Failed to copy JSON:', err)
  }
}

const downloadJson = () => {
  const blob = new Blob([formattedJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${localProcess.value.name || 'process'}_settings.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

### Integration with Process Builder

The Process Settings modal is integrated into the main Process Builder interface:

```vue
<!-- In pages/process-builder/index.vue -->
<script setup>
import ProcessSettingsModal from '~/components/process-flow/ProcessSettingsModal.vue'

// Modal state
const showProcessSettings = ref(false)
</script>

<template>
  <!-- Header dropdown menu integration -->
  <div v-if="showDropdown" class="dropdown-menu absolute right-0 mt-2 bg-white rounded shadow-lg py-1 z-10 w-48 text-gray-800">
    <button @click="showProcessSettings = true; showDropdown = false" class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
      <Icon name="material-symbols:tune" class="mr-2 w-4 h-4" />
      <span>Process Settings</span>
    </button>
    <!-- Other menu items -->
  </div>
  
  <!-- Process Settings Modal -->
  <ProcessSettingsModal v-model="showProcessSettings" />
</template>
```

### API Integration Considerations

For future API integration, the settings should be handled as follows:

```javascript
// API endpoint structure for process settings
POST /api/processes/{processId}/settings
PUT /api/processes/{processId}/settings
GET /api/processes/{processId}/settings

// Request/Response format
{
  "processInfo": {
    "name": "Customer Onboarding",
    "description": "Complete customer onboarding workflow",
    "priority": "high",
    "category": "Sales",
    "owner": "Sales Manager"
  },
  "settings": {
    "processType": "approval",
    "maxExecutionTime": 480,
    "autoTimeout": 48,
    "allowParallel": true,
    "enableErrorRecovery": true,
    "sendNotifications": true
  },
  "dataSettings": {
    "dataPersistence": "long_term",
    "logVariableChanges": true,
    "encryptSensitiveData": false,
    "dataRetentionPolicy": "Delete after 30 days"
  },
  "permissions": {
    "executionPermission": "roles",
    "allowedRoles": "hr_manager,department_head",
    "modificationPermission": "managers",
    "requireApproval": true,
    "enableAuditTrail": true
  }
}
```

### Performance Considerations

1. **Lazy Loading**: Settings are only loaded when the modal is opened
2. **Local State Management**: Changes are made to local copies to avoid unnecessary reactivity
3. **Debounced Updates**: Consider debouncing settings updates for better performance
4. **Validation**: Client-side validation before API calls

### Security Considerations

1. **Permission Validation**: Server-side validation of permission changes
2. **Audit Trail**: All settings changes should be logged
3. **Role Verification**: Verify user permissions before allowing settings modifications
4. **Data Encryption**: Implement proper encryption for sensitive settings

### variableStore.js

```javascript
import { defineStore } from 'pinia';

export const useVariableStore = defineStore('variables', {
  state: () => ({
    variables: {
      global: [],
      local: {}
    }
  }),
  
  getters: {
    getAllVariables: (state) => state.variables,
    getVariableByName: (state) => (name, scope = 'global') => {
      if (scope === 'global') {
        return state.variables.global.find(v => v.name === name);
      } else {
        return state.variables.local[scope]?.find(v => v.name === name);
      }
    }
  },
  
  actions: {
    addVariable(variable) {
      const { scope = 'global' } = variable;
      
      if (scope === 'global') {
        this.variables.global.push(variable);
      } else {
        if (!this.variables.local[scope]) {
          this.variables.local[scope] = [];
        }
        this.variables.local[scope].push(variable);
      }
    },
    
    updateVariable(name, updatedVariable, scope = 'global') {
      if (scope === 'global') {
        const index = this.variables.global.findIndex(v => v.name === name);
        if (index !== -1) {
          this.variables.global[index] = { ...updatedVariable };
        }
      } else {
        if (this.variables.local[scope]) {
          const index = this.variables.local[scope].findIndex(v => v.name === name);
          if (index !== -1) {
            this.variables.local[scope][index] = { ...updatedVariable };
          }
        }
      }
    },
    
    deleteVariable(name, scope = 'global') {
      if (scope === 'global') {
        this.variables.global = this.variables.global.filter(v => v.name !== name);
      } else if (this.variables.local[scope]) {
        this.variables.local[scope] = this.variables.local[scope].filter(v => v.name !== name);
      }
    }
  }
});
```

## UI Component Styling

The project uses Tailwind CSS for styling with consistent patterns:

### Color Theming by Component Type

Each node type has a consistent color theme:

- **Business Rules**: Purple
- **API Tasks**: Indigo
- **Form Tasks**: Emerald
- **Decision Points**: Orange
- **Variables**: Blue

### Common Visual Elements

1. **Modal Headers**:
```html
<div class="bg-{color}-50 p-4 border-b border-{color}-200">
  <div class="flex items-start">
    <div class="mr-4 text-{color}-500 flex-shrink-0 mt-1">
      <Icon name="material-symbols:{icon}" class="text-2xl" />
    </div>
    <div>
      <h3 class="text-lg font-medium text-gray-900">{Title}</h3>
      <p class="mt-1 text-sm text-gray-500">{Description}</p>
    </div>
  </div>
</div>
```

2. **Step Indicators**:
```html
<div class="flex items-center mb-6">
  <div class="flex-1">
    <button
      @click="activeStep = 1"
      :class="['step-button', activeStep === 1 ? 'active-step' : '']"
    >
      <span class="step-number">1</span>
      <span class="step-text">{Step Name}</span>
    </button>
  </div>
  <div class="step-connector"></div>
  <!-- Additional steps -->
</div>
```

3. **Empty States**:
```html
<div class="text-center py-10 px-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
  <Icon
    name="material-symbols:{icon}"
    class="w-14 h-14 mx-auto mb-3 text-gray-400"
  />
  <h4 class="text-base font-medium text-gray-900 mb-1">
    {Empty State Title}
  </h4>
  <p class="text-sm text-gray-500 mb-4 max-w-md mx-auto">
    {Empty State Description}
  </p>
  <RsButton
    @click="primaryAction"
    variant="primary"
    size="md"
  >
    <Icon name="material-symbols:add" class="mr-1" />
    {Action Text}
  </RsButton>
</div>
```

## Best Practices for Development

When developing new components or enhancing existing ones:

1. **Consistent Design Pattern**:
   - Follow the established design patterns for node configurations
   - Use the same structure for headers, step indicators, and action buttons
   - Maintain the color coding system for different node types

2. **Responsive Components**:
   - Ensure all components work on various screen sizes
   - Use responsive utilities from Tailwind
   - Test on mobile and desktop views

3. **State Management**:
   - Store node configuration in the appropriate Pinia store
   - Use reactive Vue 3 patterns with `ref`, `computed`, etc.
   - Implement proper validation before saving

4. **Accessibility**:
   - Ensure all UI elements are keyboard accessible
   - Use semantic HTML elements
   - Maintain proper focus management in modals

5. **Data Flow Visualization**:
   - Use visual indicators to show data flow direction
   - Provide clear feedback on how variables are used
   - Highlight connections between nodes

---

For user documentation and usage guidelines, please refer to [Process Builder Documentation](USER_GUIDE.md).

Last updated: December 2024 