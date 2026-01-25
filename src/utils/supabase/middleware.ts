import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // 1. Create Supabase Client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    // 2. Checking for User Session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 3. Current Path
    const path = request.nextUrl.pathname;

    // 4. Protected Routes Logic
    // Protect /profile and all sub-routes
    if (path.startsWith('/profile') && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Optional: Redirect logged-in users away from /login or /signup
    if ((path === '/login' || path === '/signup') && user) {
        const url = request.nextUrl.clone()
        url.pathname = '/profile'
        return NextResponse.redirect(url)
    }

    // 5. Update Session (Important for Server Components)
    return supabaseResponse
}
