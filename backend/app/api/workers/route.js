import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Worker from '@/models/Worker';

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
    const query = status ? { status } : {};
    const workers = await Worker.find(query).populate('assignedProject', 'title').sort({ createdAt: -1 });
    return NextResponse.json({ workers }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workers' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const worker = await Worker.create(body);
    return NextResponse.json({ worker, message: 'Worker added successfully' }, { status: 201, headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create worker' }, { status: 400, headers: CORS_HEADERS });
  }
}
