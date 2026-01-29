'use client';

import { usePathname } from 'next/navigation';

export default function FooterWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hiddenRoutes = ['/login', '/signup', '/signin']; // Added variants just in case

    if (hiddenRoutes.includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}
