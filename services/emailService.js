const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: true, // Print SMTP conversation logs for debugging
  debug: true,  // Print debug info
});

const fromEmail = "Tirupati Hub Spot <likithmangapuram@gmail.com>";

const mainBg = "#f9fafb";
const cardBg = "#ffffff";
const primaryColor = "#4f46e5";
const textColor = "#1f2937";
const subTextColor = "#4b5563";
const borderColor = "#e5e7eb";

/**
 * 1. Welcome Email
 */
const sendWelcomeEmail = async (customerEmail, customerName) => {
  try {
    const mailOptions = {
      from: fromEmail,
      to: customerEmail,
      subject: "Welcome to Tirupati Hub Spot!",
      html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${mainBg}; padding: 40px 20px; color: ${textColor};">
              <div style="max-width: 600px; margin: 0 auto; background-color: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background-color: ${primaryColor}; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Tirupati Hub Spot</h1>
                </div>
                <div style="padding: 40px;">
                  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Welcome, ${customerName}!</h2>
                  <p style="line-height: 1.6; color: ${subTextColor};">
                    Thank you for registering with Tirupati Hub Spot. Your account has been successfully created. We are excited to serve you with the best food delivery experience.
                  </p>
                  <p style="line-height: 1.6; color: ${subTextColor};">
                    You can now browse our menu, place orders, and track deliveries in real time.
                  </p>
                </div>
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid ${borderColor}; font-size: 12px; color: #9ca3af;">
                  © 2026 FOOD TECH APP | All Rights Reserved
                </div>
              </div>
            </div>`
    };
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL COMPLETED] Welcome email sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send Welcome email:', {
      error: error.message,
      code: error.code,
      command: error.command
    });
    return false;
  }
};

/**
 * 2. Order Received – Pending Confirmation
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
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Tirupati Hub Spot</h1>
                </div>
                <div style="padding: 40px;">
                  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Dear ${customerName},</h2>
                  <p style="line-height: 1.6; margin-bottom: 25px; color: ${subTextColor};">
                    Thank you for choosing Tirupati Hub Spot. Your order has been successfully received and is currently being processed by our team.
                  </p>
                  <div style="background-color: #f3f4f6; padding: 25px; border-radius: 6px; border-left: 4px solid ${primaryColor};">
                    <h3 style="margin-top: 0; font-size: 16px; font-weight: 600; color: ${textColor}; border-bottom: 1px solid ${borderColor}; padding-bottom: 10px; margin-bottom: 15px;">Order Summary</h3>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Order Reference:</strong> ${orderId}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Requested Items:</strong> ${orderItems}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
                    <p style="margin: 15px 0 0 0; font-size: 13px; color: #ef4444; font-weight: 500;">Status: Awaiting Management Confirmation</p>
                  </div>
                </div>
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid ${borderColor}; font-size: 12px; color: #9ca3af;">
                  © 2026 FOOD TECH APP | All Rights Reserved
                </div>
              </div>
            </div>`
    };
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL COMPLETED] Pending email sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send Pending email:', {
      error: error.message,
      code: error.code,
      command: error.command
    });
    return false;
  }
};

