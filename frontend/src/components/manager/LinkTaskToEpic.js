// src/components/manager/LinkTaskToEpic.js
import React from "react";
import Select from "react-select";

const LinkTaskToEpic = ({
  tasks,
  epics,
  selectedTask,
  setSelectedTask,
  selectedEpic,
  setSelectedEpic,
  handleLinkTaskToEpic,
  mapToOptions,
}) => {
  return (
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
  );
};

export default LinkTaskToEpic;
