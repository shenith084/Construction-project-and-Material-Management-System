import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Worker from '@/models/Worker';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query = status ? { status } : {};
    const workers = await Worker.find(query).populate('assignedProject', 'title').sort({ createdAt: -1 });
    return NextResponse.json({ workers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const worker = await Worker.create(body);
    return NextResponse.json({ worker, message: 'Worker added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create worker' }, { status: 400 });
  }
}
