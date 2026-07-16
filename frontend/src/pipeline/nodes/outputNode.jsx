// outputNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  // Sync initial state to store if not present
  useEffect(() => {
    if (data?.outputName === undefined) {
      updateNodeField(id, 'outputName', currName);
    }
    if (data?.outputType === undefined) {
      updateNodeField(id, 'outputType', outputType);
    }
  }, [id, data, currName, outputType, updateNodeField]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCurrName(val);
    updateNodeField(id, 'outputName', val);
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setOutputType(val);
    updateNodeField(id, 'outputType', val);
  };

  const outputIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Output"
      icon={outputIcon}
      typeLabel="I/O NODE"
      inputs={[{ id: 'value' }]}
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
          <select value={outputType} onChange={handleTypeChange} className="node-select">
            <option value="Text">Text</option>
            <option value="Image">Image</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
