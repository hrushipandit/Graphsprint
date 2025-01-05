import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './Signup.css'; // Optional styling

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // Added username state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // React Router's useNavigate hook

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const signupData = {
      email,
      password,
      name: username, // Send the username to the backend
      role: 'employee', // Default role
    };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        alert('Account created successfully!');
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        navigate('/login'); // Redirect to sign-in page
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to create account'}`);
      }
    } catch (error) {
      alert('An error occurred while creating the account');
      console.error('Signup Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => navigate(-1)} // Navigate back to the previous page
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '10px 15px',
          fontSize: '14px',
        }}
      >
        Back
      </button>

      <h2>Create an Account</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
