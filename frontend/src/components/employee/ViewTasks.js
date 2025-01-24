// src/components/employee/ViewTasks.js
import React from "react";

const ViewTasks = ({ tasks }) => {
  return (
    <div className="employee-section">
      <h2>Your Tasks</h2>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.name}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks assigned to you.</p>
      )}
    </div>
  );
};

export default ViewTasks;
