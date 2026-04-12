const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const [adminRows] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
        
        if (adminRows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        
        const admin = adminRows[0];
        
        const isMatch = await bcrypt.compare(password, admin.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        
        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
        
        res.json({
            id: admin.id,
            username: admin.username,
            role: admin.role,
            token
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { login };
