import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import IllustrationSvg from '../../assets/Illustration.svg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <Container className="login-container">
      <div className="background-image">
        <img src={IllustrationSvg} alt="Background Illustration" className="login-illustration" />
      </div>
      <div className="login-form-container">
        <Form onSubmit={handleSubmit}>
          <h2 className="login-title">Welcome back! 👋</h2>
          <p className="login-subtitle">Make your drone assembly projects faster and easier with <strong>Drone Forge</strong>.</p>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group controlId="formEmail">
            <Form.Control type="email" placeholder="Email" required onChange={handleEmailChange} />
          </Form.Group>
          <Form.Group controlId="formPassword" className="password-group">
            <Form.Control type="password" placeholder="Password" required onChange={handlePasswordChange} />
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </Form.Group>
          <Button type="submit" className="login-button">Login</Button>
          <div className="auth-links">
            <Link to="/signup" className="signup-link">Don't have an account? Sign up here!</Link>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
