import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

const ManageEntities = ({
  tasks = [],
  skills = [],
  epics = [],
  handleDeleteTask = () => {},
  taskDependency1,
  taskDependency2,
  setTaskDependency1,
  setTaskDependency2,
  filteredUsers = [],
  mapToOptions = () => [],
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedEpic, setSelectedEpic] = useState("");

  const backendUrl = "http://localhost:8080";

  // Axios instance with Authorization header
  const apiClient = axios.create({
    baseURL: backendUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Function to handle deletion
  const handleDelete = async (entity, id, params = {}) => {
    try {
      let url = `${backendUrl}/manager/${entity}/${id}`;
      if (entity === "dependencies") {
        url = `${backendUrl}/manager/dependencies?taskId1=${params.taskId1}&taskId2=${params.taskId2}`;
      }
      const response = await apiClient.delete(url);

      if (response.status === 200) {
        alert(`${entity} deleted successfully`);
      } else {
        alert(`Error deleting ${entity}: ${response.data}`);
      }
    } catch (error) {
      alert(`Failed to delete ${entity}: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Entities</h2>

      <div style={{ marginBottom: "20px" }}>
  <h3>Delete Employee</h3>
  <select
    value={selectedEmployee}
    onChange={(e) => setSelectedEmployee(e.target.value)}
  >
    <option value="">Select an Employee</option>
    {filteredUsers
      ?.filter((email) => email !== localStorage.getItem("name")) // Filter out current user
      .map((email) => (
        <option key={email} value={email}>
          {email}
        </option>
      ))}
  </select>
  <button
    onClick={() => handleDelete("employees", selectedEmployee)}
    disabled={!selectedEmployee}
  >
    Delete Employee
  </button>
</div>

      {/* Delete Task */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Delete Task</h3>
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
        >
          <option value="">Select a Task</option>
          {tasks?.map((task) => (
            <option key={task} value={task}>
              {task}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleDeleteTask(selectedTask)}
          disabled={!selectedTask}
        >
          Delete Task
        </button>
      </div>

      {/* Delete Skill */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Delete Skill</h3>
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          <option value="">Select a Skill</option>
          {skills?.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleDelete("skills", selectedSkill)}
          disabled={!selectedSkill}
        >
          Delete Skill
        </button>
      </div>

      {/* Delete Epic */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Delete Epic</h3>
        <select
          value={selectedEpic}
          onChange={(e) => setSelectedEpic(e.target.value)}
        >
          <option value="">Select an Epic</option>
          {epics?.map((epic) => (
            <option key={epic} value={epic}>
              {epic}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleDelete("epics", selectedEpic)}
          disabled={!selectedEpic}
        >
          Delete Epic
        </button>
      </div>

      {/* Delete Dependency */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Delete Dependency</h3>
        <Select
          options={mapToOptions(tasks, "id")}
          value={taskDependency1}
          onChange={setTaskDependency1}
          placeholder="Select Task 1"
          isSearchable
        />
        <Select
          options={mapToOptions(tasks, "id")}
          value={taskDependency2}
          onChange={setTaskDependency2}
          placeholder="Select Task 2"
          isSearchable
        />
        <button
          onClick={() =>
            handleDelete("dependencies", "", {
              taskId1: taskDependency1?.value,
              taskId2: taskDependency2?.value,
            })
          }
          disabled={!taskDependency1 || !taskDependency2}
        >
          Delete Dependency
        </button>
      </div>
    </div>
  );
};

export default ManageEntities;
