import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

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
    const project = await Project.findById(resolvedParams.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ project }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await request.json();
    const project = await Project.findByIdAndUpdate(resolvedParams.id, body, { new: true, runValidators: true });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ project, message: 'Project updated successfully' }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: 400, headers: CORS_HEADERS });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const project = await Project.findByIdAndDelete(resolvedParams.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ message: 'Project deleted successfully' }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500, headers: CORS_HEADERS });
  }
}
