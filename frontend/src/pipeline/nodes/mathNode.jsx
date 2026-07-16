// mathNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const MathNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [operation, setOperation] = useState(data?.operation || 'add');

  useEffect(() => {
    if (data?.operation === undefined) {
      updateNodeField(id, 'operation', operation);
    }
  }, [id, data, operation, updateNodeField]);

  const handleOperationChange = (e) => {
    const val = e.target.value;
    setOperation(val);
    updateNodeField(id, 'operation', val);
  };

  const mathIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Math"
      icon={mathIcon}
      typeLabel="LOGIC NODE"
      inputs={[
        { id: 'num1', label: 'Num 1' },
        { id: 'num2', label: 'Num 2' }
      ]}
      outputs={[{ id: 'result', label: 'Result' }]}
    >
      <div className="node-control-group">
        <label className="node-label">
          <span>Operation</span>
          <select value={operation} onChange={handleOperationChange} className="node-select">
            <option value="add">Add (+)</option>
            <option value="subtract">Subtract (-)</option>
            <option value="multiply">Multiply (&times;)</option>
            <option value="divide">Divide (&divide;)</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
