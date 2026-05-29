const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticRoutes'));

const frontendBuildPath = path.join(__dirname, '../frontend/build');
const hasFrontendBuild = fs.existsSync(path.join(frontendBuildPath, 'index.html'));
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && hasFrontendBuild) {
    app.use(express.static(frontendBuildPath));

    app.use((req, res, next) => {
        if (req.path.startsWith('/api/')) {
            return next();
        }

        if (path.extname(req.path)) {
            return res.status(404).send('Not found');
        }

        res.sendFile(path.join(frontendBuildPath, 'index.html'), (error) => {
            if (error) {
                next(error);
            }
        });
    });
} else {
    if (isProduction && !hasFrontendBuild) {
        console.warn('Production mode is enabled but frontend/build was not found. Run the frontend build before starting the server.');
    }

    app.get('/', (req, res) => {
        res.send('Swap Ecommerce Store Backend is working.');
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (isProduction && hasFrontendBuild) {
        console.log('Serving frontend from', frontendBuildPath);
    }
});
