const express = require('express');
const router = express.Router();
const droneController = require('../Controllers/droneController');
const authMiddleware = require('../Middleware/authMiddleware');

// Route for getting all drone parts
router.get('/parts', authMiddleware, droneController.getDroneParts);

// Route for creating a new drone
router.post('/create', authMiddleware, droneController.createDrone);

// Route to add a new part
router.post('/parts', droneController.addPart);

// Route to count drones
router.get('/count', droneController.countDrones);

// Route to count drones by time intervals
router.get('/count/intervals', authMiddleware, droneController.countDronesByTimeIntervals);

// Route to get the most used part
router.get('/most-used-part', authMiddleware, droneController.getMostUsedPart);

// Route to get total sales
router.get('/total-sales', authMiddleware, droneController.getTotalSales);

// Route to count drones by day
router.get('/count/by-day', authMiddleware, droneController.countDronesByDay);

// Route to get the sales by time intervals
router.get('/sales/weekly', authMiddleware, droneController.getWeeklySales);

// Route to get the drones built by a user
router.get('/user-drones', authMiddleware, droneController.getUserDrones);



module.exports = router;
