import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import for navigation
import Sidebar from '../Sidebar/Sidebar';
import { Check } from 'react-bootstrap-icons';
import './DroneBuilder.css';
import SuccessScreen from '../SuccessScreen/SuccessScreen'; // Ensure you import the SuccessScreen component

const DroneBuilder = () => {
  const [parts, setParts] = useState({
    frame: [],
    motor: [],
    controller: [],
    propeller: [],
    battery: [],
    camera: [],
    gps: [],
    sensor: [],
  });
  const [selectedParts, setSelectedParts] = useState({
    frame: null,
    motor: { part: null, quantity: 1 },
    controller: null,
    propeller: { part: null, quantity: 1 },
    battery: { part: null, quantity: 1 },
    camera: null,
    gps: null,
    sensor: { part: null, quantity: 1 },
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [wordTransitioning, setWordTransitioning] = useState(false);
  const [partTransitioning, setPartTransitioning] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false); // New state variable for transition
  const [isSuccess, setIsSuccess] = useState(false); // State for success screen

  const navigate = useNavigate(); // Use this for navigation

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Ensure the token is being logged correctly
        const response = await fetch("http://localhost:8080/api/drones/parts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const partsByType = {
          frame: [],
          motor: [],
          controller: [],
          propeller: [],
          battery: [],
          camera: [],
          gps: [],
          sensor: [],
        };
        data.forEach((part) => {
          partsByType[part.type].push(part);
        });
        setParts(partsByType);
      } catch (error) {
        console.error("Error fetching parts:", error);
      }
    };
  
    fetchParts();
  }, []);    

  const handlePartSelect = (type, part) => {
    if (['motor', 'propeller', 'battery', 'sensor'].includes(type)) {
      setSelectedParts((prevSelectedParts) => ({
        ...prevSelectedParts,
        [type]: { ...prevSelectedParts[type], part },
      }));
    } else {
      setSelectedParts((prevSelectedParts) => ({
        ...prevSelectedParts,
        [type]: part,
      }));
    }
  };

  const handleQuantityChange = (type, event) => {
    let value = event.target.value;
    const quantity = value === '' ? '' : Math.max(1, parseInt(value));
    setSelectedParts((prevSelectedParts) => ({
      ...prevSelectedParts,
      [type]: { ...prevSelectedParts[type], quantity },
    }));
  };

  const handleInputFocus = (event) => {
    event.target.select();
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      Object.values(selectedParts).forEach((part) => {
        if (part && typeof part === 'object' && part.part) {
          total += (part.part.price || 0) * (part.quantity || 1);
        } else if (part) {
          total += part.price || 0;
        }
      });
      return total;
    };

    const newTotalPrice = calculateTotalPrice();
    setTotalPrice(newTotalPrice);
  }, [selectedParts]);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setIsTransitioning(true);
      setWordTransitioning(true);
      setPartTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prevStep) => prevStep + 1);
        setWordTransitioning(false);
        setPartTransitioning(false);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setWordTransitioning(true);
      setPartTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prevStep) => prevStep - 1);
        setWordTransitioning(false);
        setPartTransitioning(false);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const steps = [
    'frame',
    'motor',
    'controller',
    'propeller',
    'battery',
    'camera',
    'gps',
    'sensor',
  ];

  const currentPartType = steps[currentStep - 1];
  const isLastStep = currentStep === steps.length;

  const handleConfirm = async () => {
    try {
      const parts = {
        frame: selectedParts.frame._id,
        motor: {
          part: selectedParts.motor.part._id,
          quantity: selectedParts.motor.quantity,
        },
        controller: selectedParts.controller._id,
        propeller: {
          part: selectedParts.propeller.part._id,
          quantity: selectedParts.propeller.quantity,
        },
        battery: {
          part: selectedParts.battery.part._id,
          quantity: selectedParts.battery.quantity,
        },
        camera: selectedParts.camera._id,
        gps: selectedParts.gps._id,
        sensor: {
          part: selectedParts.sensor.part._id,
          quantity: selectedParts.sensor.quantity,
        },
      };
  
      const response = await fetch("http://localhost:8080/api/drones/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: "My Custom Drone", // You can dynamically set this name if needed
          parts,
          totalPrice,
        }),
      });
  
      if (response.ok) {
        setIsSuccess(true); // Set success state to true if the drone is created successfully

        // Redirect after a short delay
        setTimeout(() => {
          setIsSuccess(false); // Hide the success screen
          navigate('/workspace/dashboard'); // Redirect to the desired route
        }, 2400); // Show success screen for 6 seconds
      } else {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }
  
    } catch (error) {
      console.error("Error creating drone:", error);
    }
  };  

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  const isConfirmEnabled = selectedParts.frame && selectedParts.motor.part && selectedParts.controller && selectedParts.propeller.part && selectedParts.battery.part && selectedParts.camera && selectedParts.gps && selectedParts.sensor.part;

  return (
    <div className="dronebuilder-container">
      <div className="background-overlay"></div>
      {isSuccess && <SuccessScreen />}
      {!isSuccess && (
        <>
          <Sidebar />
          <div className="main-content">
            <div className="header-container">
              <span role="img" aria-label="drone">🛠️</span>
            </div>
            <div className="wizard-container">
              <h2 className="centered-heading">
                What <span className={`word-text ${wordTransitioning ? 'word-hidden' : 'word-visible'}`}><strong>{currentPartType.charAt(0).toUpperCase() + currentPartType.slice(1)}</strong></span> would you like to select?
              </h2>
              <div className={`part-options centered ${partTransitioning ? 'part-hidden' : 'part-visible'}`}>
                {parts[currentPartType].map((part) => (
                  <div
                    key={part.name}
                    className={`part-item ${selectedParts[currentPartType]?.part?.name === part.name || selectedParts[currentPartType]?.name === part.name ? 'selected' : ''}`}
                    onClick={() => handlePartSelect(currentPartType, part)}
                  >
                    <img src={part.imageUrl} alt={part.name} className="part-image" />
                    <div className="title">{part.name}</div>
                    <p className="price">${part.price}</p>
                    {(selectedParts[currentPartType]?.part?.name === part.name || selectedParts[currentPartType]?.name === part.name) && (
                      <div className="check-icon">
                        <Check />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {['motor', 'propeller', 'battery', 'sensor'].includes(currentPartType) && (
                <div className="quantity-selector">
                  <label htmlFor={`${currentPartType}-quantity`}>Quantity:</label>
                  <input
                    id={`${currentPartType}-quantity`}
                    type="number"
                    min="1"
                    step="1"  // Slows down the scrolling speed
                    value={selectedParts[currentPartType]?.quantity}
                    onChange={(e) => handleQuantityChange(currentPartType, e)}
                    onFocus={handleInputFocus}
                  />
                </div>
              )}
            </div>
            <div className="bar-container centered">
              <p>Total Price: <span className="price">${totalPrice}</span></p>
            </div>
            <div className="navigation-buttons centered">
              {currentStep > 1 && <button className="button-common" onClick={prevStep} disabled={isTransitioning}>Previous</button>}
              {!isLastStep && <button className="button-common" onClick={nextStep} disabled={isTransitioning}>Next</button>}
              {isLastStep && <button
                className={`button-common button-confirm ${isConfirmEnabled ? 'enabled' : 'disabled'}`}
                onClick={handleConfirm}
                disabled={!isConfirmEnabled}
              >
                Confirm
              </button>}
            </div>
          </div>
        </>
      )}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      </div>
    </div>
  );
};

export default DroneBuilder;
