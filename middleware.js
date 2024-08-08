import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const { isAuthenticated } = getKindeServerSession();

  // Log the request URL to debug
  console.log("Request URL:", request.url);

  if (!(await isAuthenticated())) {
    // Get the origin from the request headers
    const origin = request.headers.get("origin") || "http://localhost:3000"; // Fallback to a default value
    // Construct the full URL
    const redirectUrl = new URL(
      "/api/auth/login?post_login_redirect_url=/",
      origin
    );

    // Log the redirect URL to debug
    console.log("Redirect URL:", redirectUrl.toString());

    return NextResponse.redirect(redirectUrl);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/details/:path*"],
};
