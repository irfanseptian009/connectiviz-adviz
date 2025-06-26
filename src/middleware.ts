import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /about, /dashboard/settings)
  const path = request.nextUrl.pathname;

  console.log('Middleware: Processing path:', path);

  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/signin' || 
    path === '/signup' || 
    path === '/forgot-password' ||
    path === '/reset-password' ||
    path === '/' || // Allow root page (it handles redirect)
    path.startsWith('/api/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/static/') ||
    path === '/favicon.ico';

  // Get token from cookies or headers
  const token = request.cookies.get('token')?.value || 
                request.cookies.get('sso-token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  console.log('Middleware: isPublicPath:', isPublicPath, 'token:', !!token);

  // If it's a public path, allow access
  if (isPublicPath) {
    console.log('Middleware: Allowing public path');
    return NextResponse.next();
  }

  // For protected routes, we'll let the frontend handle authentication
  // since tokens are stored in localStorage
  console.log('Middleware: Allowing protected path (client-side auth)');
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};