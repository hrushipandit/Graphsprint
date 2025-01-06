// src/components/employee/EmployeeNavbar.js
import React from "react";
import { NavLink } from "react-router-dom";
import './EmployeeStyles.css'; // Import the CSS for styling

const EmployeeNavbar = () => (
  <nav className="employee-nav">
    <ul className="employee-nav-list">
      <li className="employee-nav-item">
        <NavLink
          to="/employee-dashboard/view-tasks"
          className={({ isActive }) =>
            isActive ? "employee-nav-link active" : "employee-nav-link"
          }
        >
          View Tasks
        </NavLink>
      </li>
      <li className="employee-nav-item">
        <NavLink
          to="/employee-dashboard/update-task-status"
          className={({ isActive }) =>
            isActive ? "employee-nav-link active" : "employee-nav-link"
          }
        >
          Update Task Status
        </NavLink>
      </li>
      {/* Add more navigation items here as needed */}
    </ul>
  </nav>
);

export default EmployeeNavbar;
