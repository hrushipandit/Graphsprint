// src/components/manager/ManageTasks.js
import React from "react";

const ManageTasks = ({
  tasks,
  handleDeleteTask,
}) => {
  return (
    <div style={{ marginBottom: "30px" }}>
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
    </div>
  );
};

export default ManageTasks;
