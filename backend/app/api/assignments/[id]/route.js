import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import '@/models/Project'; // Register models for .populate()
import '@/models/Worker';


export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const assignment = await Assignment.findById(resolvedParams.id).populate('project worker');
    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    return NextResponse.json({ assignment });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assignment' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await request.json();
    const assignment = await Assignment.findByIdAndUpdate(resolvedParams.id, body, { new: true }).populate('project worker');
    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    return NextResponse.json({ assignment, message: 'Assignment updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update assignment' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const assignment = await Assignment.findByIdAndDelete(resolvedParams.id);
    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    return NextResponse.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
  }
}
