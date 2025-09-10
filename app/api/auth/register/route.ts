import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateTokens } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, role } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    console.log('Creating user with data:', { name, email: email.toLowerCase(), role: role || 'customer' });
    
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'customer'
    });

    console.log('User created successfully:', {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    });

    // Verify user was actually saved by fetching it
    const savedUser = await User.findById(user._id);
    console.log('User verification from DB:', savedUser ? 'Found' : 'Not found');

    // Generate tokens
    const tokens = generateTokens({
      _id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return NextResponse.json({
      message: 'User registered successfully',
      ...tokens
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
