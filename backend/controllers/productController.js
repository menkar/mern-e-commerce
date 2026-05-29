
const Product = require('../models/Product.model');
const cloudinary = require("../config/cloudinary");

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch(error) {
        res.status(500).json({message: "Server error"});
    }
};

const getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({messsage: "Product not found"});
        }       
    } catch(error) {
        res.status(500).json({message: "Server error"});
    }
};

const createProduct = async (req, res) => {
    try {
        const {name, description, price, category, stock} = req.body;
        let imageUrl;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            //console.log("Cloudinary Result : ", result);
            imageUrl = result.secure_url;
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl,
            user: req.user._id
        });
        const savedProduct = await product.save();
        
        res.status(201).json({savedProduct});

    } catch(error) {
        res.status(500).json({message: 'Server error'});
    }
};

const updateProduct = async (req, res) => {
    try {
       const {name, description, price, category, stock} = req.body;
       const product = await Product.findById(req.params.id);
       if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                product.imageUrl = result.secure_url;
            }
            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
       } else {
            res.status(404).json({message: 'Product not found'});
       }

    } catch(error){
        console.log("Error :", error);
        res.status(500).json({message: 'Server error'});
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
             await product.deleteOne();
             res.json({message: "Product deleted successfully"});
        } else {
            res.status(404).json({message: 'Product not found'});
        }
    } catch(error) {
        res.status(500).json({message: "Server error"});
    }
};



module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};