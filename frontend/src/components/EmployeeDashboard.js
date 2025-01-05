// src/components/EmployeeDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import GraphVisualization from "./GraphVisualization";

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState("");
  const navigate = useNavigate();

  const backendUrl = "http://localhost:8080";

  const apiClient = axios.create({
    baseURL: backendUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await apiClient.get(`/employee/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (error.response && error.response.status === 401) {
          alert("Unauthorized. Please log in again.");
          navigate('/login');
        }
      }
    };
    fetchTasks();
  }, [apiClient, navigate]);

  const handleUpdateTaskStatus = async () => {
    if (!selectedTask || !taskStatus) {
      alert("Please select a task and enter a status.");
      return;
    }
    try {
      const response = await apiClient.put(`/employee/tasks/${selectedTask.value}/status`, {
        status: taskStatus,
      });
      alert(response.data);
      // Optionally, refresh task list
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Error updating task status: " + (error.response?.data || error.message));
    }
  };

  const mapToOptions = (items, key = 'id') =>
    items
      .filter(item => item[key] && item.name) // Filter out items with null/undefined
      .map((item) => ({
        value: item[key],
        label: item.name || item[key],
      }));

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee Dashboard</h1>

      {/* Logout Button */}
      <button onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      }} style={{ float: 'right' }}>
        Logout
      </button>

      {/* Visualization */}
      <GraphVisualization backendUrl={backendUrl} />

      {/* Manage Tasks */}
      <section style={{ marginTop: "50px" }}>
        <h2>Your Tasks</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: "10px" }}>
              {task.name} (ID: {task.id}) - Status: {task.status}
            </li>
          ))}
        </ul>
      </section>

      {/* Update Task Status */}
      <section style={{ marginTop: "30px" }}>
        <h2>Update Task Status</h2>
        <Select
          options={mapToOptions(tasks, 'id')}
          value={selectedTask}
          onChange={setSelectedTask}
          placeholder="Select Task"
          isSearchable
        />
        <input
          type="text"
          placeholder="New Status"
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
          style={{ marginTop: "10px", display: "block" }}
        />
        <button onClick={handleUpdateTaskStatus} style={{ marginTop: "10px" }}>Update Status</button>
      </section>
    </div>
  );
};

export default EmployeeDashboard;
