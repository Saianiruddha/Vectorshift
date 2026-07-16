// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
    // Save pipeline to LocalStorage
    savePipeline: () => {
      const data = {
        nodes: get().nodes,
        edges: get().edges,
        nodeIDs: get().nodeIDs,
      };
      localStorage.setItem('vectorshift_pipeline_save', JSON.stringify(data));
    },
    // Load pipeline from LocalStorage
    loadPipeline: () => {
      const saved = localStorage.getItem('vectorshift_pipeline_save');
      if (saved) {
        const data = JSON.parse(saved);
        set({
          nodes: data.nodes || [],
          edges: data.edges || [],
          nodeIDs: data.nodeIDs || {},
        });
        return true;
      }
      return false;
    },
    // Clear the canvas
    clearCanvas: () => {
      set({
        nodes: [],
        edges: [],
        nodeIDs: {},
      });
    },
    // Load an imported JSON pipeline config directly into store state
    loadImportedPipeline: (data) => {
      set({
        nodes: data.nodes || [],
        edges: data.edges || [],
        nodeIDs: data.nodeIDs || {},
      });
    },
  }));
