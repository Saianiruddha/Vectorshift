# VectorShift Pipeline Builder

An editorial, responsive, no-code visual workflow builder designed for composing intelligent AI pipelines. Users can drag node blocks, wire connections, dynamically parameterize variables, and validate pipeline architectures.

---

## Key Features

1.  **Node Abstraction**: Extensible base component logic mapping custom target and source handles, category styling, and node lifecycle triggers.
2.  **5 Custom Nodes**: Integrates Arithmetic (Math), String Concatenation (Merge), Timing Timeout (Delay), API Auth Header (Auth), and Alert Flags (Alert) widgets.
3.  **Dynamic Prompt Parameters**: Automatically extracts double curly brace context variables (e.g. `{{ variable_name }}`) inside Text nodes on-the-fly and generates corresponding input handles.
4.  **Auto-Resizing Canvas Blocks**: Automatically recalculates layout dimensions of Text node textareas as users type to guarantee content visibility.
5.  **Mobile-First Responsive Layout**: Toolbar elements collapse into a horizontally scrollable ribbon and overlapping widgets (minimap and zoom controls) hide automatically on small screens.
6.  **FastAPI Graph Validation**: Checks pipeline structures in-memory to detect cyclical feedback loops (DAG validation) using Depth-First Search cycle detection.

---

## Directory Structure

```text
VECTOR_SHIFT/
├── backend/                      # FastAPI Backend Server
│   ├── main.py                   # Server setup, API endpoints, cycle checking
│   └── requirements.txt          # Python dependencies (FastAPI, Uvicorn, Pydantic)
│
├── frontend/                     # React Frontend App (Vite + TanStack Start + Tailwind CSS v4)
│   ├── src/
│   │   ├── pipeline/             # Core Pipeline Builder
│   │   │   ├── BaseNode.jsx      # Abstract node layout wrapper
│   │   │   ├── nodes/            # 9 Node components
│   │   │   ├── pipeline.css      # Responsive styles & variables
│   │   │   ├── store.js          # Zustand canvas state management
│   │   │   ├── submit.jsx        # Submit POST requests & Results popup modal
│   │   │   ├── toolbar.jsx       # Ribbon selection bar
│   │   │   └── ui.jsx            # ReactFlow canvas viewport board
│   │   └── routes/               # Router file paths mapping
│   ├── package.json              # Frontend package dependencies
│   ├── tsconfig.json             # TypeScript compiler config
│   └── vite.config.ts            # Vite packager setup
│
├── agent.md                      # Detailed technical guide for AI developers
├── implementation_plan.md        # Technical execution roadmap
└── README.md                     # This instructions file
```

---

## Setup & Running Guide

### 1. Backend Service (FastAPI)
Run the backend on port `8000` to handle DAG requests.

```bash
cd backend

# 1. Activate your virtual environment:
# (Windows PowerShell)
..\.venv\Scripts\activate

# 2. Start the FastAPI server:
uvicorn main:app --reload --port 8000
```
The server will run on `http://localhost:8000`.

### 2. Frontend Builder (Vite + TanStack)
Run the visual editor workspace.

```bash
cd frontend

# 1. Install dependencies:
npm install

# 2. Run the Vite development server:
npm run dev
```
The UI dashboard will run on `http://localhost:3000` (or another port displayed in your terminal).

---

## Verification & Testing

To run the in-memory cycle detection validation checks:
```bash
.\.venv\Scripts\python .agents/scratch/verify_dag.py
```
*(Tests verify valid DAG topologies, simple cycles, self-loops, and cyclical multi-component structures)*.
