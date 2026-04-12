const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function test() {
    try {
        const token = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET || 'fallback', { expiresIn: '1d' });
        console.log('Testing Address...');
        const res1 = await axios.post('http://localhost:5000/api/customer-profile/addresses', 
            { label: 'Work', address: '123 Main St' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Address Added:', res1.data);
    } catch (error) {
        console.error('Error inserting address:', error.response?.data || error.message);
    }

    try {
        const token = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET || 'fallback', { expiresIn: '1d' });
        console.log('Testing Payment...');
        const res2 = await axios.post('http://localhost:5000/api/customer-profile/payment-methods', 
            { type: 'Credit Card', detail: '****1234' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Payment Added:', res2.data);
    } catch (error) {
        console.error('Error inserting payment:', error.response?.data || error.message);
    }
}
test();
