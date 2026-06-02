import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await request.json();
    const contact = await Contact.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    if (!contact) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    return NextResponse.json({ contact, message: 'Message updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const contact = await Contact.findByIdAndDelete(resolvedParams.id);
    if (!contact) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    return NextResponse.json({ message: 'Message deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
