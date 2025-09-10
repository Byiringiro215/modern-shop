# eCommerce Backend API

A production-ready eCommerce backend built with **Next.js 14** (App Router), **TypeScript**, and **MongoDB**. This API provides complete functionality for user authentication, product management, shopping cart, and order processing.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Secure password hashing with bcrypt
- Role-based access control (Admin/Customer)
- Protected route middleware

### 📦 Product Management
- Full CRUD operations for products
- Search and filtering capabilities
- Pagination support
- Category-based organization
- Stock management

### 🛒 Shopping Cart
- Add/remove products from cart
- Update product quantities
- Real-time stock validation
- User-specific cart management

### 📋 Order Management
- Place orders with automatic stock updates
- Order history tracking
- Admin order management
- Order status tracking

### 📚 API Documentation
- Complete Swagger/OpenAPI documentation
- Interactive API testing interface
- Comprehensive schema definitions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Documentation**: Swagger UI + OpenAPI 3.0
- **Validation**: Built-in Mongoose validation

## 📁 Project Structure

```
ecommerce/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   └── login/route.ts
│   │   ├── products/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── cart/
│   │   │   ├── route.ts
│   │   │   └── [productId]/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── all/route.ts
│   │   └── docs/route.ts
│   └── docs/page.tsx
├── lib/
│   ├── mongodb.ts
│   ├── jwt.ts
│   └── swagger.ts
├── middleware/
│   └── auth.ts
├── models/
│   ├── User.ts
│   ├── Product.ts
│   ├── Cart.ts
│   └── Order.ts
├── scripts/
│   └── seed.ts
├── types/
│   └── global.d.ts
├── .env.local.example
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone and install dependencies**
```bash
cd ecommerce
npm install
```

2. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

3. **Seed the database with sample data**
```bash
npm run seed
```

4. **Start the development server**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

Visit `http://localhost:3000/docs` for interactive API documentation.

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add product to cart
- `PUT /api/cart/[productId]` - Update quantity
- `DELETE /api/cart/[productId]` - Remove from cart

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/all` - Get all orders (admin only)

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Sample Accounts (after seeding)
- **Admin**: `admin@ecommerce.com` / `admin123`
- **Customer**: `john@example.com` / `customer123`
- **Customer**: `jane@example.com` / `customer123`

## 📝 Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get products with pagination
```bash
curl "http://localhost:3000/api/products?page=1&limit=10&category=Electronics"
```

### Add product to cart (requires authentication)
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "productId": "product_id_here",
    "quantity": 2
  }'
```

## 🔧 Configuration

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_EXPIRES_IN` - Token expiration time (default: 7d)
- `NODE_ENV` - Environment (development/production)

### Database Indexes
The application automatically creates indexes for:
- User email (unique)
- Product search (text index on title, description, category)
- Product category and price
- Cart userId
- Order userId and status

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup for Production
1. Set `NODE_ENV=production`
2. Use a strong, random `JWT_SECRET`
3. Configure MongoDB Atlas or production MongoDB instance
4. Enable HTTPS in production

## 🧪 Testing the API

1. **Start the server**: `npm run dev`
2. **Seed sample data**: `npm run seed`
3. **Visit documentation**: `http://localhost:3000/docs`
4. **Test endpoints** using the interactive Swagger UI

## 📊 Database Schema

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: 'admin' | 'customer'

### Product
- `title`: String (required)
- `description`: String (required)
- `price`: Number (required, min: 0)
- `category`: String (required)
- `images`: Array of strings
- `stock`: Number (min: 0)

### Cart
- `userId`: ObjectId (ref: User)
- `products`: Array of { productId, quantity }

### Order
- `userId`: ObjectId (ref: User)
- `products`: Array of { productId, title, price, quantity }
- `total`: Number
- `status`: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
- `shippingAddress`: Object (optional)

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 12)
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- MongoDB injection protection
- CORS configuration
- Environment variable protection

## 🐛 Error Handling

The API provides consistent error responses:

```json
{
  "error": "Error message",
  "details": ["Additional error details"]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 📈 Performance Features

- MongoDB connection pooling
- Efficient database queries with indexes
- Pagination for large datasets
- Optimized Mongoose schemas
- Caching for static content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js 14, TypeScript, and MongoDB**
