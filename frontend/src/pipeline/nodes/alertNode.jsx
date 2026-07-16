// alertNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const AlertNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [alertLevel, setAlertLevel] = useState(data?.alertLevel || 'info');
  const [message, setMessage] = useState(data?.message || '');

  useEffect(() => {
    if (data?.alertLevel === undefined) {
      updateNodeField(id, 'alertLevel', alertLevel);
    }
    if (data?.message === undefined) {
      updateNodeField(id, 'message', message);
    }
  }, [id, data, alertLevel, message, updateNodeField]);

  const handleAlertLevelChange = (e) => {
    const val = e.target.value;
    setAlertLevel(val);
    updateNodeField(id, 'alertLevel', val);
  };

  const handleMessageChange = (e) => {
    const val = e.target.value;
    setMessage(val);
    updateNodeField(id, 'message', val);
  };

  const alertIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Visual Alert"
      icon={alertIcon}
      typeLabel="LOGIC NODE"
      inputs={[{ id: 'alertTrigger', label: 'Trigger' }]}
      outputs={[{ id: 'alertStatus', label: 'Status' }]}
    >
      <div className="node-control-group">
        <label className="node-label">
          <span>Level</span>
          <select value={alertLevel} onChange={handleAlertLevelChange} className="node-select">
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </label>
      </div>
      <div className="node-control-group">
        <label className="node-label">
          <span>Message</span>
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            placeholder="Alert text..."
            className="node-input"
          />
        </label>
      </div>
    </BaseNode>
  );
};
