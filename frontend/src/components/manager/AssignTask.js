// src/components/manager/AssignTask.js
import React from "react";
import Select from "react-select";

const AssignTask = ({
  users,
  tasks,
  selectedUser,
  setSelectedUser,
  selectedTask,
  setSelectedTask,
  handleAssignTask,
  mapToOptions,
}) => {
  return (
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
  );
};

export default AssignTask;
