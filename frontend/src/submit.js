// submit.js

import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Send the current nodes and edges to the FastAPI backend
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse pipeline');
      }

      const data = await response.json();
      setModalData(data);
      setIsOpen(true);
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend. Please ensure the backend is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="submit-panel">
        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <span>Processing...</span>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Submit Pipeline</span>
            </>
          )}
        </button>
      </div>

      {isOpen && modalData && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Pipeline Analysis Results</h3>
            
            <div className="modal-stats">
              <div className="modal-stat-row">
                <span className="modal-stat-label">Total Nodes</span>
                <span className="modal-stat-value">{modalData.num_nodes}</span>
              </div>
              <div className="modal-stat-row">
                <span className="modal-stat-label">Total Edges</span>
                <span className="modal-stat-value">{modalData.num_edges}</span>
              </div>
              <div className="modal-stat-row">
                <span className="modal-stat-label">DAG Validated</span>
                <span className={`modal-stat-value ${modalData.is_dag ? 'dag-yes' : 'dag-no'}`}>
                  {modalData.is_dag ? 'Yes (Acyclic)' : 'No (Cycle Detected)'}
                </span>
              </div>
            </div>

            <button className="modal-close-btn" onClick={() => setIsOpen(false)}>
              Back to Builder
            </button>
          </div>
        </div>
      )}
    </>
  );
};
