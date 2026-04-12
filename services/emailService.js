const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const fromEmail = "Tirupati Hub Spot <likithmangapuram@gmail.com>";

// Common Styling Constants
const mainBg = "#f9fafb";
const cardBg = "#ffffff";
const primaryColor = "#4f46e5"; // Professional Indigo
const textColor = "#1f2937";
const subTextColor = "#4b5563";
const borderColor = "#e5e7eb";

/**
 * 1. Order Received – Pending Confirmation
 */
const sendOrderPendingEmail = async (customerEmail, customerName, orderId, orderItems, totalAmount) => {
    try {
        const mailOptions = {
            from: fromEmail,
            to: customerEmail,
            subject: "Order Confirmation - Pending Verification",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${mainBg}; padding: 40px 20px; color: ${textColor};">
              <div style="max-width: 600px; margin: 0 auto; background-color: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                
                <div style="background-color: ${primaryColor}; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Tirupati Hub Spot</h1>
                </div>

                <div style="padding: 40px;">
                  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Dear ${customerName},</h2>
                  
                  <p style="line-height: 1.6; margin-bottom: 25px; color: ${subTextColor};">
                    Thank you for choosing Tirupati Hub Spot. We are pleased to inform you that your order has been successfully received and is currently being processed by our team. Our management is presently reviewing the order details to ensure everything is prepared to our high standards. Once confirmed, you will receive a follow-up notification regarding the preparation and estimated delivery schedule. We appreciate your patience and look forward to serving you.
                  </p>

                  <div style="background-color: #f3f4f6; padding: 25px; border-radius: 6px; border-left: 4px solid ${primaryColor};">
                    <h3 style="margin-top: 0; font-size: 16px; font-weight: 600; color: ${textColor}; border-bottom: 1px solid ${borderColor}; padding-bottom: 10px; margin-bottom: 15px;">Order Summary</h3>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Order Reference:</strong> ${orderId}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Requested Items:</strong> ${orderItems}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Total Commitment:</strong> ₹${totalAmount}</p>
                    <p style="margin: 15px 0 0 0; font-size: 13px; color: #ef4444; font-weight: 500;">Status: Awaiting Management Confirmation</p>
                  </div>

                  <p style="margin-top: 30px; font-size: 14px; color: ${subTextColor};">
                    Should you have any immediate questions regarding your order, please do not hesitate to contact our customer support team.
                  </p>
                </div>

                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid ${borderColor}; font-size: 12px; color: #9ca3af;">
                  © 2026 FOOD TECH APP | Professional Delivery Services | All Rights Reserved
                </div>
              </div>
            </div>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL COMPLETED] Professional Pending email sent to ${customerEmail}`);
        return true;
    } catch (error) {
        console.error('[EMAIL ERROR] Failed to send Professional Pending email:', error);
        return false;
    }
};

/**
 * 2. Order Accepted
 */
const sendOrderAcceptedEmail = async (customerEmail, customerName, orderId, totalAmount) => {
    try {
        const mailOptions = {
            from: fromEmail,
            to: customerEmail,
            subject: "Order Confirmation - Preparation Commenced",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${mainBg}; padding: 40px 20px; color: ${textColor};">
              <div style="max-width: 600px; margin: 0 auto; background-color: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

                <div style="background-color: #10b981; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Tirupati Hub Spot</h1>
                </div>

                <div style="padding: 40px;">
                  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Dear ${customerName},</h2>
                  
                  <p style="line-height: 1.6; margin-bottom: 25px; color: ${subTextColor};">
                    We are delighted to confirm that your order has been accepted and is now in the preparation phase. Our dedicated culinary team is working diligently to prepare your meal using the freshest ingredients available. We prioritize both quality and timeliness to ensure that your dining experience meets your expectations. You will be notified as soon as your order is ready for dispatch to your location.
                  </p>

                  <div style="background-color: #ecfdf5; padding: 25px; border-radius: 6px; border-left: 4px solid #10b981;">
                    <h3 style="margin-top: 0; font-size: 16px; font-weight: 600; color: ${textColor}; border-bottom: 1px solid #d1fae5; padding-bottom: 10px; margin-bottom: 15px;">Order Information</h3>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Order ID:</strong> ${orderId}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
                    <p style="margin: 15px 0 0 0; font-size: 13px; color: #059669; font-weight: 500;">Status: Preparation in Progress</p>
                  </div>

                  <p style="margin-top: 30px; font-size: 14px; color: ${subTextColor};">
                    Thank you for your patience as we prepare your meal to our exacting standards.
                  </p>
                </div>

                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid ${borderColor}; font-size: 12px; color: #9ca3af;">
                  © 2026 FOOD TECH APP | Quality Guaranteed | All Rights Reserved
                </div>
              </div>
            </div>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL COMPLETED] Professional Accepted email sent to ${customerEmail}`);
        return true;
    } catch (error) {
        console.error('[EMAIL ERROR] Failed to send Professional Accepted email:', error);
        return false;
    }
};

/**
 * 3. Out for Delivery
 */
