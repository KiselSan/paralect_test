import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

import PagePaths from "@/shared/constants/pagePaths";
import { SupabaseClient } from "@supabase/supabase-js";

export const supabaseProxy = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request })
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  await supabaseServer.auth.getClaims()

  // Check user Authorization
  supabaseResponse = await checkAuthorization(request, supabaseServer, supabaseResponse);

  return supabaseResponse
}

export const checkAuthorization = async (
  request: NextRequest,
  supabaseServer: SupabaseClient,
  response: NextResponse
) => {

  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user && !request.nextUrl.pathname.startsWith(PagePaths.LOGIN)) {
    return NextResponse.redirect(new URL(PagePaths.LOGIN, request.url));
  }

  if (user && request.nextUrl.pathname.startsWith(PagePaths.LOGIN)) {
    return NextResponse.redirect(new URL(PagePaths.BASE, request.url));
  }

  return response
}

