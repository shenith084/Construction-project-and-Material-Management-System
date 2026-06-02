import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Supplier from '@/models/Supplier';

export async function GET() {
  try {
    await connectDB();
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    return NextResponse.json({ suppliers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const supplier = await Supplier.create(body);
    return NextResponse.json({ supplier, message: 'Supplier added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create supplier' }, { status: 400 });
  }
}
