// src/components/manager/AddTaskDependency.js
import React from "react";
import Select from "react-select";

const AddTaskDependency = ({
  tasks,
  taskDependency1,
  setTaskDependency1,
  taskDependency2,
  setTaskDependency2,
  handleAddTaskDependency,
  mapToOptions,
}) => {
  return (
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
  );
};

export default AddTaskDependency;
