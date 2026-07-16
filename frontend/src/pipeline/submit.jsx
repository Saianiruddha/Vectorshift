// submit.js

import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const savePipeline = useStore((state) => state.savePipeline);
  const loadPipeline = useStore((state) => state.loadPipeline);
  
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState('');

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

  const handleSave = () => {
    savePipeline();
    setStatusText('Pipeline Saved!');
    setTimeout(() => setStatusText(''), 2000);
  };

  const handleLoad = () => {
    const loaded = loadPipeline();
    if (loaded) {
      setStatusText('Pipeline Loaded!');
      setTimeout(() => setStatusText(''), 2000);
    } else {
      alert('No saved pipeline found in local storage.');
    }
  };

  return (
    <>
      <div className="submit-panel">
        <button className="secondary-submit-btn" onClick={handleSave} title="Save Pipeline Layout">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          <span>Save</span>
        </button>

        <button className="secondary-submit-btn" onClick={handleLoad} title="Load Pipeline Layout">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Load</span>
        </button>

        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <span>Processing...</span>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Submit</span>
            </>
          )}
        </button>

        {statusText && (
          <div className="save-toast-indicator">
            {statusText}
          </div>
        )}
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
