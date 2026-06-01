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

export async function GET(request, { params }) {
  try {
    await connectDB();
    const worker = await Worker.findById(params.id).populate('assignedProject', 'title status location');
    if (!worker) return NextResponse.json({ error: 'Worker not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ worker }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch worker' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const worker = await Worker.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!worker) return NextResponse.json({ error: 'Worker not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ worker, message: 'Worker updated successfully' }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update worker' }, { status: 400, headers: CORS_HEADERS });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const worker = await Worker.findByIdAndDelete(params.id);
    if (!worker) return NextResponse.json({ error: 'Worker not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ message: 'Worker deleted successfully' }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete worker' }, { status: 500, headers: CORS_HEADERS });
  }
}
