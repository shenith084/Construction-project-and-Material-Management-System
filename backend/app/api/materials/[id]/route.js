import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Material from '@/models/Material';
import '@/models/Supplier'; // Register model for .populate()


export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const material = await Material.findById(resolvedParams.id).populate('supplier', 'companyName');
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    return NextResponse.json({ material });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch material' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await request.json();
    const material = await Material.findByIdAndUpdate(resolvedParams.id, body, { new: true, runValidators: true }).populate('supplier', 'companyName');
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    return NextResponse.json({ material, message: 'Material updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update material' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const material = await Material.findByIdAndDelete(resolvedParams.id);
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    return NextResponse.json({ message: 'Material deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 });
  }
}
