import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const pathname = request.nextUrl.pathname;

  const isProtectedAdmin = pathname.startsWith("/admin");
  const isProtectedUser = pathname.startsWith("/user");

  const isAuthPath = ["/login", "/register"].some((path) =>
    pathname.startsWith(path),
  );

  if ((isProtectedAdmin || isProtectedUser) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProtectedAdmin && role !== "Admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isProtectedUser && role !== "User") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isAuthPath && token) {
    if (role === "Admin") {
      return NextResponse.redirect(new URL("/admin/articles", request.url));
    } else if (role === "User") {
      return NextResponse.redirect(new URL("/user/articles", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
