import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Worker from '@/models/Worker';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const worker = await Worker.findById(resolvedParams.id).populate('assignedProject', 'title');
    if (!worker) return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    return NextResponse.json({ worker });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch worker' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await request.json();
    const worker = await Worker.findByIdAndUpdate(resolvedParams.id, body, { new: true, runValidators: true }).populate('assignedProject', 'title');
    if (!worker) return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    return NextResponse.json({ worker, message: 'Worker updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update worker' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const worker = await Worker.findByIdAndDelete(resolvedParams.id);
    if (!worker) return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    return NextResponse.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete worker' }, { status: 500 });
  }
}
