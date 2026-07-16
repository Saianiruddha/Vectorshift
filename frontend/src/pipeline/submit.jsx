// submit.js

import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const nodeIDs = useStore((state) => state.nodeIDs);
  
  const savePipeline = useStore((state) => state.savePipeline);
  const loadPipeline = useStore((state) => state.loadPipeline);
  const loadImportedPipeline = useStore((state) => state.loadImportedPipeline);
  const clearCanvas = useStore((state) => state.clearCanvas);
  
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

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the canvas? This will delete all nodes and connections.")) {
      clearCanvas();
      setStatusText('Canvas Cleared!');
      setTimeout(() => setStatusText(''), 2000);
    }
  };

  const handleExport = () => {
    try {
      const data = { nodes, edges, nodeIDs };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', 'vectorshift_pipeline.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setStatusText('JSON Exported!');
      setTimeout(() => setStatusText(''), 2000);
    } catch (error) {
      alert(`Export failed: ${error.message}`);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        if (!parsedData.nodes || !parsedData.edges) {
          throw new Error("Invalid structure: missing nodes or edges.");
        }
        loadImportedPipeline(parsedData);
        setStatusText('JSON Imported!');
        setTimeout(() => setStatusText(''), 2000);
      } catch (error) {
        alert(`Import failed: ${error.message}`);
      }
    };
    fileReader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  return (
    <>
      <div className="submit-panel">
        {/* Hidden file input for JSON Import */}
        <input
          type="file"
          id="import-pipeline-file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />

        <button className="secondary-submit-btn clear-action-btn" onClick={handleClear} title="Wipe canvas board">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
          <span>Clear</span>
        </button>

        <div className="panel-divider"></div>

        <button className="secondary-submit-btn" onClick={handleSave} title="Save Pipeline Layout to Browser">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          <span>Save</span>
        </button>

        <button className="secondary-submit-btn" onClick={handleLoad} title="Load Pipeline Layout from Browser">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Load</span>
        </button>

        <div className="panel-divider"></div>

        <button className="secondary-submit-btn" onClick={handleExport} title="Download workflow config as .json">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Export</span>
        </button>

        <button className="secondary-submit-btn" onClick={() => document.getElementById('import-pipeline-file').click()} title="Upload workflow config from .json">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Import</span>
        </button>

        <div className="panel-divider"></div>

        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <span>Processing...</span>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Suggested execution path timeline */}
            {modalData.is_dag && modalData.topological_order && modalData.topological_order.length > 0 && (
              <div className="modal-timeline-section">
                <h4 className="modal-section-subtitle">Suggested Execution Path</h4>
                <div className="timeline-container">
                  {modalData.topological_order.map((stepLabel, idx) => (
                    <div key={idx} className="timeline-step">
                      <div className="timeline-dot-connector">
                        <div className="timeline-dot"></div>
                        {idx < modalData.topological_order.length - 1 && <div className="timeline-line"></div>}
                      </div>
                      <div className="timeline-step-content">
                        <span className="timeline-step-number">0{idx + 1}</span>
                        <span className="timeline-step-label">{stepLabel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="modal-close-btn" onClick={() => setIsOpen(false)}>
              Back to Builder
            </button>
          </div>
        </div>
      )}
    </>
  );
};
