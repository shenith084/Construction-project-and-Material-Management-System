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

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    const materials = await Material.find(query).populate('supplier', 'companyName').sort({ createdAt: -1 });
    return NextResponse.json({ materials }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const material = await Material.create(body);
    return NextResponse.json({ material, message: 'Material added successfully' }, { status: 201, headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create material' }, { status: 400, headers: CORS_HEADERS });
  }
}
