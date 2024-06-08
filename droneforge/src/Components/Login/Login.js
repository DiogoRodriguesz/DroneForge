import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Import Login CSS
import lottie from 'lottie-web';
import backgroundImage from '../../assets/people-login.svg'; // Import the SVG image
import { Eye, EyeSlash } from 'react-bootstrap-icons'; // Import Eye icons

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fade, setFade] = useState('fade-in');
  const navigate = useNavigate();
  const animationContainer = useRef(null);
  const animationInstance = useRef(null);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch('https://lottie.host/e6f0719e-2a73-425e-bb2a-060e348b2ebb/l3tqaZFSSh.json');
        const data = await response.json();

        if (animationInstance.current) {
          animationInstance.current.destroy(); // Clean up the previous instance if it exists
        }

        animationInstance.current = lottie.loadAnimation({
          container: animationContainer.current, // the container element
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: data, // the animation data
        });
      } catch (error) {
        console.error('Failed to load animation data:', error);
      }
    };

    loadAnimation();

    // Cleanup function to destroy Lottie instance when component unmounts or re-renders
    return () => {
      if (animationInstance.current) {
        animationInstance.current.destroy();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/workspace/dashboard');
    }
  }, [navigate]); // Runs only once when the component mounts

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        navigate('/workspace/dashboard'); // Update the navigate function call to go to the main page
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  useEffect(() => {
    // Trigger fade-out effect before unmounting
    const handleBeforeUnload = () => setFade('fade-out');
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="login-container">
      <div className={`background-image ${fade}`} style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      <Link to="/" className="site-name">droneforge.</Link>
      <div className="login-form-container">
        <div className="login-content">
          <h2 className="login-title">Welcome back! 👋</h2>
          <p className="login-subtitle">Make your 🚁 assembly projects faster and easier with <strong>Drone Forge</strong>.</p>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="formEmail">
              <Form.Control type="email" placeholder="Email" required onChange={handleEmailChange} />
            </Form.Group>
            <Form.Group controlId="formPassword" className="password-group">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                onChange={handlePasswordChange}
              />
              <div className="password-toggle-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeSlash /> : <Eye />}
              </div>
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </Form.Group>
            <Button type="submit" className="login-button">Login</Button>
            <div className="auth-links">
              <Link to="/signup" className="signup-link">Don't have an account? Sign up here!</Link>
            </div>
          </Form>
        </div>
        <div className="logo-container" ref={animationContainer}></div>
      </div>
    </div>
  );
}

export default Login;
