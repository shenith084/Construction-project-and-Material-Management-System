import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

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
    const resolvedParams = await params;
    const body = await request.json();
    const contact = await Contact.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    if (!contact) return NextResponse.json({ error: 'Message not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ contact, message: 'Message updated' }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 400, headers: CORS_HEADERS });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const contact = await Contact.findByIdAndDelete(resolvedParams.id);
    if (!contact) return NextResponse.json({ error: 'Message not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ message: 'Message deleted' }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500, headers: CORS_HEADERS });
  }
}
