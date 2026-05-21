const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');
const {getOrders, createOrder, updateOrderStatus, getMyOrders} = require('../controllers/orderController');
const multer = require("multer");

const upload = multer({dest: 'uploads/'});
const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route("/getMyOrders").get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;