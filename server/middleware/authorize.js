const User = require("../models/User");
const jwt = require('jsonwebtoken');

module.exports = function authorize(req, res, next) {
  const userId = req.cookies.user;

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (userId) {
    req.user = { id: userId };
    return next();
  } 
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
      return next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }
  
  return res.status(401).json({ error: "Authentication required" });
};