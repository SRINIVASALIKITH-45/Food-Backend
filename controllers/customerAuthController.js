const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendWelcomeEmail } = require('../services/emailService');

const register = async (req, res) => {
    try {
        const { name, email, phone, gender, location, password } = req.body;
        
        // check if user exists
        const [existing] = await db.query('SELECT * FROM customers WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.query(
            'INSERT INTO customers (name, email, phone, gender, location, password) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, phone, gender, location, hashedPassword]
        );
        
        const token = jwt.sign(
            { id: result.insertId, email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Send Welcome Email asynchronously
        sendWelcomeEmail(email, name).catch(err => console.error('Welcome Email async error:', err));
        
        res.status(201).json({
            id: result.insertId,
            name,
            email,
            token
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, phone, password } = req.body;
        
        let customer;
        if (email) {
            const [rows] = await db.query('SELECT * FROM customers WHERE email = ?', [email]);
            customer = rows[0];
        } else if (phone) {
            const [rows] = await db.query('SELECT * FROM customers WHERE phone = ?', [phone]);
            customer = rows[0];
        } else {
            return res.status(400).json({ message: 'Email or phone is required' });
        }
        
        if (!customer) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        if (customer.is_blocked) {
            return res.status(403).json({ message: 'Your account has been blocked.' });
        }

        if (!customer.password) {
             return res.status(401).json({ message: 'Account has no password set. Please contact admin.' });
        }
        
        const isMatch = await bcrypt.compare(password, customer.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: customer.id, email: customer.email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
        
        res.json({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            token
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { register, login };
