import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { requireAuth } from '@/middleware/auth';
import mongoose from 'mongoose';

// PUT /api/cart/[productId] - Update quantity
export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await connectDB();

    // Check authentication
    const user = requireAuth(req);

    const { productId } = params;
    const { quantity } = await req.json();

    // Validation
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

    // Find cart
    const cart = await Cart.findOne({ userId: user.userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Find product in cart
    const itemIndex = cart.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found in cart' },
        { status: 404 }
      );
    }

    // Update quantity
    cart.products[itemIndex].quantity = quantity;
    await cart.save();

    // Return updated cart with populated products
    const updatedCart = await Cart.findById(cart._id)
      .populate('products.productId', 'title price images stock');

    return NextResponse.json({
      message: 'Cart updated successfully',
      cart: updatedCart
    });

  } catch (error: any) {
    console.error('Update cart error:', error);

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

// DELETE /api/cart/[productId] - Remove from cart
export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await connectDB();

    // Check authentication
    const user = requireAuth(req);

    const { productId } = params;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Find cart
    const cart = await Cart.findOne({ userId: user.userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Remove product from cart
    const initialLength = cart.products.length;
    cart.products = cart.products.filter(
      item => item.productId.toString() !== productId
    );

    if (cart.products.length === initialLength) {
      return NextResponse.json(
        { error: 'Product not found in cart' },
        { status: 404 }
      );
    }

    await cart.save();

    // Return updated cart with populated products
    const updatedCart = await Cart.findById(cart._id)
      .populate('products.productId', 'title price images stock');

    return NextResponse.json({
      message: 'Product removed from cart successfully',
      cart: updatedCart
    });

  } catch (error: any) {
    console.error('Remove from cart error:', error);

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
