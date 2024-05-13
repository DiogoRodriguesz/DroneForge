const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const { secretKey } = require('../Config/config');
const bcrypt = require('bcrypt');

// Controller function to handle user registration
exports.registerUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { username, email, password } = req.body;

    // Hash the password. The number 10 represents the number of salt rounds used in the hashing process, which determines the computational cost and security level of the hash. A cryptographic salt is made up of random bits added to each password instance before its hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token using the secret key
    const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '1h' });

    // Respond with success message and token
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    // Extract username and password from request body
    const { email, password } = req.body;

    // Find user by username in the database
    const user = await User.findOne({ email });

    // If user is not found or password is incorrect, return error
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare provided password with hashed password from the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, return error
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token using the secret key
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    // Respond with success message and token
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to log in user' });
  }
}