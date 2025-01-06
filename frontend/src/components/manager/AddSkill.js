// src/components/manager/AddSkill.js
import React from "react";
import Select from "react-select";

const AddSkill = ({
  users,
  skills,
  selectedUser,
  setSelectedUser,
  selectedSkill,
  setSelectedSkill,
  handleAddSkill,
  mapToOptions,
}) => {
  return (
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
  );
};

export default AddSkill;
