const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/sendEmail');
const { buildRegistrationOtpEmail } = require('../utils/otpEmailTemplate');
const {
    isAllowedEmailDomain,
    INVALID_EMAIL_DOMAIN_MESSAGE,
} = require('../utils/emailDomainValidator');

const OTP_EXPIRY_MS = 10 * 60 * 1000;

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const hashOtp = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp, salt);
};

const sendRegistrationOtp = async (user, name, email) => {
    const otp = generateOtp();
    user.otpHash = await hashOtp(otp);
    user.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
    await user.save();

    const emailContent = buildRegistrationOtpEmail({ name, email, otp });
    await sendEmail(email, emailContent.subject, emailContent.text, emailContent.html);
};

const registerUser = async (req, res) => {
    const { name, email, password, role = 'user' } = req.body;

    try {
        const trimmedEmail = String(email || '').trim();

        if (!isAllowedEmailDomain(trimmedEmail)) {
            return res.status(400).json({ message: INVALID_EMAIL_DOMAIN_MESSAGE });
        }

        const existingUser = await User.findOne({ email: trimmedEmail });

        if (existingUser?.verified) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const normalizedRole = role ? role.toLowerCase() : 'user';

        let user = existingUser;

        if (user && !user.verified) {
            user.name = name;
            user.password = hashedPassword;
            user.role = normalizedRole;
        } else {
            user = await User.create({
                name,
                email: trimmedEmail,
                password: hashedPassword,
                role: normalizedRole,
                verified: false,
            });
        }

        await sendRegistrationOtp(user, name, trimmedEmail);

        res.status(201).json({
            email: user.email,
            name: user.name,
            requiresVerification: true,
            message: 'OTP sent to your email. Please verify to complete registration.',
        });
    } catch (error) {
        console.log('error :', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        const user = await User.findOne({ email }).select('+otpHash +otpExpiresAt');

        if (!user) {
            return res.status(404).json({ message: 'No pending registration found for this email' });
        }

        if (user.verified) {
            return res.status(400).json({ message: 'Account already verified. Please log in.' });
        }

        if (!user.otpHash) {
            return res.status(400).json({ message: 'No OTP pending. Please register again.' });
        }

        if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        const isValid = await bcrypt.compare(String(otp).trim(), user.otpHash);

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        user.verified = true;
        user.otpHash = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user),
            message: 'Email verified successfully. Welcome to Swap Ecommerce Store!',
        });
    } catch (error) {
        console.log('error :', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || user.verified) {
            return res.status(400).json({ message: 'No pending registration found for this email' });
        }

        await sendRegistrationOtp(user, user.name, user.email);

        res.status(200).json({ message: 'A new OTP has been sent to your email.' });
    } catch (error) {
        console.log('error :', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+otpHash');

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.verified && user.otpHash) {
                return res.status(403).json({
                    message: 'Please verify your email with the OTP sent during registration.',
                    requiresVerification: true,
                    email: user.email,
                });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user),
                message: 'logged in successfully',
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({ verified: true }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getMe = async (req, res) => {
    try {
        res.status(200).json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    verifyOtp,
    resendOtp,
    loginUser,
    getUsers,
    getMe,
};
