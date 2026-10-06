import jwt from 'jsonwebtoken';

const authorise = (allowedRoles) => (req, res, next) => {
    try {
        // let token = req.headers?.authorization?.split(' ')[1] || null;
        let token = req.cookies?.token || null;

        if(!token) {
            return res.status(401).json({ error: "access denied. Please login" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;

        if(!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "access denied. Insufficient permissions" });
        }

        next(); 
    } catch (error) {
        console.error('Token verification error:', {
            message: error.message,
            name: error.name,
            timestamp: new Date().toISOString()
        });
     
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ error: "Token expired." });
    }else if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ error: "Invalid token." });
        } 
          return res.status(401).json({ error: "Authentication failed." });
    }

};
export default authorise;