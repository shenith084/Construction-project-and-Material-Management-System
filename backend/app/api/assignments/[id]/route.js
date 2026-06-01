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

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const assignment = await Assignment.findByIdAndUpdate(params.id, body, { new: true })
      .populate('project', 'title')
      .populate('worker', 'name role');
    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ assignment, message: 'Assignment updated' }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const assignment = await Assignment.findByIdAndDelete(params.id);
    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ message: 'Assignment removed' }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500, headers: CORS_HEADERS });
  }
}
