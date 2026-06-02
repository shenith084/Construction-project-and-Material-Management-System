import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assignment from '@/models/Assignment';

export async function GET() {
  try {
    await connectDB();
    const assignments = await Assignment.find()
      .populate('project', 'title status')
      .populate('worker', 'name role')
      .sort({ createdAt: -1 });
    return NextResponse.json({ assignments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
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
    return NextResponse.json({ assignment: populated, message: 'Assignment created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create assignment' }, { status: 400 });
  }
}
