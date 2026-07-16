// llmNode.js

import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const llmIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v2M15 1v2M9 21v2M15 21v2M20 9h3M20 15h3M1 9h2M1 15h2" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="LLM"
      icon={llmIcon}
      typeLabel="AI NODE"
      inputs={[
        { id: 'system', label: 'System', top: '33%' },
        { id: 'prompt', label: 'Prompt', top: '66%' }
      ]}
      outputs={[
        { id: 'response', label: 'Response' }
      ]}
    >
      <div className="node-text-description">
        This is a Large Language Model node. Connect System and Prompt templates to generate replies.
      </div>
    </BaseNode>
  );
};
