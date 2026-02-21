'use client';

import { usePathname } from 'next/navigation';

interface NavVisibilityWrapperProps {
    children: React.ReactNode;
    hideOnPaths?: string[];
}

export default function NavVisibilityWrapper({
    children,
    hideOnPaths = ['/login']
}: NavVisibilityWrapperProps) {
    const pathname = usePathname();
    const shouldHide = hideOnPaths.some(p => pathname.startsWith(p));

    if (shouldHide) return null;

    return <>{children}</>;
}
