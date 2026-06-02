import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Supplier from '@/models/Supplier';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const supplier = await Supplier.findById(resolvedParams.id);
    if (!supplier) return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    return NextResponse.json({ supplier });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch supplier' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await request.json();
    const supplier = await Supplier.findByIdAndUpdate(resolvedParams.id, body, { new: true, runValidators: true });
    if (!supplier) return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    return NextResponse.json({ supplier, message: 'Supplier updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update supplier' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const supplier = await Supplier.findByIdAndDelete(resolvedParams.id);
    if (!supplier) return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    return NextResponse.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 });
  }
}
