const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.get("/", (req, res) => {
//     res.send("Swap Ecommerce Store Backend is working.");   
// });

app.use("/api/v1/auth", require('./routes/authRoutes'));
app.use("/api/v1/products", require('./routes/productRoutes'));
app.use("/api/v1/orders", require('./routes/orderRoutes'));
app.use("/api/v1/payments", require('./routes/paymentRoutes'));
app.use("/api/v1/analytics", require('./routes/analyticRoutes'));

// Serve frontend in production
if (process.env.FRONTEND_URL === 'production') {
    app.use(express.static(Path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    });
} else {
    app.get("/",(req, res) => {
        res.send("Swap Ecommerce Store Backend is working.");   
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});