import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { signToken } from '@/lib/auth';

/**
 * Handles the POST request for admin login.
 * Validates credentials, creates a JWT token upon success,
 * and sets an HTTP-only cookie for secure session management.
 * 
 * @param {Request} request - The incoming HTTP request containing email and password.
 * @returns {NextResponse} JSON response containing admin data and token, or an error message.
 */
export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ id: admin._id, email: admin.email, role: admin.role });

    const response = NextResponse.json({
      message: 'Login successful',
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      token,
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
