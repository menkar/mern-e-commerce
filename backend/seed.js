const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User.model');
const Product = require('./models/Product.model');
const Order = require('./models/Order.model');

dotenv.config();

// -----------------------------------------------------------------------------
// Section 1: Seed users
// -----------------------------------------------------------------------------
const userCredentials = [
  {
    name: 'Swapnil Admin',
    email: 'admin@swap.com',
    plainPassword: 'Admin@123',
    role: 'admin',
    verified: true,
  },
  {
    name: 'Priya Sharma',
    email: 'priya@swap.com',
    plainPassword: 'User@123',
    role: 'user',
    verified: true,
  },
  {
    name: 'Rohan Verma',
    email: 'rohan@swap.com',
    plainPassword: 'Guest@123',
    role: 'user',
    verified: false,
  },
  {
    name: 'Anjali Patel',
    email: 'anjali@swap.com',
    plainPassword: 'Shopper@123',
    role: 'user',
    verified: true,
  },
  {
    name: 'Sagar Joshi',
    email: 'sagar@swap.com',
    plainPassword: 'Buyer@123',
    role: 'user',
    verified: true,
  },
];

const users = userCredentials.map((user) => ({
  name: user.name,
  email: user.email,
  password: bcrypt.hashSync(user.plainPassword, 10),
  role: user.role,
  verified: user.verified,
}));

// -----------------------------------------------------------------------------
// Section 2: Seed products
// -----------------------------------------------------------------------------
const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Comfortable over-ear headphones with active noise cancelation and 30 hours of battery life.',
    price: 149.99,
    category: 'electronics',
    stock: 35,
    imageUrl: 'https://example.com/images/headphones.jpg',
    rating: 4.7,
    numReviews: 112,
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track fitness, heart rate, sleep and receive notifications on your wrist.',
    price: 89.99,
    category: 'electronics',
    stock: 12,
    imageUrl: 'https://example.com/images/fitness-watch.jpg',
    rating: 4.4,
    numReviews: 78,
  },
  {
    name: 'Ceramic Coffee Maker',
    description: 'Brew coffee fast with programmable timer and built-in grinder.',
    price: 69.99,
    category: 'home',
    stock: 22,
    imageUrl: 'https://example.com/images/coffee-maker.jpg',
    rating: 4.5,
    numReviews: 44,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with breathable mesh and superior cushioning.',
    price: 79.99,
    category: 'fashion',
    stock: 16,
    imageUrl: 'https://example.com/images/running-shoes.jpg',
    rating: 4.6,
    numReviews: 97,
  },
  {
    name: 'Yoga Mat with Carry Strap',
    description: 'Non-slip yoga mat for home workouts, pilates, and stretching sessions.',
    price: 29.99,
    category: 'fitness',
    stock: 55,
    imageUrl: 'https://example.com/images/yoga-mat.jpg',
    rating: 4.8,
    numReviews: 131,
  },
  {
    name: 'LED Desk Lamp',
    description: 'Adjustable LED lamp with warm/cool lighting and USB charging port.',
    price: 39.99,
    category: 'home',
    stock: 41,
    imageUrl: 'https://example.com/images/desk-lamp.jpg',
    rating: 4.3,
    numReviews: 60,
  },
  {
    name: 'Bluetooth Portable Speaker',
    description: 'Compact speaker with 12-hour battery life and powerful bass.',
    price: 54.99,
    category: 'electronics',
    stock: 27,
    imageUrl: 'https://example.com/images/speaker.jpg',
    rating: 4.6,
    numReviews: 89,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated bottle keeps drinks cold for 24 hours and hot for 12 hours.',
    price: 24.99,
    category: 'fitness',
    stock: 68,
    imageUrl: 'https://example.com/images/water-bottle.jpg',
    rating: 4.9,
    numReviews: 152,
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Soft and breathable everyday t-shirt made from organic cotton.',
    price: 19.99,
    category: 'fashion',
    stock: 78,
    imageUrl: 'https://example.com/images/tshirt.jpg',
    rating: 4.5,
    numReviews: 64,
  },
  {
    name: 'Adjustable Laptop Stand',
    description: 'Aluminum stand with ergonomic height adjustment and cooling airflow.',
    price: 45.99,
    category: 'home',
    stock: 33,
    imageUrl: 'https://example.com/images/laptop-stand.jpg',
    rating: 4.4,
    numReviews: 54,
  },
];

