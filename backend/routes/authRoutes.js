const express = require('express');
const router = express.Router();
const {registerUser, verifyOtp, resendOtp, loginUser, getUsers, getMe} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', [protect, admin], getUsers);

module.exports = router;