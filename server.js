const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const path = require('path');

const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
});

// Middleware to pass socket.io to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// io connection handler
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Middlewares
// WITH THIS
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://week789654.vercel.app',
        'https://week-bsah.vercel.app',
        'https://week-hm1x-hr9rmj9h7-likithmangapuram-gmailcoms-projects.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// ... rest of the middlewares ...
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const driverRoutes = require('./routes/driverRoutes');
const couponRoutes = require('./routes/couponRoutes');
const customerAuthRoutes = require('./routes/customerAuthRoutes');
const settingRoutes = require('./routes/settingRoutes');
const customerProfileRoutes = require('./routes/customerProfileRoutes');
const driverAuthRoutes = require('./routes/driverAuthRoutes');
const writerAuthRoutes = require('./routes/writerAuthRoutes');
const tableRoutes = require('./routes/tableRoutes');
const kotRoutes = require('./routes/kotRoutes');
const kitchenAuthRoutes = require('./routes/kitchenAuthRoutes');
const kitchenStaffRoutes = require('./routes/kitchenStaffRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer-auth', customerAuthRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/customer-profile', customerProfileRoutes);
app.use('/api/driver-auth', driverAuthRoutes);
app.use('/api/writer-auth', writerAuthRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/kots', kotRoutes);
app.use('/api/kitchen-auth', kitchenAuthRoutes);
app.use('/api/kitchen-staff', kitchenStaffRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} with Socket.io`);
});
