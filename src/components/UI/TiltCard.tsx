'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming standard shadcn-like utils or I will replicate localized clsx

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    // Motion values for rotation
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics
    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;

        const xPct = mouseXPos / width - 0.5;
        const yPct = mouseYPos / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={cn("relative transition-all duration-200 ease-out", className)}
        >
            <div
                style={{ transform: "translateZ(20px)" }}
                className="h-full w-full"
            >
                {children}
            </div>

            {/* Glare Effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none mix-blend-overlay z-50 rounded-xl bg-gradient-to-tr from-transparent via-white to-transparent opacity-0"
                style={{
                    opacity: useTransform(mouseY, [-0.5, 0.5], [0, 0.3])
                }}
            />
        </motion.div>
    );
};

export default TiltCard;

// Utils helper if not exists
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}
