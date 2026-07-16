// textNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [currText, setCurrText] = useState(data?.text || '');
  const [variables, setVariables] = useState([]);

  // Parse variables from text
  const extractVariables = (text) => {
    const found = [];
    const regex = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!found.includes(match[1])) {
        found.push(match[1]);
      }
    }
    return found;
  };

  // Sync variables and text with store and local state
  useEffect(() => {
    const vars = extractVariables(currText);
    setVariables(vars);
    updateNodeField(id, 'text', currText);
    updateNodeField(id, 'variables', vars);
  }, [currText, id, updateNodeField]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  // Calculate dynamic dimensions based on text length and lines
  const lines = currText.split('\n');
  const longestLine = Math.max(...lines.map((l) => l.length), 10);
  const calculatedWidth = Math.min(500, Math.max(220, longestLine * 8 + 40));
  const calculatedHeight = Math.min(400, Math.max(90, lines.length * 18 + 90));

  const textIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

  // Map variables to target handles
  const inputHandles = variables.map((v) => ({
    id: v,
    label: v,
  }));

  return (
    <BaseNode
      id={id}
      title="Text"
      icon={textIcon}
      typeLabel="LOGIC NODE"
      inputs={inputHandles}
      outputs={[{ id: 'output' }]}
      style={{
        width: `${calculatedWidth}px`,
        height: `${calculatedHeight}px`,
      }}
    >
      <div className="node-control-group" style={{ height: '100%' }}>
        <label className="node-label" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <span>Text content</span>
          <textarea
            value={currText}
            onChange={handleTextChange}
            placeholder="Type content... Use {{var}} for inputs"
            className="node-textarea"
            style={{ flexGrow: 1 }}
          />
        </label>
      </div>
    </BaseNode>
  );
};
