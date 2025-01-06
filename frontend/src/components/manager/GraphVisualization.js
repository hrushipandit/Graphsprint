// src/components/manager/GraphVisualization.js

import React, { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './GraphVisualization.css'; // Import CSS for styling

const backendUrl = "http://localhost:8080";

// Axios instance with Authorization header
const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const GraphVisualization = () => {
  const [elements, setElements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const [usersRes, tasksRes, epicsRes, skillsRes, relationshipsRes] =
          await Promise.all([
            apiClient.get(`/graph/users`),
            apiClient.get(`/graph/tasks`),
            apiClient.get(`/graph/epics`),
            apiClient.get(`/graph/skills`),
            apiClient.get(`/graph/relationships`),
          ]);

        // Validate and filter data
        const users = Array.isArray(usersRes.data) ? usersRes.data.filter(email => email && email !== 'null') : [];
        const tasks = Array.isArray(tasksRes.data) ? tasksRes.data.filter(id => id && id !== 'null') : [];
        const epics = Array.isArray(epicsRes.data) ? epicsRes.data.filter(id => id && id !== 'null') : [];
        const skills = Array.isArray(skillsRes.data) ? skillsRes.data.filter(name => name && name !== 'null') : [];
        const relationships = Array.isArray(relationshipsRes.data) ? relationshipsRes.data.filter(
          rel =>
            rel.fromId &&
            rel.toId &&
            rel.fromLabel &&
            rel.toLabel &&
            rel.relationship &&
            rel.fromId !== 'null' &&
            rel.toId !== 'null' &&
            rel.fromLabel !== 'null' &&
            rel.toLabel !== 'null' &&
            rel.relationship !== 'null'
        ) : [];

        // Create nodes
        const nodes = [
          ...users.map((email) => ({
            data: { id: `User_${email}`, label: email, type: "User" },
          })),
          ...tasks.map((id) => ({
            data: { id: `Task_${id}`, label: id, type: "Task" },
          })),
          ...epics.map((id) => ({
            data: { id: `Epic_${id}`, label: id, type: "Epic" },
          })),
          ...skills.map((name) => ({
            data: { id: `Skill_${name}`, label: name, type: "Skill" },
          })),
        ];

        // Create a Set of valid node IDs for quick lookup
        const validNodeIds = new Set(nodes.map(node => node.data.id));

        // Create edges, ensuring both source and target exist
        const edges = relationships
          .filter(rel => {
            const sourceId = `${rel.fromLabel}_${rel.fromId}`;
            const targetId = `${rel.toLabel}_${rel.toId}`;
            const sourceExists = validNodeIds.has(sourceId);
            const targetExists = validNodeIds.has(targetId);

            if (!sourceExists) {
              console.warn(`Source node ${sourceId} does not exist.`);
            }
            if (!targetExists) {
              console.warn(`Target node ${targetId} does not exist.`);
            }

            return sourceExists && targetExists;
          })
          .map((rel) => ({
            data: {
              id: `${rel.relationship}_${rel.fromId}_${rel.toId}`,
              source: `${rel.fromLabel}_${rel.fromId}`,
              target: `${rel.toLabel}_${rel.toId}`,
              label: rel.relationship,
            },
          }));

        setElements([...nodes, ...edges]);
        console.log("Graph Elements:", [...nodes, ...edges]); // Debugging
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchGraphData();
  }, []);

  const initialLayout = {
    name: "cose",
    animate: true,
    fit: true,
    padding: 30,
  };

  const style = [
    {
      selector: "node",
      style: {
        "background-color": "#0074D9",
        label: "data(label)",
        color: "#fff",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": "12px",
      },
    },
    {
      selector: 'node[type="User"]',
      style: {
        "background-color": "#2ECC40",
      },
    },
    {
      selector: 'node[type="Task"]',
      style: {
        "background-color": "#FF4136",
      },
    },
    {
      selector: 'node[type="Epic"]',
      style: {
        "background-color": "#FF851B",
      },
    },
    {
      selector: 'node[type="Skill"]',
      style: {
        "background-color": "#B10DC9",
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        label: "data(label)",
        "font-size": "8px",
        "text-rotation": "autorotate",
      },
    },
  ];

  return (
    <div className="graph-visualization-container">
      <h2>Graph Visualization</h2>
      {/* Back to Home Button */}
      <button
        className="back-button"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
      <CytoscapeComponent
        elements={elements.length > 0 ? elements : []}
        style={{ width: "100%", height: "600px", border: "1px solid #ccc", borderRadius: "8px" }}
        layout={initialLayout}
        stylesheet={style}
        cy={(cy) => {
          cy.ready(() => {
            cy.layout(initialLayout).run();
          });

          // Enable zooming and panning
          cy.zoomingEnabled(true);
          cy.panningEnabled(true);
          cy.minZoom(0.5);
          cy.maxZoom(3);

          // Optional: Add event listeners or additional configurations
          cy.on("zoom", (event) => {
            console.log("Zoom level:", cy.zoom());
          });
        }}
      />
    </div>
  );
};

export default GraphVisualization;
