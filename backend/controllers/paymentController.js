const Razorpay = require("razorpay");
const crypto = require('crypto');
const dotenv = require('dotenv').config();

const toPaise = (rupees) => {
    const value = Number(rupees);
    if (!Number.isFinite(value) || value <= 0) return 0;
    return Math.round((value + Number.EPSILON) * 100);
};

const getPaymentConfig = async (req, res) => {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_SECRET;

        if (!keyId || !keySecret) {
            return res.status(200).json({ configured: false, is_test_mode: false });
        }

        return res.status(200).json({
            configured: true,
            is_test_mode: keyId.startsWith('rzp_test_'),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createdOrder = async (req, res) => {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_SECRET;

        if (!keyId || !keySecret) {
            return res.status(503).json({ message: 'Payment gateway is not configured' });
        }

        const amountInPaise = toPaise(req.body.amount);
        if (!amountInPaise) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const razorpayInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
            payment_capture: 1,
        };
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({
            ...order,
            key_id: keyId,
            is_test_mode: keyId.startsWith('rzp_test_'),
        });

    } catch(error) {
        console.error('Razorpay order error:', error?.error || error);
        res.status(500).json({
            message: error?.error?.description || 'Server error',
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const keySecret = process.env.RAZORPAY_SECRET;
        if (!keySecret) {
            return res.status(503).json({ message: 'Payment gateway is not configured' });
        }

        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Incomplete payment verification data' });
        }

        const generated_signature = crypto.createHmac('sha256', keySecret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

        if (generated_signature === razorpay_signature) {
            res.status(200).json({message: 'Payment verified successfully'});
        } else {
            res.status(400).json({message: 'Payment verification failed. Check that API keys match in backend .env.'});
        }
    } catch(error) {
        res.status(500).json({message: "Server error"});
    }
};

module.exports = {
    getPaymentConfig,
    createdOrder,
    verifyPayment
}