import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tools, GearFill, CartFill } from 'react-bootstrap-icons'; // Changed to a better icon for sales

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [selectedCard, setSelectedCard] = useState('approval');
  const [droneCount, setDroneCount] = useState(0);
  const [mostUsedPart, setMostUsedPart] = useState('');
  const [dronesBuiltData, setDronesBuiltData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0); // Ensure totalSales is defined
  const [userDrones, setUserDrones] = useState([]); // State for user's drones

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.name);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    const fetchDroneCount = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/drones/count', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setDroneCount(data.count);
      } catch (error) {
        console.error('Error fetching drone count:', error);
      }
    };

    const fetchMostUsedPart = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/drones/most-used-part', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setMostUsedPart(data.part.name);
      } catch (error) {
        console.error('Error fetching most used part:', error);
      }
    };

    const fetchDronesBuiltData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/drones/count/by-day', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        const formattedData = data.map((count, index) => ({
          name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index],
          value: count
        }));
        setDronesBuiltData(formattedData);
      } catch (error) {
        console.error('Error fetching drones built data:', error);
      }
    };

    const fetchWeeklySales = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/drones/sales/weekly', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        const formattedData = data.map((sales, index) => ({
          name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index],
          value: sales
        }));
        setSalesData(formattedData);

        // Calculate total sales
        const total = data.reduce((sum, sales) => sum + sales, 0);
        setTotalSales(total);
      } catch (error) {
        console.error('Error fetching weekly sales data:', error);
      }
    };

    const fetchUserDrones = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/drones/user-drones', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUserDrones(data);
      } catch (error) {
        console.error('Error fetching user drones:', error);
      }
    };

    fetchUserName();
    fetchDroneCount();
    fetchMostUsedPart();
    fetchDronesBuiltData();
    fetchWeeklySales();
    fetchUserDrones();
  }, []);

  useEffect(() => {
    const fetchUserName = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserName(decodedToken.username);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, []);

  const getCardData = () => {
    switch (selectedCard) {
      case 'approval':
        return { data: dronesBuiltData, color: '#afe9e0', title: 'Weekly <strong>Drones Built</strong>', gradientStart: '#afe9e0', gradientEnd: '#70e4c6' };
      case 'disputes':
        return { data: [], color: '#f9c9b6', title: 'Most <strong>Used Parts</strong>', gradientStart: '#f9c9b6', gradientEnd: '#f6a084' };
      case 'messages':
        return { data: salesData, color: '#f9c9e0', title: 'Weekly <strong>Sales</strong>', gradientStart: '#f9c9e0', gradientEnd: '#f6a8d6' };
      default:
        return { data: [], color: '#afe9e0', title: 'Weekly Activity', gradientStart: '#afe9e0', gradientEnd: '#70e4c6' };
    }
  };

  const { data: chartData, color: chartColor, title: chartTitle, gradientStart, gradientEnd } = getCardData();

  const setCardStyles = useCallback(() => {
    document.documentElement.style.setProperty('--selected-gradient-start', gradientStart);
    document.documentElement.style.setProperty('--selected-gradient-end', gradientEnd);
  }, [gradientStart, gradientEnd]);

  useEffect(() => {
    setCardStyles();
  }, [selectedCard, setCardStyles]);

  const yAxisTickFormatter = (tick) => {
    if (tick === 0) return '';
    return tick;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-background-overlay"></div>
      <Sidebar />
      <div className="dashboard-main-content">
        <div className="dashboard-header-container">
          <h1>Dashboard</h1>
          <div className="dashboard-icon-container">
            <span className="dashboard-icon-bell"></span>
            <span className="dashboard-icon-search"></span>
          </div>
        </div>
        <div className="dashboard-welcome-container">
          <div className="dashboard-welcome-content">
            <h2>Hi <strong>@{userName}</strong>! 👋</h2>
            <p>You have already completed <strong>68%</strong> from your weekly level. Keep up the good work!</p>
            <button className="dashboard-welcome-button" onClick={() => navigate('/workspace/drone-builder')}>
              Build More Drones
            </button>
          </div>
        </div>
        <div className="dashboard-cards-container">
          <div className={`dashboard-card approval ${selectedCard === 'approval' ? 'selected' : ''}`} onClick={() => setSelectedCard('approval')}>
            <div className="icon">
              <Tools />
            </div>
            <h2>{droneCount}</h2>
            <p>Drones Built</p>
          </div>
          <div className={`dashboard-card disputes ${selectedCard === 'disputes' ? 'selected' : ''}`} onClick={() => setSelectedCard('disputes')}>
            <div className="icon">
              <GearFill />
            </div>
            <h2>{mostUsedPart}</h2>
            <p>Most Used Part</p>
          </div>
          <div className={`dashboard-card messages ${selectedCard === 'messages' ? 'selected' : ''}`} onClick={() => setSelectedCard('messages')}>
            <div className="icon">
              <CartFill />
            </div>
            <h2>{totalSales}</h2>
            <p>Sales</p>
          </div>
        </div>
        <div className="dashboard-chart-container">
          <h2 dangerouslySetInnerHTML={{ __html: chartTitle }}></h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.8} />
                  <stop offset="75%" stopColor={chartColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={yAxisTickFormatter} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke={chartColor} fill="url(#color)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="dashboard-table-container">
          <h2>Drones You Built</h2>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {userDrones.map((drone) => (
                <tr key={drone._id}>
                  <td>{drone.name}</td>
                  <td>{drone.totalPrice}</td>
                  <td>{drone.status}</td>
                  <td style={{ textAlign: 'right' }}>{new Date(drone.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
