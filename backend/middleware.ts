import { NextResponse } from 'next/server';

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

export function middleware(request) {
  const origin = request.headers.get('origin');
  
  const response = NextResponse.next();
  
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    // Fallback for tools like Postman or same-origin requests
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001');
  }

  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
