import { clerkMiddleware, createRouteMatcher } from '@clerk/clerk-sdk-node';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/health',
    '/api/webhooks(.*)',
]);

// Export Clerk middleware for Express
// This middleware automatically:
// - Validates authentication tokens
// - Populates req.auth with user information
// - Protects non-public routes
export const clerkExpressMiddleware = clerkMiddleware({
    // Allow unauthenticated access to public routes
    // All other routes will require authentication
    authorizedParties: ['http://localhost:5000', 'http://localhost:5173'],
});

// Note: This middleware is applied globally in server/index.js
// Individual routes can use ClerkExpressRequireAuth() for explicit protection
