import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // If there is a token, they are logged in
      return !!token;
    },
  },
});

export const config = {
  // Protect all routes inside the dashboard
  // Adjust these paths based on your actual folder structure
  matcher: [
    "/pipeline/:path*", 
    "/brief/:path*", 
    "/analytics/:path*",
    "/", // If your root is a dashboard view
  ],
};