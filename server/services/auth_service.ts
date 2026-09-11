import jwt from 'jsonwebtoken';
import { db, DBUser } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'pragya_jwt_secret_super_secure_key_2026';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'learner' | 'trainer' | 'admin';
  name: string;
}

export function generateToken(user: DBUser): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getUserByEmail(email: string): DBUser | undefined {
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): DBUser | undefined {
  return db.users.find((u) => u.id === id);
}
