const jwt = require('jsonwebtoken');

const authWriter = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        
        if (decoded.role !== 'writer') {
            return res.status(403).json({ message: 'Authorization denied: Requires Writer Role' });
        }
        
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authWriter;
