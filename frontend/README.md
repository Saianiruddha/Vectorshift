# VectorShift Frontend Workspace

This directory contains the user interface components of the VectorShift Pipeline Builder, built with **Vite**, **TanStack Start**, **React Flow**, **Zustand**, and **Tailwind CSS v4**.

---

## Directory Organization

*   **`src/pipeline/`**: Houses all core visual components of the builder:
    *   **`nodes/`**: Implements custom and abstracted nodes (Inputs, Outputs, LLMs, Text, Arithmetic, Merges, Timers, Auth, Alerts).
    *   **`BaseNode.jsx`**: Shared abstraction component.
    *   **`pipeline.css`**: Design system tokens and mobile responsive queries.
    *   **`store.js`**: Global canvas state manager.
    *   **`submit.jsx`**: Submit payload poster and custom modal.
    *   **`ui.jsx`**: React Flow canvas integration.
*   **`src/routes/`**: Handles TanStack React Router routes.
*   **`src/components/ui/`**: Radix UI interactive primitive components.

---

## Available Commands

In the `frontend` directory, you can run:

### `npm run dev`
Starts the Vite dev server with hot module replacement (HMR) at `http://localhost:3000`.

### `npm run build`
Compiles the TypeScript and outputs an optimized production bundle.

### `npm run lint`
Checks codebase files for style inconsistencies and compiler errors.

### `npm run format`
Runs Prettier formatting across the codebase.
