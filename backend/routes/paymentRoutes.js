const express = require('express');
const router = express.Router();
const {getPaymentConfig, createdOrder, verifyPayment} = require('../controllers/paymentController');

router.get('/config', getPaymentConfig);
router.post('/order', createdOrder);
router.post('/verify', verifyPayment);

module.exports = router;