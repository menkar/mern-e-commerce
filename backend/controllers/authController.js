const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {sendEmail} = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '7d'});
}

const registerUser = async (req, res) => {
    const {name, email, password} = req.body;
    
    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }  
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({name, email, password: hashedPassword});
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const message = `Welcome to Swap Ecommerce Store, ${name}! Thank you for registering with us.
                Your OTP for Swap Ecommerce Store registration is: ${otp}`;

            await sendEmail(email, 'Welome to Swap Ecommerce Store - Your OTP for registration', message); 
            
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                message: 'User registered successful. Please check your email for otp'})
        } else {
            res.status(400).json({message: 'Invalid user data'});
        }
        
    } catch(error) {
        console.log("error :", error);
        res.status(500).json({message: "Server error"});
    }   
};

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                message: "logged in successfully"
            })
        } else {
            res.status(400).json({message: 'Invalid credentials'});
        }
    } catch(error) {
        res.status(500).json({message: 'Server error'});
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json(users);
    } catch(error) {
        res.status(500).json({message: 'Server error'});
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers
};