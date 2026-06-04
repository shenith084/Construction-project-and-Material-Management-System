import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

/**
 * Handles GET requests to retrieve all contact messages.
 * Messages are sorted by creation date in descending order.
 * 
 * @returns {NextResponse} JSON response containing the list of contacts.
 */
export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ contacts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

/**
 * Handles POST requests to submit a new contact message.
 * Validates the input payload, ensures a valid email structure,
 * and saves the new contact entry into the database.
 * 
 * @param {Request} request - The incoming HTTP request containing the contact details.
 * @returns {NextResponse} JSON response containing the saved contact and a success message.
 */
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Name, email, subject, and message are required' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    const contact = await Contact.create(body);
    return NextResponse.json({ contact, message: 'Message sent successfully!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 400 });
  }
}
