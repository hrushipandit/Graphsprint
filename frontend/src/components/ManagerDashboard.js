// src/components/ManagerDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import GraphVisualization from "./GraphVisualization";

// Define apiClient outside the component to ensure it's only created once
const backendUrl = "http://localhost:8080";

// Axios instance with Authorization header
const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const ManagerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [epics, setEpics] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [taskDependency1, setTaskDependency1] = useState(null);
  const [taskDependency2, setTaskDependency2] = useState(null);
  const navigate = useNavigate();
  const currentUserEmail = localStorage.getItem("email");
  const filteredUsers = users.filter(email => email !== currentUserEmail);

  useEffect(() => {
    let isMounted = true; // Track if component is mounted

    const fetchData = async () => {
      try {
        if (isMounted) {
          const [userResponse, taskResponse, epicResponse, skillResponse] = await Promise.all([
            apiClient.get(`/graph/users`),
            apiClient.get(`/graph/tasks`),
            apiClient.get(`/graph/epics`),
            apiClient.get(`/graph/skills`),
          ]);

          console.log("Users Response:", userResponse.data);
          console.log("Tasks Response:", taskResponse.data);
          console.log("Epics Response:", epicResponse.data);
          console.log("Skills Response:", skillResponse.data);

          setUsers(userResponse.data);
          setTasks(taskResponse.data);
          setEpics(epicResponse.data);
          setSkills(skillResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && error.response.status === 401) {
          alert("Unauthorized. Please log in again.");
          navigate('/login');
        }
      }
    };

    fetchData(); // Fetch data initially

    const intervalId = setInterval(fetchData, 30000); // Fetch data every 30 seconds

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount
      isMounted = false; // Prevent setting state after unmount
    };
  }, [navigate]); // Removed apiClient from dependencies

  // ... (rest of your handlers remain unchanged)

  // Handle Assign Task
  const handleAssignTask = async () => {
    if (!selectedUser || !selectedTask) {
      alert("Please select both user and task.");
      return;
    }
    try {
      const response = await apiClient.post("/relationships/assign-task", {
        email: selectedUser.value,
        taskId: selectedTask.value,
      });
      alert(response.data);
      // Optionally, refresh data or update state
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Error assigning task: " + (error.response?.data || error.message));
    }
  };

  // Handle Add Skill
  const handleAddSkill = async () => {
    if (!selectedUser || !selectedSkill) {
      alert("Please select user and enter skill name.");
      return;
    }
    try {
      const response = await apiClient.post("/relationships/add-skill", {
        email: selectedUser.value,
        skillName: selectedSkill.value,
      });
      alert(response.data);
      // Optionally, refresh data or update state
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Error adding skill: " + (error.response?.data || error.message));
    }
  };

  // Handle Link Task to Epic
  const handleLinkTaskToEpic = async () => {
    if (!selectedTask || !selectedEpic) {
      alert("Please select both task and epic.");
      return;
    }
    try {
      const response = await apiClient.post("/relationships/link-task-epic", {
        taskId: selectedTask.value,
        epicId: selectedEpic.value,
      });
      alert(response.data);
      // Optionally, refresh data or update state
    } catch (error) {
      console.error("Error linking task to epic:", error);
      alert("Error linking task to epic: " + (error.response?.data || error.message));
    }
  };

  // Handle Add Task Dependency
  const handleAddTaskDependency = async () => {
    if (!taskDependency1 || !taskDependency2) {
      alert("Please select both tasks.");
      return;
    }
    try {
      const response = await apiClient.post("/relationships/add-task-dependency", {
        taskId1: taskDependency1.value,
        taskId2: taskDependency2.value,
      });
      alert(response.data);
      // Optionally, refresh data or update state
    } catch (error) {
      console.error("Error adding task dependency:", error);
      alert("Error adding task dependency: " + (error.response?.data || error.message));
    }
  };

  // Handle Delete Employee
  const handleDeleteEmployee = async (email) => {
    if (!window.confirm(`Are you sure you want to delete employee ${email}?`)) {
      return;
    }
    try {
      const response = await apiClient.delete(`/manager/employees/${email}`);
      alert(response.data);
      // Refresh user list
      setUsers(users.filter(user => user.email !== email));
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Error deleting employee: " + (error.response?.data || error.message));
    }
  };

  // Handle Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm(`Are you sure you want to delete task ${taskId}?`)) {
      return;
    }
    try {
      const response = await apiClient.delete(`/manager/tasks/${taskId}`);
      alert(response.data);
      // Refresh task list
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task: " + (error.response?.data || error.message));
    }
  };

  // Similarly, implement handleDeleteSkill, handleDeleteEpic, handleDeleteDependency

  // Map data to options for react-select
  const mapToOptions = (items, key = 'email') =>
    items.map((item) => {
      if (typeof item === 'string') {
        return { value: item, label: item };
      }
      return { value: item[key], label: item.name || item.id || item };
    });
  
  

  // Handle Add Solo Skill
  const handleAddSoloSkill = async () => {
    const skillName = prompt("Enter the name of the skill:");
    if (!skillName) {
      alert("Skill name cannot be empty.");
      return;
    }
    try {
      const response = await apiClient.post("/graph/add-skill", { skillName });
      alert(response.data);
    } catch (error) {
      console.error("Error adding solo skill:", error);
      alert("Error adding solo skill: " + (error.response?.data || error.message));
    }
  };

  // Handle Add Solo Task
  const handleAddSoloTask = async () => {
    const taskId = prompt("Enter the Task ID:");
    const taskName = prompt("Enter the Task Name:");
    if (!taskId || !taskName) {
      alert("Task ID and Name cannot be empty.");
      return;
    }
    try {
      const response = await apiClient.post("/graph/add-task", {
        taskId,
        taskName,
      });
      alert(response.data);
    } catch (error) {
      console.error("Error adding solo task:", error);
      alert("Error adding solo task: " + (error.response?.data || error.message));
    }
  };

  // Handle Add Solo Epic
  const handleAddSoloEpic = async () => {
    const epicId = prompt("Enter the Epic ID:");
    const epicTitle = prompt("Enter the Epic Title:");
    if (!epicId || !epicTitle) {
      alert("Epic ID and Title cannot be empty.");
      return;
    }
    try {
      const response = await apiClient.post("/graph/add-epic", {
        epicId,
        epicTitle,
      });
      alert(response.data);
    } catch (error) {
      console.error("Error adding solo epic:", error);
      alert("Error adding solo epic: " + (error.response?.data || error.message));
    }
  };

  // Handle Add Solo Dependency
  const handleAddSoloDependency = async () => {
    const fromTaskId = prompt("Enter the ID of the Task this depends on:");
    const toTaskId = prompt("Enter the ID of the Dependent Task:");
    if (!fromTaskId || !toTaskId) {
      alert("Both Task IDs are required.");
      return;
    }
    try {
      const response = await apiClient.post("/graph/add-dependency", {
        fromTaskId,
        toTaskId,
      });
      alert(response.data);
    } catch (error) {
      console.error("Error adding solo dependency:", error);
      alert("Error adding solo dependency: " + (error.response?.data || error.message));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manager Dashboard</h1>

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

      {/* Editable Section */}
      <section style={{ marginBottom: "30px", marginTop: "50px" }}>
        <h2>Edit Everything</h2>

        {/* Assign Task */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Assign Task to User</h3>
          <Select
            options={mapToOptions(users, 'email')}
            value={selectedUser}
            onChange={setSelectedUser}
            placeholder="Select User"
            isSearchable
          />
          <Select
            options={mapToOptions(tasks, 'id')}
            value={selectedTask}
            onChange={setSelectedTask}
            placeholder="Select Task"
            isSearchable
          />
          <button onClick={handleAssignTask} style={{ marginTop: "10px" }}>Assign Task</button>
        </div>

        {/* Add Skill */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Add Skill to User</h3>
          <Select
            options={mapToOptions(users, 'email')}
            value={selectedUser}
            onChange={setSelectedUser}
            placeholder="Select User"
            isSearchable
          />
          <Select
            options={mapToOptions(skills, 'name')}
            value={selectedSkill}
            onChange={setSelectedSkill}
            placeholder="Select Skill"
            isSearchable
          />
          <button onClick={handleAddSkill} style={{ marginTop: "10px" }}>Add Skill</button>
        </div>

        {/* Link Task to Epic */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Link Task to Epic</h3>
          <Select
            options={mapToOptions(tasks, 'id')}
            value={selectedTask}
            onChange={setSelectedTask}
            placeholder="Select Task"
            isSearchable
          />
          <Select
            options={mapToOptions(epics, 'id')}
            value={selectedEpic}
            onChange={setSelectedEpic}
            placeholder="Select Epic"
            isSearchable
          />
          <button onClick={handleLinkTaskToEpic} style={{ marginTop: "10px" }}>Link Task</button>
        </div>

        {/* Add Task Dependency */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Add Task Dependency</h3>
          <Select
            options={mapToOptions(tasks, 'id')}
            value={taskDependency1}
            onChange={setTaskDependency1}
            placeholder="Select Task 1"
            isSearchable
          />
          <Select
            options={mapToOptions(tasks, 'id')}
            value={taskDependency2}
            onChange={setTaskDependency2}
            placeholder="Select Task 2"
            isSearchable
          />
          <button onClick={handleAddTaskDependency} style={{ marginTop: "10px" }}>Add Dependency</button>
        </div>
      </section>

      <section style={{ marginBottom: "30px", marginTop: "50px" }}>
        <h2>Add Entities</h2>

        {/* Add Solo Skill */}
        <button onClick={handleAddSoloSkill} style={{ marginBottom: "10px" }}>
          Add Solo Skill
        </button>

        {/* Add Solo Task */}
        <button onClick={handleAddSoloTask} style={{ marginBottom: "10px", marginLeft: "10px" }}>
          Add Solo Task
        </button>

        {/* Add Solo Epic */}
        <button onClick={handleAddSoloEpic} style={{ marginBottom: "10px", marginLeft: "10px" }}>
          Add Solo Epic
        </button>

        {/* Add Solo Dependency */}
        <button onClick={handleAddSoloDependency} style={{ marginBottom: "10px", marginLeft: "10px" }}>
          Add Solo Dependency
        </button>
      </section>

      {/* Manage Employees */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Manage Employees</h2>
        {filteredUsers.length > 0 ? (
          <ul>
            {filteredUsers.map((email, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {email}
                <button
                  onClick={() => handleDeleteEmployee(email)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No employees found.</p>
        )}
      </section>

      {/* Manage Tasks */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Manage Tasks</h2>
        {console.log("Tasks:", tasks)} {/* Logs the tasks array */}
        <ul>
          {tasks.map((taskId) => (
            <li key={taskId} style={{ marginBottom: "10px" }}>
              Task ID: {taskId} {/* Display the task ID directly */}
              <button
                onClick={() => handleDeleteTask(taskId)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Similarly, add sections for managing Skills, Epics, and Dependencies */}
    </div>
  );
};

export default ManagerDashboard;
