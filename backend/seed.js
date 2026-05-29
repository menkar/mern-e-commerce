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
    description:
      'Comfortable over-ear headphones with active noise cancellation and 30 hours of battery life.',
    price: 149.99,
    category: 'electronics',
    stock: 35,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 112,
  },
  {
    name: 'Smart Fitness Watch',
    description:
      'Track fitness, heart rate, sleep and receive notifications on your wrist.',
    price: 89.99,
    category: 'electronics',
    stock: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    numReviews: 78,
  },
  {
    name: 'Ceramic Coffee Maker',
    description:
      'Brew coffee fast with programmable timer and built-in grinder.',
    price: 69.99,
    category: 'home',
    stock: 22,
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    numReviews: 44,
  },
  {
    name: 'Running Shoes',
    description:
      'Lightweight running shoes with breathable mesh and superior cushioning.',
    price: 79.99,
    category: 'fashion',
    stock: 16,
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 97,
  },
  {
    name: 'Yoga Mat with Carry Strap',
    description:
      'Non-slip yoga mat for home workouts, pilates, and stretching sessions.',
    price: 29.99,
    category: 'fitness',
    stock: 55,
    imageUrl:
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 131,
  },
  {
    name: 'LED Desk Lamp',
    description:
      'Adjustable LED lamp with warm/cool lighting and USB charging port.',
    price: 39.99,
    category: 'home',
    stock: 41,
    imageUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    numReviews: 60,
  },
  {
    name: 'Bluetooth Portable Speaker',
    description:
      'Compact speaker with 12-hour battery life and powerful bass.',
    price: 54.99,
    category: 'electronics',
    stock: 27,
    imageUrl:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 89,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description:
      'Insulated bottle keeps drinks cold for 24 hours and hot for 12 hours.',
    price: 24.99,
    category: 'fitness',
    stock: 68,
    imageUrl:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    numReviews: 152,
  },
  {
    name: 'Organic Cotton T-Shirt',
    description:
      'Soft and breathable everyday t-shirt made from organic cotton.',
    price: 19.99,
    category: 'fashion',
    stock: 78,
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    numReviews: 64,
  },
  {
    name: 'Adjustable Laptop Stand',
    description:
      'Aluminum stand with ergonomic height adjustment and cooling airflow.',
    price: 45.99,
    category: 'home',
    stock: 33,
    imageUrl:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    numReviews: 54,
  },

  // ---------------------------------------------------------------------------
  // Additional ecommerce products
  // ---------------------------------------------------------------------------
  {
    name: 'Apple-Style Wireless Earbuds',
    description:
      'Compact wireless earbuds with charging case, touch controls, and clear audio.',
    price: 59.99,
    category: 'electronics',
    stock: 48,
    imageUrl:
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    numReviews: 143,
  },
  {
    name: 'Slim Business Laptop',
    description:
      'Lightweight laptop for office work, browsing, coding, and online meetings.',
    price: 899.99,
    category: 'electronics',
    stock: 9,
    imageUrl:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 86,
  },
  {
    name: 'Smartphone 5G',
    description:
      'Modern 5G smartphone with high-resolution display and long battery life.',
    price: 699.99,
    category: 'electronics',
    stock: 18,
    imageUrl:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 210,
  },
  {
    name: 'Gaming Mechanical Keyboard',
    description:
      'RGB mechanical keyboard with tactile keys and fast response time.',
    price: 74.99,
    category: 'electronics',
    stock: 31,
    imageUrl:
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 118,
  },
  {
    name: 'Wireless Ergonomic Mouse',
    description:
      'Comfortable wireless mouse with adjustable DPI and silent clicks.',
    price: 34.99,
    category: 'electronics',
    stock: 57,
    imageUrl:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    numReviews: 73,
  },
  {
    name: 'Office Study Chair',
    description:
      'Ergonomic office chair with lumbar support and adjustable height.',
    price: 129.99,
    category: 'home',
    stock: 14,
    imageUrl:
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    numReviews: 66,
  },
  {
    name: 'Modern Fabric Sofa',
    description:
      'Comfortable three-seater sofa for living rooms and lounge spaces.',
    price: 499.99,
    category: 'home',
    stock: 7,
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    numReviews: 39,
  },
  {
    name: 'Non-Stick Cookware Set',
    description:
      'Durable non-stick cookware set for everyday cooking and easy cleaning.',
    price: 119.99,
    category: 'home',
    stock: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 91,
  },
  {
    name: 'Premium Backpack',
    description:
      'Water-resistant backpack with laptop compartment and multiple pockets.',
    price: 49.99,
    category: 'fashion',
    stock: 46,
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    numReviews: 82,
  },
  {
    name: 'Classic Sunglasses',
    description:
      'Stylish UV-protected sunglasses suitable for casual and travel use.',
    price: 29.99,
    category: 'fashion',
    stock: 63,
    imageUrl:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    numReviews: 52,
  },
  {
    name: 'Leather Handbag',
    description:
      'Elegant leather handbag with spacious compartments and premium finish.',
    price: 89.99,
    category: 'fashion',
    stock: 19,
    imageUrl:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 77,
  },
  {
    name: 'Denim Jacket',
    description:
      'Trendy denim jacket with comfortable fit for casual everyday styling.',
    price: 64.99,
    category: 'fashion',
    stock: 28,
    imageUrl:
      'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    numReviews: 69,
  },
  {
    name: 'Adjustable Dumbbell Set',
    description:
      'Space-saving adjustable dumbbells for strength training at home.',
    price: 159.99,
    category: 'fitness',
    stock: 11,
    imageUrl:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 104,
  },
  {
    name: 'Resistance Bands Kit',
    description:
      'Complete resistance band kit for stretching, strength training, and rehab workouts.',
    price: 21.99,
    category: 'fitness',
    stock: 74,
    imageUrl:
      'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    numReviews: 58,
  },
  {
    name: 'Skincare Serum',
    description:
      'Lightweight facial serum designed to hydrate and refresh the skin.',
    price: 32.99,
    category: 'beauty',
    stock: 40,
    imageUrl:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 93,
  },
  {
    name: 'Luxury Perfume',
    description:
      'Long-lasting fragrance with fresh, floral, and woody notes.',
    price: 74.99,
    category: 'beauty',
    stock: 21,
    imageUrl:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 88,
  },
  {
    name: 'Organic Green Tea Pack',
    description:
      'Refreshing green tea made from carefully selected organic tea leaves.',
    price: 14.99,
    category: 'grocery',
    stock: 92,
    imageUrl:
      'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    numReviews: 120,
  },
  {
    name: 'Premium Chocolate Box',
    description:
      'Assorted premium chocolates packed beautifully for gifting and celebrations.',
    price: 27.99,
    category: 'grocery',
    stock: 38,
    imageUrl:
      'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 134,
  },
  {
    name: 'Hardcover Notebook',
    description:
      'Premium ruled notebook for office notes, planning, journaling, and study.',
    price: 12.99,
    category: 'stationery',
    stock: 85,
    imageUrl:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    numReviews: 47,
  },
  {
    name: 'Kids Building Blocks Set',
    description:
      'Colorful building blocks to improve creativity, motor skills, and learning.',
    price: 39.99,
    category: 'toys',
    stock: 36,
    imageUrl:
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 71,
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
