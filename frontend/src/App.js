import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import TaskGraph from './components/TaskGraph';
import Dashboard from './components/Dashboard';
import TaskEditor from './components/TaskEditor';
import ManagerDashboard from './components/ManagerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import GraphVisualization from './components/GraphVisualization';
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:8080/graphql", // Backend GraphQL endpoint
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tasks" element={<TaskGraph />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor" element={<TaskEditor />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/neo4j-graph" element={<GraphVisualization />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
