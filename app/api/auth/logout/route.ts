import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/middleware/auth';

// POST /api/auth/logout - Logout user
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated (optional - logout should work even if token is invalid)
    const user = authenticate(req);
    
    // In a JWT-based system, logout is typically handled client-side by removing the token
    // However, we can log the logout event or add token to a blacklist if needed
    
    if (user) {
      console.log(`User ${user.userId} logged out at ${new Date().toISOString()}`);
    }

    return NextResponse.json({
      message: 'Logged out successfully'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Logout error:', error);
    
    // Even if there's an error, we should still return success for logout
    // since the client will remove the token anyway
    return NextResponse.json({
      message: 'Logged out successfully'
    }, { status: 200 });
  }
}
