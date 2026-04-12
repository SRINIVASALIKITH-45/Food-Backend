const db = require('../config/db');

const getCoupons = async (req, res) => {
    try {
        const [coupons] = await db.query('SELECT * FROM coupons');
        res.json(coupons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createCoupon = async (req, res) => {
    try {
        const { code, discount_percentage, expiry_date, is_active } = req.body;
        const [result] = await db.query(
            'INSERT INTO coupons (code, discount_percentage, expiry_date, is_active) VALUES (?, ?, ?, ?)', 
            [code, discount_percentage, expiry_date, is_active === 'true' || is_active === true || is_active === 1]
        );
        res.status(201).json({ message: 'Coupon created', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, discount_percentage, expiry_date, is_active } = req.body;
        await db.query(
            'UPDATE coupons SET code=?, discount_percentage=?, expiry_date=?, is_active=? WHERE id=?', 
            [code, discount_percentage, expiry_date, is_active === 'true' || is_active === true || is_active === 1, id]
        );
        res.json({ message: 'Coupon updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM coupons WHERE id = ?', [id]);
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        const [coupons] = await db.query('SELECT * FROM coupons WHERE code = ? AND is_active = true', [code]);
        
        if (coupons.length === 0) {
            return res.status(404).json({ message: 'Invalid or expired coupon' });
        }

        const coupon = coupons[0];
        
        // Date check
        if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        // Min order value check
        if (cartTotal < coupon.min_order_value) {
            return res.status(400).json({ message: `Minimum order value for this coupon is ₹${coupon.min_order_value}` });
        }

        const discountValue = Math.round((cartTotal * coupon.discount_percentage) / 100);

        res.json({
            code: coupon.code,
            percentage: coupon.discount_percentage,
            discount: discountValue
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon };
