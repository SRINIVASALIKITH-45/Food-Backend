const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const [writers] = await db.query('SELECT * FROM writers WHERE phone = ?', [phone]);

        if (writers.length === 0) {
            return res.status(401).json({ message: 'Invalid phone or password' });
        }

        const writer = writers[0];
        const isMatch = await bcrypt.compare(password, writer.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid phone or password' });
        }

        const token = jwt.sign({ id: writer.id, role: 'writer' }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            writer: {
                id: writer.id,
                name: writer.name,
                phone: writer.phone,
                is_on_duty: writer.is_on_duty
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const toggleDuty = async (req, res) => {
    try {
        const writerId = req.user.id;
        const { is_on_duty } = req.body;
        
        const lastLoginTime = is_on_duty ? new Date() : null;
        
        await db.query('UPDATE writers SET is_on_duty = ?, last_login_time = ? WHERE id = ?', [is_on_duty, lastLoginTime, writerId]);
        
        res.json({ message: `Duty status updated to ${is_on_duty ? 'ON' : 'OFF'}`, is_on_duty, last_login_time: lastLoginTime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const [writers] = await db.query('SELECT id, name, phone, is_on_duty, last_login_time FROM writers WHERE id = ?', [req.user.id]);
        if (writers.length === 0) return res.status(404).json({ message: 'Writer not found' });
        res.json(writers[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const writerId = req.user.id;
        const { name, phone, password } = req.body;

        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            await db.query('UPDATE writers SET name = ?, phone = ?, password = ? WHERE id = ?', [name, phone, hashed, writerId]);
        } else {
            await db.query('UPDATE writers SET name = ?, phone = ? WHERE id = ?', [name, phone, writerId]);
        }

        const [rows] = await db.query('SELECT id, name, phone, is_on_duty, last_login_time FROM writers WHERE id = ?', [writerId]);
        res.json({ message: 'Profile updated', writer: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { login, toggleDuty, getProfile, updateProfile };
