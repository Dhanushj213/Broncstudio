'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface MagneticButtonProps {
    children: React.ReactNode;
    strength?: number;
    radius?: number;
    className?: string;
}

export default function MagneticButton({
    children,
    strength = 50,
    radius = 150,
    className = "",
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Spring physics configuration for smooth, organic movement (Inertia)
    const springConfig = {
        stiffness: 150,
        damping: 15,
        mass: 0.1,
    };

    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        // Calculate center of the button
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Distance from mouse to center
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Magnetic Pull Logic: Only move if within radius
        if (distance < radius) {
            // Factor how much to move based on distance (stronger when closer)
            const power = (radius - distance) / radius;
            x.set(deltaX * power * (strength / 100));
            y.set(deltaY * power * (strength / 100));
        } else {
            x.set(0);
            y.set(0);
        }
    }, [radius, strength, x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x, y }}
            className={`relative ${className}`}
        >
            {children}
        </motion.div>
    );
}
