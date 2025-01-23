import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const ManagerNavbar = () => {
  const navigate = useNavigate(); // For navigation on logout

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                to="/manager-dashboard/assign-task"
                className="nav-link"
                activeClassName="active"
              >
                Assign Task
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manager-dashboard/add-skill"
                className="nav-link"
                activeClassName="active"
              >
                Add Skill
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manager-dashboard/link-task-epic"
                className="nav-link"
                activeClassName="active"
              >
                Link Task to Epic
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manager-dashboard/add-task-dependency"
                className="nav-link"
                activeClassName="active"
              >
                Add Task Dependency
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manager-dashboard/add-solo-entities"
                className="nav-link"
                activeClassName="active"
              >
                Add Solo Entities
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manager-dashboard/manage-employees"
                className="nav-link"
                activeClassName="active"
              >
                Manage Employees
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manager-dashboard/manage-entities"
                className="nav-link"
                activeClassName="active"
              >
                Manage Entities
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manager-dashboard/graph-visualization"
                className="nav-link"
                activeClassName="active"
              >
                Graph Visualization
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manager-dashboard/chatbox"
                className="nav-link"
                activeClassName="active"
              >
                Chatbox
              </NavLink>
            </li>
          </ul>
          <button
            className="btn btn-danger ms-auto"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ManagerNavbar;
