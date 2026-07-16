// authNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const AuthNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [authType, setAuthType] = useState(data?.authType || 'apiKey');
  const [scope, setScope] = useState(data?.scope || 'read');

  useEffect(() => {
    if (!data?.authType) {
      updateNodeField(id, 'authType', authType);
    }
    if (!data?.scope) {
      updateNodeField(id, 'scope', scope);
    }
  }, [id, data, authType, scope, updateNodeField]);

  const handleAuthTypeChange = (e) => {
    const val = e.target.value;
    setAuthType(val);
    updateNodeField(id, 'authType', val);
  };

  const handleScopeChange = (e) => {
    const val = e.target.value;
    setScope(val);
    updateNodeField(id, 'scope', val);
  };

  const authIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Authentication"
      icon={authIcon}
      typeLabel="SECURITY NODE"
      inputs={[{ id: 'authInput', label: 'Trigger' }]}
      outputs={[{ id: 'token', label: 'Token' }]}
    >
      <div className="node-control-group">
        <label className="node-label">
          <span>Auth Type</span>
          <select value={authType} onChange={handleAuthTypeChange} className="node-select">
            <option value="apiKey">API Key</option>
            <option value="bearer">Bearer Token</option>
            <option value="oauth2">OAuth 2.0</option>
          </select>
        </label>
      </div>
      <div className="node-control-group">
        <label className="node-label">
          <span>Scope</span>
          <input
            type="text"
            value={scope}
            onChange={handleScopeChange}
            placeholder="e.g. read:users"
            className="node-input"
          />
        </label>
      </div>
    </BaseNode>
  );
};
