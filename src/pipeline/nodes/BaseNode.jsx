// BaseNode.js

import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { useShallow } from 'zustand/react/shallow';

const selector = (state) => ({
  onNodesChange: state.onNodesChange,
});

export const BaseNode = ({
  id,
  title,
  icon,
  typeLabel,
  inputs = [],
  outputs = [],
  style = {},
  children,
}) => {
  const { onNodesChange } = useStore(useShallow(selector));

  const handleDelete = () => {
    onNodesChange([{ id, type: 'remove' }]);
  };

  return (
    <div className="custom-node" style={style}>
      {/* Node Header */}
      <div className="node-header">
        <div className="node-header-title-container">
          {icon && <span className="node-header-icon">{icon}</span>}
          <div className="node-header-text">
            <span className="node-title">{title}</span>
            {typeLabel && <span className="node-type-label">{typeLabel}</span>}
          </div>
        </div>
        <button className="node-delete-btn" onClick={handleDelete} title="Delete Node">
          &times;
        </button>
      </div>

      {/* Node Body */}
      <div className="node-body">
        {children}
      </div>

      {/* Input Handles (Left Side) */}
      {inputs.map((input, idx) => {
        const topPercent = input.top !== undefined 
          ? input.top 
          : `${((idx + 1) * 100) / (inputs.length + 1)}%`;
        
        return (
          <div key={`input-container-${input.id}`} className="handle-wrapper input-handle-wrapper" style={{ top: topPercent }}>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-${input.id}`}
              className="node-handle input-handle"
            />
            {input.label && <span className="handle-label input-handle-label">{input.label}</span>}
          </div>
        );
      })}

      {/* Output Handles (Right Side) */}
      {outputs.map((output, idx) => {
        const topPercent = output.top !== undefined 
          ? output.top 
          : `${((idx + 1) * 100) / (outputs.length + 1)}%`;

        return (
          <div key={`output-container-${output.id}`} className="handle-wrapper output-handle-wrapper" style={{ top: topPercent }}>
            {output.label && <span className="handle-label output-handle-label">{output.label}</span>}
            <Handle
              type="source"
              position={Position.Right}
              id={`${id}-${output.id}`}
              className="node-handle output-handle"
            />
          </div>
        );
      })}
    </div>
  );
};
