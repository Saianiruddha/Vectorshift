// mergeNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const MergeNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [separator, setSeparator] = useState(data?.separator || ', ');

  useEffect(() => {
    if (!data?.separator) {
      updateNodeField(id, 'separator', separator);
    }
  }, [id, data, separator, updateNodeField]);

  const handleSeparatorChange = (e) => {
    const val = e.target.value;
    setSeparator(val);
    updateNodeField(id, 'separator', val);
  };

  const mergeIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V13m0 0l-5-5m5 5l5-5" />
      <path d="M4 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Merge Strings"
      icon={mergeIcon}
      typeLabel="UTILITY NODE"
      inputs={[
        { id: 'inputA', label: 'Str A' },
        { id: 'inputB', label: 'Str B' }
      ]}
      outputs={[{ id: 'merged', label: 'Merged' }]}
    >
      <div className="node-control-group">
        <label className="node-label">
          <span>Separator</span>
          <input
            type="text"
            value={separator}
            onChange={handleSeparatorChange}
            placeholder="e.g. , or space"
            className="node-input"
          />
        </label>
      </div>
    </BaseNode>
  );
};
