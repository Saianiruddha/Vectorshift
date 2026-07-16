# VectorShift Pipeline Builder: Project Documentation & Agent Guide

This file provides a comprehensive overview of the VectorShift Pipeline Builder project, detailing its architecture, file structure, endpoint contracts, and core algorithmic mechanisms.

---

## 1. Project Overview & Architecture

The application is a visual workflow builder that allows users to create node-based generative AI pipelines by dragging components onto a canvas, wiring inputs and outputs, and analyzing the resulting graphs.

```mermaid
graph TD
    A[React Flow UI] -->|Drag & Drop| B[Zustand Store]
    B -->|State Sync| A
    A -->|POST JSON Payload| C[FastAPI Backend]
    C -->|Cycle Detection & Statistics| A
```

*   **Frontend (React & ReactFlow)**: Renders a drag-and-drop workspace utilizing [React Flow](https://reactflow.dev/) for canvas management. It stores nodes, edges, connections, and custom field states inside a global **Zustand** store.
*   **Backend (FastAPI)**: Performs graph analysis on the generated pipelines. It calculates the number of nodes, number of edges, and verifies whether the network forms a **Directed Acyclic Graph (DAG)** using DFS-based cycle detection.

---

## 2. Directory & File Structure

```text
VECTOR_SHIFT/
├── backend/                      # FastAPI Backend Directory
│   ├── main.py                   # Main FastAPI server (CORS, Endpoint, Cycle Validation)
│   └── requirements.txt          # Python dependencies (FastAPI, Uvicorn, Pydantic)
│
├── frontend/                     # React Frontend Directory
│   ├── public/                   # Static browser assets
│   ├── src/
│   │   ├── nodes/                # Pipeline Node components
│   │   │   ├── BaseNode.js       # Node abstraction wrapper (Handles, styling, layout)
│   │   │   ├── inputNode.js      # Input component (I/O)
│   │   │   ├── outputNode.js     # Output component (I/O)
│   │   │   ├── llmNode.js        # LLM component (AI Model)
│   │   │   ├── textNode.js       # Text component (Logic, variable handles, auto-resize)
│   │   │   ├── mathNode.js       # Arithmetic component
│   │   │   ├── mergeNode.js      # Concatenation component
│   │   │   ├── delayNode.js      # Timeout delay component
│   │   │   ├── authNode.js       # API key/scope credential component
│   │   │   └── alertNode.js      # Visual notification flag component
│   │   │
│   │   ├── App.js                # Core entry-point layout
│   │   ├── draggableNode.js      # Sidebar item wrapper providing HTML5 drag-and-drop
│   │   ├── index.css             # Glassmorphic style design system (variables, animations)
│   │   ├── index.js              # React DOM mounting
│   │   ├── store.js              # Zustand store managing ReactFlow nodes and edges
│   │   ├── submit.js             # Submit button calling the backend and showing results modal
│   │   ├── toolbar.js            # Node sidebar selection dashboard
│   │   └── ui.js                 # Drag over listener, drop coordinator, & ReactFlow canvas
│   │
│   ├── package.json              # Node dependencies (React, ReactFlow, Zustand)
│   └── package-lock.json         # Pinned packages lockfile
│
├── agent.md                      # This documentation file
└── implementation_plan.md        # Original implementation architectural plan
```

---

## 3. Detailed Component Descriptions

### Frontend Components (`frontend/src/`)

*   **`nodes/BaseNode.js`**:
    A shared container layout that wraps all nodes. It renders node category labels, icons, name titles, a delete button (calling `onNodesChange` to delete the node), and maps custom target (left) and source (right) handles based on configuration.
*   **`nodes/textNode.js`**:
    Features two core dynamic behaviors:
    1.  **Dynamic Resizing**: The `<textarea>` length of the longest line and the total line breaks are computed on input, scaling the node's `width` and `height` dynamically.
    2.  **Dynamic Handles**: Uses regex `{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}` to extract valid Javascript variable names typed inside double curly braces. These variables are mapped into target (left) input handles dynamically and spaced out evenly.
*   **`store.js`**:
    Provides Zustand store triggers:
    *   `nodes` & `edges`: Array structures containing standard ReactFlow elements.
    *   `updateNodeField(nodeId, fieldName, fieldValue)`: Propagates data entered inside input boxes (like names or selects) back to the global `nodes` data list so the values are included when sent to the backend.
*   **`submit.js`**:
    Pulls `nodes` and `edges` from the store on click, sends them to the backend, and opens a glassmorphic modal overlay reporting node metrics and verifying if the graph is a DAG.

### Backend Component (`backend/main.py`)

*   **FastAPI Application**:
    Runs an API server configured with CORS middleware allowing requests from `localhost:3000`.
*   **DAG Validation System**:
    Converts node coordinates and list configurations into an adjacency list representation `node_id -> [neighbor_id, ...]`. Runs a recursive Depth-First Search (DFS) tracking visited vertices and active paths on the recursion stack to check for cycle signatures.

---

## 4. Backend Endpoint Specification

### **POST** `/pipelines/parse`

Validates pipeline structures and checks for loops.

*   **Request Payload**:
    ```json
    {
      "nodes": [
        {
          "id": "text-1",
          "type": "text",
          "data": {
            "text": "Hello {{ name }}",
            "variables": ["name"]
          }
        }
      ],
      "edges": [
        {
          "id": "reactflow__edge-input_1-value-text_1-name",
          "source": "input-1",
          "sourceHandle": "input-1-value",
          "target": "text-1",
          "targetHandle": "text-1-name"
        }
      ]
    }
    ```

*   **Response Payload**:
    ```json
    {
      "num_nodes": 2,
      "num_edges": 1,
      "is_dag": true
    }
    ```

---

## 5. Local Operations Quickstart

### Running Backend
```bash
cd backend
# Make sure virtual env is active: (e.g. ..\.venv\Scripts\activate on Windows)
uvicorn main:app --reload --port 8000
```

### Running Frontend
```bash
cd frontend
npm install
npm start
```
The React workspace will be accessible at `http://localhost:3000`.