const sendOutForDeliveryEmail = async (customerEmail, customerName, orderId, driverName, driverPhone, deliveryAddress) => {
    try {
        const mailOptions = {
            from: fromEmail,
            to: customerEmail,
            subject: "Update - Order Dispatched for Delivery",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${mainBg}; padding: 40px 20px; color: ${textColor};">
              <div style="max-width: 600px; margin: 0 auto; background-color: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

                <div style="background-color: #3b82f6; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Tirupati Hub Spot</h1>
                </div>

                <div style="padding: 40px;">
                  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Dear ${customerName},</h2>
                  
                  <p style="line-height: 1.6; margin-bottom: 25px; color: ${subTextColor};">
                    Your order has been carefully packaged and is now out for delivery with one of our professional courier partners. Our driver is committed to ensuring your meal arrives promptly and in perfect condition. You may find the contact details of your assigned driver below should you need to provide specific delivery instructions. We understand the importance of a timely delivery and thank you for your continued patronage.
                  </p>

                  <div style="background-color: #eff6ff; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; font-size: 15px; font-weight: 600; color: #1e3a8a;">Courier Logistics</h3>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Driver Name:</strong> ${driverName}</p>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Contact Information:</strong> ${driverPhone}</p>
                  </div>

                  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px;">
                    <h3 style="margin-top: 0; font-size: 15px; font-weight: 600; color: ${textColor};">Delivery Information</h3>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Reference ID:</strong> ${orderId}</p>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Destination:</strong> ${deliveryAddress}</p>
                  </div>
                </div>

                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid ${borderColor}; font-size: 12px; color: #9ca3af;">
                  © 2026 FOOD TECH APP | Real-time Operations | All Rights Reserved
                </div>
              </div>
            </div>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL COMPLETED] Professional Out for Delivery email sent to ${customerEmail}`);
        return true;
    } catch (error) {
        console.error('[EMAIL ERROR] Failed to send Professional Out for Delivery email:', error);
        return false;
    }
};

/**
 * 4. Delivery OTP
 */
const sendDeliveryOTPEmail = async (customerEmail, customerName, deliveryOTP, driverName) => {
    try {
        const mailOptions = {
            from: fromEmail,
            to: customerEmail,
            subject: "Security Notification - Delivery Arrival & Verification",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${mainBg}; padding: 40px 20px; color: ${textColor};">
              <div style="max-width: 600px; margin: 0 auto; background-color: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

                <div style="background-color: #7c3aed; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Tirupati Hub Spot</h1>
                </div>

                <div style="padding: 40px;">
                  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Dear ${customerName},</h2>
                  
                  <p style="line-height: 1.6; margin-bottom: 25px; color: ${subTextColor};">
                    Our delivery partner has arrived at your designated location and is ready to hand over your order. To ensure a secure and verified delivery process, we kindly request that you provide the One-Time Password (OTP) listed below to the driver. This verification step is part of our commitment to service security and ensures that your order is delivered personally to you. Thank you for your cooperation in maintaining our delivery standards.
                  </p>

                  <div style="text-align: center; background-color: #f5f3ff; padding: 35px; margin: 30px 0; border: 2px dashed #7c3aed; border-radius: 8px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #6b21a8; font-weight: 600;">Secure Verification Code</p>
                    <h1 style="letter-spacing: 8px; color: #4c1d95; font-size: 42px; margin: 0; font-weight: 700;">${deliveryOTP}</h1>
                  </div>

                  <p style="margin: 5px 0; font-size: 15px;"><strong>Assigned Courier:</strong> ${driverName}</p>
                </div>

                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid ${borderColor}; font-size: 12px; color: #9ca3af;">
                  © 2026 FOOD TECH APP | Secure Logsitics | All Rights Reserved
                </div>
              </div>
            </div>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL COMPLETED] Professional Delivery OTP email sent to ${customerEmail}`);
        return true;
    } catch (error) {
        console.error('[EMAIL ERROR] Failed to send Professional Delivery OTP email:', error);
        return false;
    }
};

/**
 * 5. Order Delivered
 */
const sendOrderDeliveredEmail = async (customerEmail, customerName, orderId, totalAmount) => {
    try {
        const mailOptions = {
            from: fromEmail,
            to: customerEmail,
            subject: "Service Completion - Confirmation of Delivery",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${mainBg}; padding: 40px 20px; color: ${textColor};">
              <div style="max-width: 600px; margin: 0 auto; background-color: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

                <div style="background-color: #f59e0b; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Tirupati Hub Spot</h1>
                </div>

                <div style="padding: 40px;">
                  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Dear ${customerName},</h2>

                  <p style="line-height: 1.6; margin-bottom: 25px; color: ${subTextColor};">
                    On behalf of the entire team at Tirupati Hub Spot, we would like to thank you for your recent order which has now been successfully delivered. It was our pleasure to serve you, and we sincerely hope that you find your meal to be exceptional in both quality and flavor. We are constantly striving to improve our services and would value any feedback you might have regarding your experience today. We look forward to the opportunity of serving you again in the near future.
                  </p>

                  <div style="background-color: #fffbeb; padding: 25px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                    <h3 style="margin-top: 0; font-size: 16px; font-weight: 600; color: ${textColor}; border-bottom: 1px solid #fef3c7; padding-bottom: 10px; margin-bottom: 15px;">Transaction Details</h3>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Order ID:</strong> ${orderId}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Total Settlement:</strong> ₹${totalAmount}</p>
                  </div>

                  <p style="margin-top: 30px; line-height: 1.6; font-size: 14px; color: ${subTextColor};">
                    We appreciate your trust in our services and hope to see you again soon.
                  </p>
                </div>

                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid ${borderColor}; font-size: 12px; color: #9ca3af;">
                  © 2026 FOOD TECH APP | Customer Success | All Rights Reserved
                </div>
              </div>
            </div>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL COMPLETED] Professional Delivered email sent to ${customerEmail}`);
        return true;
    } catch (error) {
        console.error('[EMAIL ERROR] Failed to send Professional Delivered email:', error);
        return false;
    }
};

module.exports = { 
    sendOrderPendingEmail, 
    sendOrderAcceptedEmail, 
    sendOutForDeliveryEmail, 
    sendDeliveryOTPEmail, 
    sendOrderDeliveredEmail 
};
