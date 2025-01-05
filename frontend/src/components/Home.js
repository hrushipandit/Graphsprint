import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Optional: Add styling here

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="home-container">
      <h1>Welcome to GraphSprint</h1>
      <p>
        Visualize and optimize your team's Agile workflow. GraphSprint helps you
        manage task dependencies, analyze collaboration dynamics, and enhance team efficiency.
      </p>
      <div className="button-container">
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
        <button className="signup-button" onClick={handleSignup}>
          Signup
        </button>
      </div>
    </div>
  );
};

export default Home;
