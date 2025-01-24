// src/components/employee/EmployeeDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import EmployeeNavbar from "./EmployeeNavbar";
import ViewTasks from "./ViewTasks";
import UpdateTaskStatus from "./UpdateTaskStatus";
import { useNavigate } from "react-router-dom";
import './EmployeeStyles.css'; // Import the CSS for styling

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const backendUrl = "http://localhost:8080";

  const apiClient = axios.create({
    baseURL: backendUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  console.log("Auth Token:", localStorage.getItem("token"));
  console.log("Auth Token:", localStorage.getItem("role"));
  useEffect(() => {
    let isMounted = true;
    const name = localStorage.getItem("name");
    const fetchTasks = async () => {
      try {
        const response = await apiClient.get(`/employee/tasks?name=${encodeURIComponent(name)}`);
        if (isMounted) {
          setTasks(response.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (error.response && error.response.status === 401) {
          alert("Unauthorized. Please log in again.");
          navigate('/login');
        }
      }
    };
  
    // Delay the initial fetch with a timer
    const timeoutId = setTimeout(() => {
      fetchTasks(); // Fetch tasks after delay
      const intervalId = setInterval(fetchTasks, 30000); // Refresh tasks every 30 seconds
  
      // Cleanup function to clear interval and timeout
      return () => {
        clearInterval(intervalId);
        isMounted = false;
      };
    }, 10000); // Delay of 5 seconds before the first API call
  
    return () => {
      clearTimeout(timeoutId);
      isMounted = false;
    };
  }, [apiClient, navigate]);
  

  // Handler to update task status
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    if (!newStatus) {
      alert("Please enter a new status.");
      return;
    }
    try {
      const response = await apiClient.put(`/employee/tasks/${taskId}/status`, {
        status: newStatus,
      });
      alert(response.data);
      // Optionally, refresh tasks
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Error updating task status: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="employee-container">
      <h1>Employee Dashboard</h1>

      {/* Logout Button */}
      <button
        className="logout-button"
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          navigate('/login');
        }}
      >
        Logout
      </button>

      {/* Navbar */}
      <EmployeeNavbar />

      {/* Nested Routes */}
      <Routes>
        <Route
          path="view-tasks"
          element={<ViewTasks tasks={tasks} />}
        />
        <Route
          path="update-task-status"
          element={<UpdateTaskStatus tasks={tasks} onUpdateStatus={handleUpdateTaskStatus} />}
        />
        {/* Add more routes for additional functionalities as needed */}
        <Route
          path=""
          element={
            <div className="employee-section">
              <h2>Welcome to the Employee Dashboard</h2>
              <p>Select an action from the navigation bar.</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default EmployeeDashboard;
