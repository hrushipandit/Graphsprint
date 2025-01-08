import React, { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./GraphVisualization.css"; // Import CSS for styling

const backendUrl = "http://localhost:8080";

// Axios instance with Authorization header
const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const UserGraphVisualization = () => {
  const [elements, setElements] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("All");
  const navigate = useNavigate();

  // Fetch users for the dropdown
  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/graph/users");
      setUsers(["All", ...response.data]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch graph data based on the selected user
  const fetchGraphData = async (userEmail = "All") => {
    try {
      const relationshipsEndpoint =
        userEmail === "All" ? "/graph/relationships" : `/graph/relationships?email=${userEmail}`;
      const [tasksRes, epicsRes, skillsRes, relationshipsRes] = await Promise.all([
        apiClient.get("/graph/tasks"),
        apiClient.get("/graph/epics"),
        apiClient.get("/graph/skills"),
        apiClient.get(relationshipsEndpoint),
      ]);

      const tasks = tasksRes.data.filter((id) => id && id !== "null");
      const epics = epicsRes.data.filter((id) => id && id !== "null");
      const skills = skillsRes.data.filter((name) => name && name !== "null");
      const relationships = relationshipsRes.data.filter(
        (rel) =>
          rel.fromId &&
          rel.toId &&
          rel.fromLabel &&
          rel.toLabel &&
          rel.relationship &&
          rel.fromId !== "null" &&
          rel.toId !== "null"
      );

      const nodes = [
        ...(userEmail === "All"
          ? tasks.map((id) => ({
              data: { id: `Task_${id}`, label: id, type: "Task" },
            }))
          : []),
        ...epics.map((id) => ({
          data: { id: `Epic_${id}`, label: id, type: "Epic" },
        })),
        ...skills.map((name) => ({
          data: { id: `Skill_${name}`, label: name, type: "Skill" },
        })),
        ...(userEmail === "All"
          ? []
          : [{ data: { id: `User_${userEmail}`, label: userEmail, type: "User" } }]),
      ];

      const edges = relationships.map((rel) => ({
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

  useEffect(() => {
    fetchUsers();
    fetchGraphData();
  }, []);

  // Handle user selection
  const handleUserChange = (event) => {
    const selectedEmail = event.target.value;
    setSelectedUser(selectedEmail);
    fetchGraphData(selectedEmail);
  };

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
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>

      {/* User Selection Dropdown */}
      <div className="user-selection">
        <label htmlFor="user-select">Filter by User: </label>
        <select
          id="user-select"
          value={selectedUser}
          onChange={handleUserChange}
        >
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <CytoscapeComponent
        elements={elements.length > 0 ? elements : []}
        style={{ width: "100%", height: "600px", border: "1px solid #ccc", borderRadius: "8px" }}
        layout={initialLayout}
        stylesheet={style}
      />
    </div>
  );
};

export default UserGraphVisualization;
