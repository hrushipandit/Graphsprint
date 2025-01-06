// src/components/manager/ManageEmployees.js
import React from "react";

const ManageEmployees = ({
  filteredUsers,
  handleDeleteEmployee,
}) => {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Manage Employees</h2>
      {filteredUsers.length > 0 ? (
        <ul>
          {filteredUsers.map((email, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              {email}
              <button
                onClick={() => handleDeleteEmployee(email)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No employees found.</p>
      )}
    </div>
  );
};

export default ManageEmployees;
