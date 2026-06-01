import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Supplier from '@/models/Supplier';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    await connectDB();
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    return NextResponse.json({ suppliers }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const supplier = await Supplier.create(body);
    return NextResponse.json({ supplier, message: 'Supplier added successfully' }, { status: 201, headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create supplier' }, { status: 400, headers: CORS_HEADERS });
  }
}
