'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    BarChart3,
    Settings,
    Menu,
    X,
    LogOut,
    Truck,
    CreditCard,
    Layers
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

const SIDEBAR_ITEMS = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Inventory', href: '/admin/inventory', icon: Layers },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Shipping', href: '/admin/shipping', icon: Truck },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [verifying, setVerifying] = useState(true);

    React.useEffect(() => {
        const checkAccess = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            // Simple Admin Check
            // Ideally this is RLS/Backend, but for Client Logic:
            const ADMIN_EMAILS = [
                'dhanushj213@gmail.com', 'admin@broncstudio.com', 'demo@broncstudio.com'
            ];

            if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
                // Not authorized
                router.push('/');
                return;
            }

            setVerifying(false);
        };

        checkAccess();
    }, [router]);

    const handleSignOut = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (verifying) {
        return <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center font-bold text-gray-500">Verifying Access...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0B1220] text-white transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-coral-500 rounded-lg flex items-center justify-center font-bold text-white">
                            B
                        </div>
                        <span className="text-xl font-bold tracking-tight">BroncAdmin</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="px-4 py-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Main Menu</p>
                    <nav className="space-y-1">
                        {SIDEBAR_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-coral-500 text-white font-bold shadow-lg shadow-coral-500/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'}
                                    `}
                                >
                                    <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2.5 w-full text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="bg-white border-b border-gray-200 p-4 lg:hidden flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-gray-900">Dashboard</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                        {/* Avatar Placeholder */}
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
