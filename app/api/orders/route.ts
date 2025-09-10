import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { requireAuth } from '@/middleware/auth';

// POST /api/orders - Place order
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Check authentication
    const user = requireAuth(req);

    const { shippingAddress } = await req.json();

    // Get user's cart
    const cart = await Cart.findOne({ userId: user.userId })
      .populate('products.productId');

    if (!cart || cart.products.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate stock and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of cart.products) {
      const product = item.productId as any;
      
      if (!product) {
        return NextResponse.json(
          { error: 'One or more products in cart no longer exist' },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.title}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity
      });
    }

    // Create order
    const order = await Order.create({
      userId: user.userId,
      products: orderItems,
      total: parseFloat(total.toFixed(2)),
      status: 'pending',
      shippingAddress
    });

    // Update product stock
    for (const item of cart.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    await Cart.findByIdAndDelete(cart._id);

    return NextResponse.json({
      message: 'Order placed successfully',
      order
    }, { status: 201 });

  } catch (error: any) {
    console.error('Place order error:', error);

    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get user's orders
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Check authentication
    const user = requireAuth(req);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Build query
    const query: any = { userId: user.userId };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('products.productId', 'title images');

    // Get total count for pagination
    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error: any) {
    console.error('Get orders error:', error);

    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
