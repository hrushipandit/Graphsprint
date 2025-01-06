// src/components/manager/AddSoloEntities.js
import React from "react";

const AddSoloEntities = ({
  handleAddSoloSkill,
  handleAddSoloTask,
  handleAddSoloEpic,
  handleAddSoloDependency,
}) => {
  return (
    <div>
      <h3>Add Solo Entities</h3>
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
    </div>
  );
};

export default AddSoloEntities;
