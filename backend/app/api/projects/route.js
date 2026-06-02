import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

// GET /api/projects - list all
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query = status ? { status } : {};
    const projects = await Project.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects - create
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const project = await Project.create(body);
    return NextResponse.json({ project, message: 'Project created successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: 400 });
  }
}
