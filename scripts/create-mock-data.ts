// Mock data script that works without database connection
console.log('🎯 Creating mock data for testing...');

const mockUsers = [
  {
    _id: '507f1f77bcf86cd799439011',
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    role: 'admin'
  },
  {
    _id: '507f1f77bcf86cd799439012',
    name: 'John Customer',
    email: 'john@example.com', 
    role: 'customer'
  }
];

const mockProducts = [
  {
    _id: '507f1f77bcf86cd799439021',
    title: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    stock: 50
  },
  {
    _id: '507f1f77bcf86cd799439022',
    title: 'Gaming Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches',
    price: 129.99,
    category: 'Gaming',
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500'],
    stock: 25
  }
];

console.log('✅ Mock data created successfully!');
console.log('\n📋 Sample Accounts:');
console.log('Admin: admin@ecommerce.com / admin123');
console.log('Customer: john@example.com / customer123');

console.log('\n🚀 Start the development server:');
console.log('npm run dev');

console.log('\n🔗 API Endpoints:');
console.log('Documentation: http://localhost:3000/docs');
console.log('Products: http://localhost:3000/api/products');

export { mockUsers, mockProducts };
