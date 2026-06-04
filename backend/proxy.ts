import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define allowed origins for CORS. Adjust for production deployments.
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'construction_secret_key_2026');

/**
 * Determines whether a given request route is public or requires authentication.
 * @param {NextRequest} request - The incoming HTTP request from Next.js.
 * @returns {boolean} True if the route is public, false otherwise.
 */
function isPublicRoute(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;

  // Preflight requests are always public
  if (method === 'OPTIONS') return true;

  // Login endpoint is public
  if (path === '/api/auth/login') return true;

  // Contact form submission is public
  if (path === '/api/contacts' && method === 'POST') return true;

  // Public GET endpoints for the website frontend
  if (method === 'GET') {
    if (path.startsWith('/api/projects')) return true;
    if (path.startsWith('/api/materials')) return true;
    if (path.startsWith('/api/workers')) return true;
  }

  return false;
}

/**
 * Next.js Proxy to handle CORS and JWT authentication for API routes.
 * It intercepts every request matching the config matcher.
 * @param {NextRequest} request - The incoming HTTP request.
 * @returns {NextResponse} The response object.
 */
export async function proxy(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Clone the response to modify headers and potentially return 401 Unauthorized
  let response = NextResponse.next();
  let isAuthorized = true;

  // 1. JWT Authentication Validation
  if (!isPublicRoute(request)) {
    let token = null;
    
    // Check for token in Bearer authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // Check for token in cookies if not found in header
    if (!token) {
      token = request.cookies.get('admin_token')?.value;
    }

    if (!token) {
      isAuthorized = false;
    } else {
      try {
        // Verify the JWT token using the jose library
        await jwtVerify(token, JWT_SECRET);
      } catch (error) {
        isAuthorized = false;
      }
    }

    // Return 401 if unauthorized
    if (!isAuthorized) {
      response = NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }
  }

  // 2. CORS Handling
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    // Fallback for tools like Postman or same-origin requests
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001');
  }

  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests explicitly for OPTIONS method
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
