require('dotenv').config();
const { 
    sendWelcomeEmail,
    sendOrderPendingEmail, 
    sendOrderAcceptedEmail, 
    sendOutForDeliveryEmail, 
    sendDeliveryOTPEmail, 
    sendOrderDeliveredEmail 
} = require('../services/emailService');

const testEmail = process.env.SMTP_USER; // Send to self for testing
const customerName = "Test Customer";
const orderId = "ORD-20261027-TEST";
const totalAmount = 599.00;

async function runTests() {
    console.log("Starting Email Service Tests...");

    // 1. Welcome
    console.log("Sending Welcome Email...");
    await sendWelcomeEmail(testEmail, customerName);

    // 2. Pending
    console.log("Sending Pending Email...");
    await sendOrderPendingEmail(testEmail, customerName, orderId, "2x Cheese Burger, 1x Coke", totalAmount);

    // 3. Accepted
    console.log("Sending Accepted Email...");
    await sendOrderAcceptedEmail(testEmail, customerName, orderId, totalAmount);

    // 4. Out for Delivery
    console.log("Sending Out for Delivery Email...");
    await sendOutForDeliveryEmail(testEmail, customerName, orderId, "John Driver", "9876543210", "123 Test Street, Tirupati");

    // 5. Delivery OTP
    console.log("Sending Delivery OTP Email...");
    await sendDeliveryOTPEmail(testEmail, customerName, "123456", "John Driver");

    // 6. Delivered
    console.log("Sending Delivered Email...");
    await sendOrderDeliveredEmail(testEmail, customerName, orderId, totalAmount);

    console.log("All tests completed. Check your inbox!");
}

runTests().catch(console.error);
