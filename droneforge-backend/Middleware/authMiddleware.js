const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const { secretKey } = require('../Config/config');

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    console.log('Authorization header found');
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token:', token);

      const decoded = jwt.verify(token, secretKey);
      console.log('Decoded token:', decoded);

      req.user = await User.findById(decoded.userId).select('-password');
      console.log('Authenticated user:', req.user);

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No authorization header or token not starting with Bearer');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = authMiddleware;
