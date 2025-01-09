import React from "react";
import { NavLink } from "react-router-dom";

const ManagerNavbar = () => (
  <nav style={styles.nav}>
    <ul style={styles.ul}>
      <li style={styles.li}>
        <NavLink
          to="/manager-dashboard/assign-task"
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? "#555" : "transparent",
          })}
        >
          Assign Task
        </NavLink>
      </li>
      <li style={styles.li}>
        <NavLink
          to="/manager-dashboard/add-skill"
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? "#555" : "transparent",
          })}
        >
          Add Skill
        </NavLink>
      </li>
      <li style={styles.li}>
        <NavLink
          to="/manager-dashboard/link-task-epic"
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? "#555" : "transparent",
          })}
        >
          Link Task to Epic
        </NavLink>
      </li>
      <li style={styles.li}>
        <NavLink
          to="/manager-dashboard/add-task-dependency"
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? "#555" : "transparent",
          })}
        >
          Add Task Dependency
        </NavLink>
      </li>
      <li style={styles.li}>
        <NavLink
          to="/manager-dashboard/add-solo-entities"
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? "#555" : "transparent",
          })}
        >
          Add Solo Entities
        </NavLink>
      </li>
      <li style={styles.li}>
        <NavLink
          to="/manager-dashboard/manage-employees"
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? "#555" : "transparent",
          })}
        >
          Manage Employees
        </NavLink>
      </li>
      <li style={styles.li}>
        <NavLink
          to="/manager-dashboard/manage-tasks"
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? "#555" : "transparent",
          })}
        >
          Manage Tasks
        </NavLink>
      </li>
      <li style={styles.li}>
        <NavLink
          to="/manager-dashboard/graph-visualization" // New link for GraphVisualization
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? "#555" : "transparent",
          })}
        >
          Graph Visualization
        </NavLink>
        
      </li>
  
      <li style={styles.li}>
        <NavLink
          to="/manager-dashboard/chatbox" // New link for GraphVisualization
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? "#555" : "transparent",
          })}
        >
          Chatbox
        </NavLink>
        
      </li>
    </ul>
  </nav>
);

const styles = {
  nav: {
    backgroundColor: "#333",
    padding: "10px",
    marginTop: "20px",
  },
  ul: {
    listStyleType: "none",
    display: "flex",
    justifyContent: "space-around",
    margin: 0,
    padding: 0,
  },
  li: {
    margin: "0 10px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: "bold",
  },
};

export default ManagerNavbar;
