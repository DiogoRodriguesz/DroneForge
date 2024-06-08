import React from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { Box } from 'react-bootstrap-icons';
import './DroneInfo.css';

const DroneInfo = () => {
  const status = "Completed"; // Change this value to "In Progress" to test different statuses

  return (
    <div className="drone-info-container">
      <Card className="drone-info-card">
        <Card.Body>
          <div className="drone-info-content">
            <div className="drone-info-image-placeholder">
              <Box size={80} color="#ddd" />
            </div>
            <div className={`drone-info-status ${status.toLowerCase().replace(" ", "-")}`}>
              {status}
            </div>
            <div className="drone-info-details">
              <ListGroup variant="flush">
                <ListGroup.Item className="drone-info-item">
                  <strong>Drone Name:</strong> <span>Phantom X</span>
                </ListGroup.Item>
                <ListGroup.Item className="drone-info-item">
                  <strong>Total Price:</strong> <span>$1500</span>
                </ListGroup.Item>
                <ListGroup.Item className="drone-info-item">
                  <strong>Parts:</strong>
                  <ul>
                    <li>Frame: <span>Frame Model X</span></li>
                    <li>Motor: <span>Motor Model Y (Quantity: 4)</span></li>
                    <li>Controller: <span>Controller Model Z</span></li>
                    <li>Propeller: <span>Propeller Model A (Quantity: 4)</span></li>
                    <li>Battery: <span>Battery Model B (Quantity: 2)</span></li>
                    <li>Camera: <span>Camera Model C</span></li>
                    <li>GPS: <span>GPS Model D</span></li>
                    <li>Sensor: <span>Sensor Model E (Quantity: 5)</span></li>
                  </ul>
                </ListGroup.Item>
                <ListGroup.Item className="drone-info-item">
                  <strong>Assembly Date:</strong> <span>15/01/2023</span>
                </ListGroup.Item>
              </ListGroup>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DroneInfo;
