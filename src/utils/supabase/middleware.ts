import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

    // IMPORTANT: Do not remove this. It refreshes the auth token and must be called
    // before any protected routes are accessed. The cookies are automatically refreshed.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // Protect /profile and /admin routes
    // if ((path.startsWith('/profile') || path.startsWith('/admin')) && !user) {
    //     const url = request.nextUrl.clone()
    //     url.pathname = '/login'
    //     return NextResponse.redirect(url)
    // }

    // CRITICAL: Return the supabaseResponse which contains the refreshed session cookies
    return supabaseResponse
}
