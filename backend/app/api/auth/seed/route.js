import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

// POST /api/auth/seed - creates first admin (run once)
export async function POST(request) {
  try {
    await connectDB();
    const existing = await Admin.findOne({ email: 'admin@construction.com' });
    if (existing) {
      return NextResponse.json({ message: 'Admin already exists' }, { status: 200 });
    }
    const admin = await Admin.create({
      name: 'System Admin',
      email: 'admin@construction.com',
      password: 'admin123456',
      role: 'admin',
    });
    return NextResponse.json({
      message: 'Admin created successfully',
      credentials: { email: 'admin@construction.com', password: 'admin123456' },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
