const db = require('../config/db');

const getProfileStats = async (req, res) => {
    try {
        const customerId = req.user.id;
        const [orderCount] = await db.query('SELECT COUNT(*) as count FROM orders WHERE customer_id = ?', [customerId]);
        
        // Mocking some stats for a premium feel until we have real fields for them
        res.json({
            orders: orderCount[0].count,
            rating: 4.8,
            saved: 1240
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAddresses = async (req, res) => {
    try {
        const customerId = req.user.id;
        const [addresses] = await db.query('SELECT * FROM saved_addresses WHERE customer_id = ?', [customerId]);
        res.json(addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getPaymentMethods = async (req, res) => {
    try {
        const customerId = req.user.id;
        const [methods] = await db.query('SELECT * FROM payment_methods WHERE customer_id = ?', [customerId]);
        res.json(methods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const addAddress = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { label, address, is_default } = req.body;
        
        if (!address) {
            return res.status(400).json({ message: 'Address is required' });
        }

        // Insert new address
        const [result] = await db.query(
            'INSERT INTO saved_addresses (customer_id, label, address, is_default) VALUES (?, ?, ?, ?)',
            [customerId, label || 'Home', address, is_default || false]
        );
        
        res.status(201).json({ message: 'Address added successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const addPaymentMethod = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { type, detail, is_default } = req.body;
        
        if (!type || !detail) {
            return res.status(400).json({ message: 'Type and detail are required' });
        }

        // Insert new payment method
        const [result] = await db.query(
            'INSERT INTO payment_methods (customer_id, type, detail, is_default) VALUES (?, ?, ?, ?)',
            [customerId, type, detail, is_default || false]
        );
        
        res.status(201).json({ message: 'Payment method added successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getProfileStats, getAddresses, getPaymentMethods, addAddress, addPaymentMethod };