/**
 * 3. Order Accepted
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
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Tirupati Hub Spot</h1>
                </div>
                <div style="padding: 40px;">
                  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Dear ${customerName},</h2>
                  <p style="line-height: 1.6; margin-bottom: 25px; color: ${subTextColor};">
                    Your order has been accepted and is now in the preparation phase.
                  </p>
                  <div style="background-color: #ecfdf5; padding: 25px; border-radius: 6px; border-left: 4px solid #10b981;">
                    <h3 style="margin-top: 0; font-size: 16px; font-weight: 600; color: ${textColor}; border-bottom: 1px solid #d1fae5; padding-bottom: 10px; margin-bottom: 15px;">Order Information</h3>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Order ID:</strong> ${orderId}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
                    <p style="margin: 15px 0 0 0; font-size: 13px; color: #059669; font-weight: 500;">Status: Preparation in Progress</p>
                  </div>
                </div>
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid ${borderColor}; font-size: 12px; color: #9ca3af;">
                  © 2026 FOOD TECH APP | All Rights Reserved
                </div>
              </div>
            </div>`
    };
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL COMPLETED] Accepted email sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send Accepted email:', {
      error: error.message,
      code: error.code,
      command: error.command
    });
    return false;
  }
};

/**
 * 4. Out for Delivery
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
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Tirupati Hub Spot</h1>
                </div>
                <div style="padding: 40px;">
                  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Dear ${customerName},</h2>
                  <p style="line-height: 1.6; margin-bottom: 25px; color: ${subTextColor};">
                    Your order is now out for delivery!
                  </p>
                  <div style="background-color: #eff6ff; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; font-size: 15px; font-weight: 600; color: #1e3a8a;">Courier Details</h3>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Driver:</strong> ${driverName}</p>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${driverPhone}</p>
                  </div>
                  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px;">
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Order ID:</strong> ${orderId}</p>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Delivery Address:</strong> ${deliveryAddress}</p>
                  </div>
                </div>
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid ${borderColor}; font-size: 12px; color: #9ca3af;">
                  © 2026 FOOD TECH APP | All Rights Reserved
                </div>
              </div>
            </div>`
    };
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL COMPLETED] Out for Delivery email sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send Out for Delivery email:', {
      error: error.message,
      code: error.code,
      command: error.command
    });
    return false;
  }
};

/**
 * 5. Delivery OTP
 */
const sendDeliveryOTPEmail = async (customerEmail, customerName, deliveryOTP, driverName) => {
  try {
    const mailOptions = {
      from: fromEmail,
      to: customerEmail,
      subject: "Security Notification - Delivery OTP",
      html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${mainBg}; padding: 40px 20px; color: ${textColor};">
              <div style="max-width: 600px; margin: 0 auto; background-color: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #7c3aed; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Tirupati Hub Spot</h1>
                </div>
                <div style="padding: 40px;">
                  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Dear ${customerName},</h2>
                  <p style="line-height: 1.6; margin-bottom: 25px; color: ${subTextColor};">
                    Your delivery has arrived! Please share the OTP below with the driver.
                  </p>
                  <div style="text-align: center; background-color: #f5f3ff; padding: 35px; margin: 30px 0; border: 2px dashed #7c3aed; border-radius: 8px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #6b21a8; font-weight: 600;">Verification Code</p>
                    <h1 style="letter-spacing: 8px; color: #4c1d95; font-size: 42px; margin: 0; font-weight: 700;">${deliveryOTP}</h1>
                  </div>
                  <p style="margin: 5px 0; font-size: 15px;"><strong>Driver:</strong> ${driverName}</p>
                </div>
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid ${borderColor}; font-size: 12px; color: #9ca3af;">
                  © 2026 FOOD TECH APP | All Rights Reserved
                </div>
              </div>
            </div>`
    };
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL COMPLETED] Delivery OTP email sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send Delivery OTP email:', {
      error: error.message,
      code: error.code,
      command: error.command
    });
    return false;
  }
};

/**
 * 6. Order Delivered
 */
const sendOrderDeliveredEmail = async (customerEmail, customerName, orderId, totalAmount) => {
  try {
    const mailOptions = {
      from: fromEmail,
      to: customerEmail,
      subject: "Service Completion - Order Delivered",
      html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${mainBg}; padding: 40px 20px; color: ${textColor};">
              <div style="max-width: 600px; margin: 0 auto; background-color: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #f59e0b; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Tirupati Hub Spot</h1>
                </div>
                <div style="padding: 40px;">
                  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Dear ${customerName},</h2>
                  <p style="line-height: 1.6; margin-bottom: 25px; color: ${subTextColor};">
                    Your order has been successfully delivered. Thank you for choosing Tirupati Hub Spot!
                  </p>
                  <div style="background-color: #fffbeb; padding: 25px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Order ID:</strong> ${orderId}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
                  </div>
                </div>
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid ${borderColor}; font-size: 12px; color: #9ca3af;">
                  © 2026 FOOD TECH APP | All Rights Reserved
                </div>
              </div>
            </div>`
    };
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL COMPLETED] Delivered email sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send Delivered email:', {
      error: error.message,
      code: error.code,
      command: error.command
    });
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderPendingEmail,
  sendOrderAcceptedEmail,
  sendOutForDeliveryEmail,
  sendDeliveryOTPEmail,
  sendOrderDeliveredEmail
};