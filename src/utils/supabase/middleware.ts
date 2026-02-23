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
    const isStaticAsset = path.match(/\.(?:svg|png|jpg|jpeg|gif|webp|css|js|ico|woff2?|json)$/)
    const isExcludedPage = path === '/construction' || path === '/launch'
    const isAuthRoute = path.startsWith('/auth') || path === '/login' || path.startsWith('/api/auth')
    const isAdminRoute = path.startsWith('/admin')

    // 1. Skip check for static assets
    if (isStaticAsset) {
        return supabaseResponse
    }

    // 2. Fetch Maintenance & Launch Mode Status
    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .single()

    const now = new Date()
    let isBlocked = false
    let redirectPath = ''

    // 3. Maintenance Mode Priority
    if (settings?.maintenance_mode) {
        isBlocked = true
        redirectPath = '/construction'
    }
    // 4. Launch Mode Check
    else if (settings?.launch_mode) {
        const launchDate = settings.launch_datetime ? new Date(settings.launch_datetime) : null

        if (launchDate && now < launchDate) {
            isBlocked = true
            redirectPath = '/launch'
        } else if (settings.auto_disable_launch) {
            // Time reached, auto-disable launch mode
            await supabase
                .from('site_settings')
                .update({ launch_mode: false, updated_at: now.toISOString() })
                .eq('id', settings.id)

            // If we were on /launch, we should now go to home
            if (path === '/launch') {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }
    }

    // 5. Redirection for Excluded Pages (If Mode is OFF but user is still there)
    if (!isBlocked && isExcludedPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 6. Early return for Excluded Pages (If Mode is ON and user is on the right page)
    if (isExcludedPage) {
        return supabaseResponse
    }

    // Check if user is admin
    let isUserAdmin = false
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const ADMIN_EMAILS = [
            'jdhanush213@gmail.com',
            'admin@broncstudio.com',
            'demo@broncstudio.com'
        ]
        isUserAdmin = profile?.role === 'admin' || profile?.role === 'super_admin' || (user.email ? ADMIN_EMAILS.includes(user.email) : false)
    }

    if (isBlocked && !isUserAdmin && !isAuthRoute) {
        // For API requests, return JSON
        if (path.startsWith('/api/')) {
            return NextResponse.json(
                {
                    maintenance: settings?.maintenance_mode,
                    launch: settings?.launch_mode,
                    launch_datetime: settings?.launch_datetime,
                    message: settings?.maintenance_mode ? 'Site is under maintenance' : 'Site is launching soon'
                },
                { status: 503 }
            )
        }

        // Redirect to construction or launch page
        const url = request.nextUrl.clone()
        url.pathname = redirectPath
        return NextResponse.redirect(url)
    }

    // 7. Prevent standard admins from accessing /admin/super
    if (path.startsWith('/admin/super')) {
        let isSuperAdmin = false;
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            isSuperAdmin = profile?.role === 'super_admin' || user.email === 'jdhanush213@gmail.com';
        }

        if (!isSuperAdmin) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    // CRITICAL: Return the supabaseResponse which contains the refreshed session cookies
    return supabaseResponse
}