// -----------------------------------------------------------------------------
// Section 3: Seed orders
// -----------------------------------------------------------------------------
const createOrders = (userDocs, productDocs) => {
  const [adminUser, verifiedUser, guestUser, anjaliUser, sagarUser] = userDocs;
  const [headphones, watch, coffeeMaker, shoes, yogaMat, lamp, speaker, bottle, tshirt, laptopStand] = productDocs;

  return [
    {
      user: verifiedUser._id,
      items: [
        { productId: headphones._id, qty: 1, price: headphones.price },
        { productId: coffeeMaker._id, qty: 1, price: coffeeMaker.price },
      ],
      totalAmount: headphones.price + coffeeMaker.price,
      address: {
        fullName: 'Priya Sharma',
        street: '45 Orchid Street',
        city: 'Mumbai',
        postalCode: '400001',
        country: 'India',
      },
      paymentId: 'PAY-ORDER-001',
      status: 'shipped',
    },
    {
      user: guestUser._id,
      items: [
        { productId: yogaMat._id, qty: 2, price: yogaMat.price },
        { productId: bottle._id, qty: 1, price: bottle.price },
      ],
      totalAmount: yogaMat.price * 2 + bottle.price,
      address: {
        fullName: 'Rohan Verma',
        street: '12 Lotus Avenue',
        city: 'Bangalore',
        postalCode: '560001',
        country: 'India',
      },
      paymentId: null,
      status: 'pending',
    },
    {
      user: anjaliUser._id,
      items: [
        { productId: shoes._id, qty: 1, price: shoes.price },
        { productId: watch._id, qty: 1, price: watch.price },
        { productId: lamp._id, qty: 1, price: lamp.price },
      ],
      totalAmount: shoes.price + watch.price + lamp.price,
      address: {
        fullName: 'Anjali Patel',
        street: '8 Jasmine Lane',
        city: 'Pune',
        postalCode: '411001',
        country: 'India',
      },
      paymentId: 'PAY-ORDER-003',
      status: 'delivered',
    },
    {
      user: sagarUser._id,
      items: [
        { productId: tshirt._id, qty: 3, price: tshirt.price },
        { productId: laptopStand._id, qty: 1, price: laptopStand.price },
      ],
      totalAmount: tshirt.price * 3 + laptopStand.price,
      address: {
        fullName: 'Sagar Joshi',
        street: '23 Palm Drive',
        city: 'Delhi',
        postalCode: '110001',
        country: 'India',
      },
      paymentId: 'PAY-ORDER-004',
      status: 'pending',
    },
    {
      user: adminUser._id,
      items: [
        { productId: speaker._id, qty: 1, price: speaker.price },
      ],
      totalAmount: speaker.price,
      address: {
        fullName: 'Swapnil Admin',
        street: '10 Admin Plaza',
        city: 'Mumbai',
        postalCode: '400001',
        country: 'India',
      },
      paymentId: 'PAY-ORDER-005',
      status: 'delivered',
    },
  ];
};

// -----------------------------------------------------------------------------
// Section 4: Main seed workflow
// -----------------------------------------------------------------------------
const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const createdProducts = await Product.insertMany(products);
    const createdOrders = await Order.insertMany(createOrders(createdUsers, createdProducts));

    console.log('Seed data created successfully:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Products: ${createdProducts.length}`);
    console.log(`- Orders: ${createdOrders.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed import failed:', error);
    process.exit(1);
  }
};

const truncateData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('All seed collections truncated successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed truncate failed:', error);
    process.exit(1);
  }
};

// -----------------------------------------------------------------------------
// Section 5: CLI entrypoint
// -----------------------------------------------------------------------------
const start = async () => {
  await connectDB();

  if (process.argv[2] === '--truncate') {
    await truncateData();
  } else {
    await importData();
  }
};

start();
