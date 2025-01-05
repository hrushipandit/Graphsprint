import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';

const TaskGraph = ({ tasks }) => {
  useEffect(() => {
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: tasks.map(task => ({
        data: { id: task.id, label: task.title },
      })),
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
          },
        },
      ],
    });

    tasks.forEach(task => {
      task.dependencies.forEach(dep => {
        cy.add({
          data: { source: dep, target: task.id },
        });
      });
    });
  }, [tasks]);

  return <div id="cy" style={{ width: '100%', height: '400px' }} />;
};

export default TaskGraph;
