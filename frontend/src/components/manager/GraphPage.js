import React from 'react';
import GraphVisualization from './GraphVisualization';
import { useNavigate } from 'react-router-dom';
import './GraphPage.css'; // Add custom styles here

const GraphPage = () => {
  const navigate = useNavigate();

  return (
    <div className="graph-page-container">
      {/* Header Section */}
      <header className="graph-page-header">
        <h1>Graph Visualization</h1>
        <button
          className="back-button"
          onClick={() => navigate('/manager-dashboard')}
        >
          Back to Manager Dashboard
        </button>
      </header>

      {/* Graph Visualization */}
      <div className="graph-container">
        <GraphVisualization backendUrl="http://localhost:8080" />
      </div>
    </div>
  );
};

export default GraphPage;
