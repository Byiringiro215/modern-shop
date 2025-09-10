import { NextRequest } from 'next/server';
import { verifyToken, JWTPayload } from '@/lib/jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export const authenticate = (req: NextRequest): JWTPayload | null => {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);
    
    return decoded;
  } catch (error) {
    return null;
  }
};

export const requireAuth = (req: NextRequest): JWTPayload => {
  const user = authenticate(req);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
};

export const requireAdmin = (req: NextRequest): JWTPayload => {
  const user = requireAuth(req);
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
};

export const getOptionalAuth = (req: NextRequest): JWTPayload | null => {
  return authenticate(req);
};
