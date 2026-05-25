import { createServerClient }
from "@supabase/ssr";

import { NextResponse }
from "next/server";

import type { NextRequest }
from "next/server";

export async function middleware(
  request: NextRequest
) {

  let response =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(

      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,

      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      {
        cookies: {

          get(name: string) {

            return request.cookies
              .get(name)?.value;
          },

          set(
            name: string,
            value: string,
            options: any
          ) {

            response.cookies.set({
              name,
              value,
              ...options,
            });
          },

          remove(
            name: string,
            options: any
          ) {

            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

  // IMPORTANT FIX

  const {
    data: { session },
  } = await supabase.auth
    .getSession();

  const user =
    session?.user;

  const protectedRoutes = [
    "/dashboard",
    "/assessment",
    "/report",
    "/admin",
  ];

  const isProtected =
    protectedRoutes.some((route) =>
      request.nextUrl.pathname
        .startsWith(route)
    );

  if (
    isProtected &&
    !user
  ) {

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  return response;
}

export const config = {

  matcher: [
    "/dashboard/:path*",
    "/assessment/:path*",
    "/report/:path*",
    "/admin/:path*",
  ],
};
