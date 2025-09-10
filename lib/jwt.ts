import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const signToken = (payload: object): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const generateTokens = (user: { _id: string; email: string; role: string }) => {
  const payload: JWTPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = signToken(payload);
  
  return {
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};
