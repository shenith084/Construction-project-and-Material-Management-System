import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const project = await Project.findById(resolvedParams.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await request.json();
    const project = await Project.findByIdAndUpdate(resolvedParams.id, body, { new: true, runValidators: true });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json({ project, message: 'Project updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const project = await Project.findByIdAndDelete(resolvedParams.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
