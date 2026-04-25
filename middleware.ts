import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/checkout(.*)',
  '/profile(.*)',
  '/branch-dashboard(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const isEvaluation = url.searchParams.get('evaluation') === 'true';

  if (isProtectedRoute(req) && !isEvaluation) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
