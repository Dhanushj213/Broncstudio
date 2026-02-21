'use client';

import { usePathname } from 'next/navigation';

interface ConditionalMainProps {
    children: React.ReactNode;
    hideOnPaths?: string[];
}

export default function ConditionalMain({
    children,
    hideOnPaths = ['/login']
}: ConditionalMainProps) {
    const pathname = usePathname();
    const isHiddenPath = hideOnPaths.some(p => pathname.startsWith(p));

    return (
        <main className={isHiddenPath ? "min-h-screen flex flex-col" : "pb-[calc(64px+env(safe-area-inset-bottom)+20px)] md:pb-0"}>
            {children}
        </main>
    );
}
