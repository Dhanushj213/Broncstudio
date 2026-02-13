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
    const shouldHide = hideOnPaths.includes(pathname);

    if (shouldHide) return null;

    return <>{children}</>;
}
