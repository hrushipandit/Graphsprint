import React from "react";

const ManageEmployees = ({ filteredUsers, handleDeleteEmployee }) => {
  // Retrieve the current user's name from localStorage
  const currentUserName = localStorage.getItem("name");

  // Filter out the current user
  const employeesToDisplay = filteredUsers.filter(
    (email) => email !== currentUserName
  );

  // Log current user and filtered employees
  console.log("Current User Name:", currentUserName);
  console.log("Filtered Employees:", employeesToDisplay);

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Manage Employees</h2>
      <p>
        <strong>Current User:</strong> {currentUserName}
      </p>
      <p>
        <strong>Filtered Employees:</strong>{" "}
        {employeesToDisplay.length > 0
          ? employeesToDisplay.join(", ")
          : "No employees available."}
      </p>
      {employeesToDisplay.length > 0 ? (
        <ul>
          {employeesToDisplay.map((email, index) => (
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
