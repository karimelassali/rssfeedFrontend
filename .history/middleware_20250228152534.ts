import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/sign-in", "/"],
  
  // Routes that can be accessed by both authenticated and unauthenticated users
  ignoredRoutes: ["/api/test"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};