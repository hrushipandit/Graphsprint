// src/components/manager/ManagerDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import GraphVisualization from "./GraphVisualization";
import Chatbox from "./ChatBox";
import ManagerNavbar from "./ManagerNavbar";
import AssignTask from "./AssignTask";
import AddSkill from "./AddSkill";
import LinkTaskToEpic from "./LinkTaskToEpic";
import AddTaskDependency from "./AddTaskDependency";
import AddSoloEntities from "./AddSoloEntities";
import ManageEmployees from "./ManageEmployees";
import ManageTasks from "./ManageTasks";
import SearchUserInfo from "./SearchUserInfo";
import { useNavigate } from "react-router-dom";

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
  const filteredUsers = users.filter((email) => email !== currentUserEmail);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted) {
          const [userResponse, taskResponse, epicResponse, skillResponse] =
            await Promise.all([
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
          navigate("/login");
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

  // Handler Functions

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
      setUsers(users.filter((user) => user !== email));
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
      setTasks(tasks.filter((task) => task !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task: " + (error.response?.data || error.message));
    }
  };

  // Similarly, implement handleDeleteSkill, handleDeleteEpic, handleDeleteDependency

  // Map data to options for react-select
  const mapToOptions = (items, key = "email") =>
    items.map((item) => {
      if (typeof item === "string") {
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

  // Example: Adding a default landing page
  const DefaultPage = () => (
    <div>
      <h2>Welcome to the Manager Dashboard</h2>
      <p>Select an action from the navigation bar.</p>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manager Dashboard</h1>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }}
        style={{ float: "right" }}
      >
        Logout
      </button>

      {/* Navbar */}
      <ManagerNavbar />

      {/* Nested Routes */}
      <Routes>
        <Route path="/" element={<DefaultPage />} />
        <Route
          path="assign-task"
          element={
            <AssignTask
              users={filteredUsers}
              tasks={tasks}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              handleAssignTask={handleAssignTask}
              mapToOptions={mapToOptions}
            />
          }
        />
        <Route
          path="add-skill"
          element={
            <AddSkill
              users={filteredUsers}
              skills={skills}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              selectedSkill={selectedSkill}
              setSelectedSkill={setSelectedSkill}
              handleAddSkill={handleAddSkill}
              mapToOptions={mapToOptions}
            />
          }
        />
        <Route
          path="link-task-epic"
          element={
            <LinkTaskToEpic
              tasks={tasks}
              epics={epics}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              selectedEpic={selectedEpic}
              setSelectedEpic={setSelectedEpic}
              handleLinkTaskToEpic={handleLinkTaskToEpic}
              mapToOptions={mapToOptions}
            />
          }
        />
        <Route
          path="add-task-dependency"
          element={
            <AddTaskDependency
              tasks={tasks}
              taskDependency1={taskDependency1}
              setTaskDependency1={setTaskDependency1}
              taskDependency2={taskDependency2}
              setTaskDependency2={setTaskDependency2}
              handleAddTaskDependency={handleAddTaskDependency}
              mapToOptions={mapToOptions}
            />
          }
        />
        <Route
          path="add-solo-entities"
          element={
            <AddSoloEntities
              handleAddSoloSkill={handleAddSoloSkill}
              handleAddSoloTask={handleAddSoloTask}
              handleAddSoloEpic={handleAddSoloEpic}
              handleAddSoloDependency={handleAddSoloDependency}
            />
          }
        />
        <Route
          path="manage-employees"
          element={
            <ManageEmployees
              filteredUsers={filteredUsers}
              handleDeleteEmployee={handleDeleteEmployee}
            />
          }
        />
        <Route
          path="manage-tasks"
          element={
            <ManageTasks tasks={tasks} handleDeleteTask={handleDeleteTask} />
          }
        />
        <Route
          path="graph-visualization"
          element={<GraphVisualization />} // No props needed as backendUrl is defined within the component
        />
        <Route
          path="search-user-info"
          element={<SearchUserInfo />} // No props needed as backendUrl is defined within the component
        />
        <Route
          path="chatbox"
          element={<Chatbox />} // No props needed as backendUrl is defined within the component
        />
      </Routes>
      
    </div>
  );
};

export default ManagerDashboard;
