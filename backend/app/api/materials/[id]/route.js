import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Material from '@/models/Material';

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
    const material = await Material.findById(params.id).populate('supplier', 'companyName contactPerson');
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ material }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch material' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const material = await Material.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ material, message: 'Material updated successfully' }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update material' }, { status: 400, headers: CORS_HEADERS });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const material = await Material.findByIdAndDelete(params.id);
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ message: 'Material deleted successfully' }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete material' }, { status: 500, headers: CORS_HEADERS });
  }
}
