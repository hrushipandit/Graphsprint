// src/components/employee/UpdateTaskStatus.js
import React, { useState } from "react";
import Select from "react-select";

const UpdateTaskStatus = ({ tasks, onUpdateStatus }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Prepare options for the task selection
  const taskOptions = tasks.map((task) => ({
    value: task.id,
    label: `${task.name} (ID: ${task.id})`,
  }));

  return (
    <div className="employee-section">
      <h2>Update Task Status</h2>
      <Select
        options={taskOptions}
        value={selectedTask}
        onChange={setSelectedTask}
        placeholder="Select Task"
        isSearchable
      />
      <input
        type="text"
        placeholder="Enter New Status"
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
        className="update-status-input"
      />
      <button
        onClick={() => {
          onUpdateStatus(selectedTask?.value, newStatus);
          setNewStatus("");
          setSelectedTask(null);
        }}
        className="update-status-button"
      >
        Update Status
      </button>
    </div>
  );
};

export default UpdateTaskStatus;
