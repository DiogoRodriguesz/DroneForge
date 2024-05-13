import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // The frontend sends a registration request to the backend.
  // Upon successful registration, the backend responds with a token.
  // The frontend extracts the token from the response data and stores it in the browser's localStorage for future use.
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        console.log('Registration successful');
        setError('');
        // Redirect to the homepage
        navigate('/');
      } else {
        // Handle errors from the server
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      setError('An error occurred while registering');
    }
  };

  return (
    <Container>
      <div className="form-container">
        <div className="form-column">
          <h2>Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} id="signup-form">
            <Form.Group controlId="formUsername">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="submit-button">Sign Up</Button>
          </Form>
        </div>
        <div className="logo-column">
          {/* Add your site logo or text here */}
          <h1>Site Logo or Text</h1>
        </div>
      </div>
    </Container>
  );
}

export default Signup;
