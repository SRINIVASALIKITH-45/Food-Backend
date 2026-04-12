const db = require('../config/db');

const bcrypt = require('bcryptjs');

const getCustomers = async (req, res) => {
    try {
        const [customers] = await db.query('SELECT * FROM customers');
        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, gender, location, password } = req.body;
        
        let query = 'UPDATE customers SET name=?, email=?, phone=?, gender=?, location=?';
        let params = [name, email, phone, gender, location];
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password=?';
            params.push(hashedPassword);
        }
        
        query += ' WHERE id=?';
        params.push(id);
        
        await db.query(query, params);
        res.json({ message: 'Customer updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const toggleBlockCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const [customer] = await db.query('SELECT is_blocked FROM customers WHERE id = ?', [id]);
        if(customer.length === 0) return res.status(404).json({ message: 'Not found' });
        
        const newValue = !customer[0].is_blocked;
        await db.query('UPDATE customers SET is_blocked = ? WHERE id = ?', [newValue, id]);
        res.json({ message: 'Customer status updated', is_blocked: newValue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getCustomers, updateCustomer, toggleBlockCustomer };
