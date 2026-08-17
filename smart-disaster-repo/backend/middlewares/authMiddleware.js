import admin from '../config/firebase.js';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    
    // Also fetch the internal DB user to get their role
    const dbUser = await User.findOne({ uid: decodedToken.uid });
    if (dbUser) {
        req.dbUser = dbUser;
    }
    
    next();
  } catch (error) {
    console.error('Error verifying auth token:', error);
    res.status(403).json({ error: 'Unauthorized' });
  }
};

export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.dbUser || !roles.includes(req.dbUser.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    }
}
