// inputNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  // Sync initial state to store if not present
  useEffect(() => {
    if (data?.inputName === undefined) {
      updateNodeField(id, 'inputName', currName);
    }
    if (data?.inputType === undefined) {
      updateNodeField(id, 'inputType', inputType);
    }
  }, [id, data, currName, inputType, updateNodeField]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, 'inputName', val);
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setInputType(val);
    updateNodeField(id, 'inputType', val);
  };

  const inputIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Input"
      icon={inputIcon}
      typeLabel="I/O NODE"
      outputs={[{ id: 'value' }]}
    >
      <div className="node-control-group">
        <label className="node-label">
          <span>Name</span>
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange} 
            className="node-input"
          />
        </label>
      </div>
      <div className="node-control-group">
        <label className="node-label">
          <span>Type</span>
          <select value={inputType} onChange={handleTypeChange} className="node-select">
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
