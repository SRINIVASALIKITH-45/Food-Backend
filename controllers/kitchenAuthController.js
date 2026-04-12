const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const [staff] = await db.query('SELECT * FROM kitchen_staff WHERE phone = ?', [phone]);

        if (staff.length === 0) {
            return res.status(401).json({ message: 'Invalid phone or password' });
        }

        const kitchenUser = staff[0];
        const isMatch = await bcrypt.compare(password, kitchenUser.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid phone or password' });
        }

        // Update last login time
        await db.query('UPDATE kitchen_staff SET last_login_time = NOW() WHERE id = ?', [kitchenUser.id]);

        const token = jwt.sign(
            { id: kitchenUser.id, role: 'kitchen' },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            staff: {
                id: kitchenUser.id,
                name: kitchenUser.name,
                phone: kitchenUser.phone,
                is_active: kitchenUser.is_active
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const [staff] = await db.query(
            'SELECT id, name, phone, is_active, last_login_time FROM kitchen_staff WHERE id = ?',
            [req.user.id]
        );
        if (staff.length === 0) return res.status(404).json({ message: 'Kitchen staff not found' });
        res.json(staff[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const staffId = req.user.id;
        const { name, phone, password } = req.body;

        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            await db.query('UPDATE kitchen_staff SET name = ?, phone = ?, password = ? WHERE id = ?', [name, phone, hashed, staffId]);
        } else {
            await db.query('UPDATE kitchen_staff SET name = ?, phone = ? WHERE id = ?', [name, phone, staffId]);
        }

        const [rows] = await db.query('SELECT id, name, phone, is_active, last_login_time FROM kitchen_staff WHERE id = ?', [staffId]);
        res.json({ message: 'Profile updated', staff: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { login, getProfile, updateProfile };
