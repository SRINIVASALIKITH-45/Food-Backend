const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        const [drivers] = await db.query('SELECT * FROM drivers WHERE phone = ?', [phone]);
        
        if (drivers.length === 0) {
            return res.status(401).json({ message: 'Invalid phone or password' });
        }
        
        const driver = drivers[0];
        
        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid phone or password' });
        }
        
        const token = jwt.sign(
            { id: driver.id, role: 'Driver' }, 
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '30d' }
        );
        
        // Remove password from response
        delete driver.password;
        
        res.json({
            message: 'Logged in successfully',
            token,
            driver
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const [drivers] = await db.query('SELECT id, name, phone, vehicle_details, is_active FROM drivers WHERE id = ?', [req.user.id]);
        if (drivers.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json(drivers[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { login, getProfile };
