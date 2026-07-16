// delayNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const DelayNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [delay, setDelay] = useState(data?.delay || 1);

  useEffect(() => {
    if (data?.delay === undefined) {
      updateNodeField(id, 'delay', delay);
    }
  }, [id, data, delay, updateNodeField]);

  const handleDelayChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    setDelay(val);
    updateNodeField(id, 'delay', val);
  };

  const delayIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Delay"
      icon={delayIcon}
      typeLabel="PROCESS NODE"
      inputs={[{ id: 'input', label: 'Input' }]}
      outputs={[{ id: 'delayed', label: 'Delayed' }]}
    >
      <div className="node-control-group">
        <label className="node-label">
          <span>Seconds</span>
          <input
            type="number"
            min="0"
            step="0.5"
            value={delay}
            onChange={handleDelayChange}
            className="node-input"
          />
        </label>
      </div>
    </BaseNode>
  );
};
