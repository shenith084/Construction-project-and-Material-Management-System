import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assignment from '@/models/Assignment';

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
    const assignments = await Assignment.find()
      .populate('project', 'title status')
      .populate('worker', 'name role')
      .sort({ createdAt: -1 });
    return NextResponse.json({ assignments }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const assignment = await Assignment.create(body);
    const populated = await Assignment.findById(assignment._id)
      .populate('project', 'title')
      .populate('worker', 'name role');
    return NextResponse.json({ assignment: populated, message: 'Assignment created successfully' }, { status: 201, headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create assignment' }, { status: 400, headers: CORS_HEADERS });
  }
}
