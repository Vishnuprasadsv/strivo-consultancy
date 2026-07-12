import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Helper to parse cookies from request headers
const getCookie = (req, name) => {
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split('=');
      const key = parts[0].trim();
      const val = parts[1] ? parts[1].trim() : '';
      if (key === name) {
        return decodeURIComponent(val);
      }
    }
  }
  return null;
};

// Middleware to verify token and protect routes
export const protect = async (req, res, next) => {
  let token = getCookie(req, 'token');

  // Fallback to Authorization header if cookie not present
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, please login first.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Admin.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found. Session invalid.' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Session expired. Please login again.' });
  }
};

// Middleware to check specific role authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    const userRole = req.user.role ? req.user.role.toLowerCase() : '';
    
    const hasRole = roles.some(role => {
      const r = role.toLowerCase();
      // Allow 'admin' to match 'administrator' and vice versa
      if (r === 'admin' && (userRole === 'admin' || userRole === 'administrator')) return true;
      if (r === 'administrator' && (userRole === 'admin' || userRole === 'administrator')) return true;
      return r === userRole;
    });

    if (!hasRole) {
      return res.status(403).json({ 
        message: `Forbidden: Access restricted. Required roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};
