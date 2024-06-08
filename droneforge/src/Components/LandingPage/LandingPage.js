import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import droneImage from '../../assets/drone.png'; // Ensure the path to your drone image is correct

const LandingPage = () => {
  const navigate = useNavigate();

  const handleWorkspaceClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/workspace/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="custom-landing-page">
      <Navbar expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand href="/" className="custom-navbar-brand">droneforge.</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto custom-nav-links">
              <Nav.Link href="#" onClick={handleWorkspaceClick} className="custom-nav-link">Workspace</Nav.Link>
              <Nav.Link href="about" className="custom-nav-link">About</Nav.Link>
              <Nav.Link href="login" className="custom-nav-link">Sign In</Nav.Link>
              <Button href="signup" className="custom-btn-signup">Sign Up for Free</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="custom-hero-section">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <div className="custom-hero-content">
          <h1 className="custom-hero-title">
            Unleash Your <span className="gradient-text">Creativity</span> out into the Sky 🛰
          </h1>
          <p className="custom-hero-subtitle">Join <strong>DroneForge</strong>, a community of drone enthusiasts and creators. Discover, build, and share your most ambitious 🚁 projects.</p>
        </div>
        <img src={droneImage} alt="Drone" className="drone-image" />
      </div>
    </div>
  );
};

export default LandingPage;
