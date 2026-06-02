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

export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const supplier = await Supplier.findById(resolvedParams.id);
    if (!supplier) return NextResponse.json({ error: 'Supplier not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ supplier }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch supplier' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await request.json();
    const supplier = await Supplier.findByIdAndUpdate(resolvedParams.id, body, { new: true, runValidators: true });
    if (!supplier) return NextResponse.json({ error: 'Supplier not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ supplier, message: 'Supplier updated successfully' }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update supplier' }, { status: 400, headers: CORS_HEADERS });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const supplier = await Supplier.findByIdAndDelete(resolvedParams.id);
    if (!supplier) return NextResponse.json({ error: 'Supplier not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ message: 'Supplier deleted successfully' }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500, headers: CORS_HEADERS });
  }
}
