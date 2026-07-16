// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  return (
    <div className="toolbar-container">
      <h2 className="toolbar-title">VectorShift pipeline</h2>
      <p className="toolbar-subtitle">
        Compose intelligence workflows the way your firm actually runs them —
        every node sourced, every connection considered.
      </p>
      <div className="toolbar-section-label">01 — DRAG A COMPONENT ONTO THE CANVAS</div>
      <div className="toolbar-nodes">
        <DraggableNode type='customInput' label='Input' />
        <DraggableNode type='llm' label='LLM' />
        <DraggableNode type='customOutput' label='Output' />
        <DraggableNode type='text' label='Text' />
        <DraggableNode type='math' label='Math' />
        <DraggableNode type='merge' label='Merge Strings' />
        <DraggableNode type='delay' label='Delay' />
        <DraggableNode type='auth' label='Auth' />
        <DraggableNode type='alert' label='Alert' />
      </div>
    </div>
  );
};
