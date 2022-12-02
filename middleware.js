export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - auth (Authentication pages)
     * - _next/static (static files)
     * - site.webmanifest (webmanifest file)
     * - favicon.ico (favicon file)
     */
    '/((?!api|auth|_next/static|site.webmanifest|favicon.ico).*)',
  ],
};
