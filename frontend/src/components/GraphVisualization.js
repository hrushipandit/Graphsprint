// src/components/GraphVisualization.js

import React, { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import axios from "axios";

const backendUrl = "http://localhost:8080";

// Axios instance with Authorization header
const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const GraphVisualization = ({ backendUrl }) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const [usersRes, tasksRes, epicsRes, skillsRes, relationshipsRes] =
          await Promise.all([
            apiClient.get(`${backendUrl}/graph/users`),
            apiClient.get(`${backendUrl}/graph/tasks`),
            apiClient.get(`${backendUrl}/graph/epics`),
            apiClient.get(`${backendUrl}/graph/skills`),
            apiClient.get(`${backendUrl}/graph/relationships`),
          ]);

        const users = usersRes.data.filter(email => email && email !== 'null'); // Filter out null/undefined/'null' emails
        const tasks = tasksRes.data.filter(id => id && id !== 'null'); // Filter out null/undefined/'null' task IDs
        const epics = epicsRes.data.filter(id => id && id !== 'null'); // Filter out null/undefined/'null' epic IDs
        const skills = skillsRes.data.filter(name => name && name !== 'null'); // Filter out null/undefined/'null' skill names
        const relationships = relationshipsRes.data.filter(
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
        ); // Filter out invalid relationships

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
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchGraphData();
  }, [backendUrl]);

  const initialLayout = {
    name: "grid",
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
        "font-size": "12px", // Increased font size for better visibility
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
    <CytoscapeComponent
      elements={elements.length > 0 ? elements : []}
      style={{ width: "100%", height: "600px" }}
      layout={initialLayout}
      stylesheet={style}
      cy={(cy) => {
        cy.ready(() => {
          // Fit the graph to the container size initially

          // Change layout to circle after 2 seconds without resetting zoom
          setTimeout(() => {
            const circleLayout = cy.layout({
              name: "circle",
              animate: true,
              fit: false, // Do not auto-fit during layout change
              padding: 30,
            });
            circleLayout.run();
          }, 2000);
        });

        // Enable zooming and panning
        cy.zoomingEnabled(true);
        cy.panningEnabled(true);
        cy.minZoom(0.5); // Minimum zoom level
        cy.maxZoom(3); // Maximum zoom level

        // Optional: Add event listeners or additional configurations
        cy.on("zoom", (event) => {
          console.log("Zoom level:", cy.zoom());
        });
      }}
    />
  );
};

export default GraphVisualization;
