import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Define which routes require authentication
        const { pathname } = req.nextUrl;
        
        // Allow access to auth pages and public routes
        if (
          pathname.startsWith("/api/auth/") ||
          pathname === "/" ||
          pathname === "/about" ||
          pathname.startsWith("/dashboard") // For now, keep dashboard public until we implement protected features
        ) {
          return true;
        }
        
        // Require authentication for these routes
        if (
          pathname.startsWith("/profile") ||
          pathname.startsWith("/settings") ||
          pathname.startsWith("/api/protected")
        ) {
          return !!token;
        }
        
        return true; // Allow all other routes
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};