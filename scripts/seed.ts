// Set environment variables directly - UPDATE WITH YOUR ACTUAL CREDENTIALS
// Try MongoDB Atlas with different connection format
process.env.MONGODB_URI = 'mongodb+srv://emmabyiringiro215:emma123@projects.qj36q5u.mongodb.net';
process.env.JWT_SECRET = 'vNf9kP3m0sK7rP1oW8LqZ9aJ5qS8eQ9t';
process.env.JWT_EXPIRES_IN = '7d';
// NODE_ENV is typically set by the runtime environment, so we'll skip setting it here

// Verify environment variables are set
console.log('Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import User from '../models/User';
import Product from '../models/Product';

const sampleProducts = [
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 199.99,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    stock: 50
  },
  {
    title: 'Smartphone Case - Premium Leather',
    description: 'Genuine leather smartphone case with card slots and magnetic closure. Compatible with most phone models.',
    price: 39.99,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500'
    ],
    stock: 100
  },
  {
    title: 'Gaming Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches. Perfect for gaming and typing with tactile feedback.',
    price: 129.99,
    category: 'Gaming',
    images: [
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'
    ],
    stock: 25
  },
  {
    title: 'Fitness Tracker Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life. Track your health goals.',
    price: 249.99,
    category: 'Health & Fitness',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500'
    ],
    stock: 75
  },
  {
    title: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360-degree sound and 12-hour battery. Perfect for outdoor adventures.',
    price: 89.99,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500'
    ],
    stock: 40
  },
  {
    title: 'Laptop Stand - Adjustable',
    description: 'Ergonomic aluminum laptop stand with adjustable height and angle. Improve your workspace comfort.',
    price: 59.99,
    category: 'Office',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500'
    ],
    stock: 30
  },
  {
    title: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with Qi-enabled devices. Sleek design with LED indicator.',
    price: 29.99,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500'
    ],
    stock: 60
  },
  {
    title: 'Gaming Mouse - RGB',
    description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
    price: 79.99,
    category: 'Gaming',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500'
    ],
    stock: 35
  },
  {
    title: 'USB-C Hub - 7-in-1',
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging. Essential for modern laptops.',
    price: 49.99,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    stock: 45
  },
  {
    title: 'Desk Organizer Set',
    description: 'Bamboo desk organizer set with multiple compartments for pens, papers, and office supplies.',
    price: 34.99,
    category: 'Office',
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500'
    ],
    stock: 20
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Customer',
    email: 'john@example.com',
    password: 'customer123',
    role: 'customer'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'customer123',
    role: 'customer'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create products
    const createdProducts = await Product.create(sampleProducts);
    console.log(`📦 Created ${createdProducts.length} products`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('Admin: admin@ecommerce.com / admin123');
    console.log('Customer: john@example.com / customer123');
    console.log('Customer: jane@example.com / customer123');
    
    console.log('\n🔗 API Endpoints:');
    console.log('Documentation: http://localhost:3000/docs');
    console.log('Products: http://localhost:3000/api/products');
    console.log('Auth Register: POST http://localhost:3000/api/auth/register');
    console.log('Auth Login: POST http://localhost:3000/api/auth/login');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
