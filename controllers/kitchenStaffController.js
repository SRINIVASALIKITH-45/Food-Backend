const db = require('../config/db');
const bcrypt = require('bcryptjs');

const getKitchenStaff = async (req, res) => {
    try {
        const [staff] = await db.query('SELECT id, name, phone, is_active, last_login_time, created_at FROM kitchen_staff ORDER BY id DESC');
        res.json(staff);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createKitchenStaff = async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        const passToHash = password || 'kitchen123';
        const hashedPassword = await bcrypt.hash(passToHash, 10);

        const [result] = await db.query(
            'INSERT INTO kitchen_staff (name, phone, password) VALUES (?, ?, ?)',
            [name, phone, hashedPassword]
        );
        res.status(201).json({ message: 'Kitchen staff created', id: result.insertId });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Phone number already registered' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateKitchenStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, password } = req.body;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                'UPDATE kitchen_staff SET name=?, phone=?, password=? WHERE id=?',
                [name, phone, hashedPassword, id]
            );
        } else {
            await db.query(
                'UPDATE kitchen_staff SET name=?, phone=? WHERE id=?',
                [name, phone, id]
            );
        }
        res.json({ message: 'Kitchen staff updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const toggleActiveKitchenStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const [staff] = await db.query('SELECT is_active FROM kitchen_staff WHERE id = ?', [id]);
        if (staff.length === 0) return res.status(404).json({ message: 'Not found' });

        const newValue = !staff[0].is_active;
        await db.query('UPDATE kitchen_staff SET is_active = ? WHERE id = ?', [newValue, id]);
        res.json({ message: 'Kitchen staff status updated', is_active: newValue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getKitchenStaff, createKitchenStaff, updateKitchenStaff, toggleActiveKitchenStaff };
