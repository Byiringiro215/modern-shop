import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { requireAuth, authenticate } from '@/middleware/auth';
import mongoose from 'mongoose';

// GET /api/cart - Get user's cart
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Check authentication (optional for guest users)
    const user = authenticate(req);

    if (!user) {
      // Return empty cart for guest users
      return NextResponse.json({
        cart: { products: [], total: 0 }
      });
    }

    const cart = await Cart.findOne({ userId: user.userId })
      .populate('products.productId', 'title price images stock');

    if (!cart) {
      return NextResponse.json({
        cart: { products: [], total: 0 }
      });
    }

    // Calculate total
    let total = 0;
    const validProducts = cart.products.filter((item: any) => {
      if (item.productId) {
        total += (item.productId as any).price * item.quantity;
        return true;
      }
      return false;
    });

    return NextResponse.json({
      cart: {
        ...cart.toObject(),
        products: validProducts,
        total: parseFloat(total.toFixed(2))
      }
    });

  } catch (error: any) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add product to cart
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Check authentication (optional for guest users)
    const user = authenticate(req);

    const { productId, quantity = 1 } = await req.json();

    // Validation
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // For guest users, just return success with product info
    if (!user) {
      return NextResponse.json({
        message: 'Product validated for cart (guest mode)',
        product: {
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || product.image,
          stock: product.stock
        }
      }, { status: 200 });
    }

    // For authenticated users, save to database
    let cart = await Cart.findOne({ userId: user.userId });
    
    if (!cart) {
      cart = new Cart({
        userId: user.userId,
        products: []
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.products.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.products[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return NextResponse.json(
          { error: 'Insufficient stock for requested quantity' },
          { status: 400 }
        );
      }

      cart.products[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.products.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity
      });
    }

    await cart.save();

    // Return updated cart with populated products
    const updatedCart = await Cart.findById(cart._id)
      .populate('products.productId', 'title price images stock');

    return NextResponse.json({
      message: 'Product added to cart successfully',
      cart: updatedCart
    }, { status: 201 });

  } catch (error: any) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
