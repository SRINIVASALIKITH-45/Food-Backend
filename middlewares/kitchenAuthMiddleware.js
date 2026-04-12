const jwt = require('jsonwebtoken');

const authKitchen = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        
        if (decoded.role !== 'kitchen') {
            return res.status(403).json({ message: 'Authorization denied: Requires Kitchen Role' });
        }
        
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authKitchen;
