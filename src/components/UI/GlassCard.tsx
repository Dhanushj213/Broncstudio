'use client';

import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import TiltCard from './TiltCard';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    disableTilt?: boolean;
}

export default function GlassCard({
    children,
    className = "",
    glowColor = "rgba(255, 255, 255, 0.1)", // Subtler glow
    disableTilt = false
}: GlassCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const cardRef = useRef<HTMLDivElement>(null);

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    // Spec: Radius 24px, Opacity 0.72, Blur 18px, Border 1px rgba(255,255,255,0.12)
    // Hover: Translate Y -6px, Scale 1.02, Transition 220ms

    const cardStyles = `
    group relative 
    bg-white/72 dark:bg-white/[0.03]
    backdrop-blur-[18px] 
    border border-white/12 dark:border-white/10
    shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)]
    rounded-[24px]
    overflow-hidden
    hover:-translate-y-[6px] hover:scale-[1.02] dark:hover:border-white/30 dark:hover:bg-white/[0.06]
    transition-all duration-[400ms] ease-premium
    ${className}
  `;

    const Content = (
        <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            className={cardStyles}
        >
            {/* Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-[500ms]"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${glowColor},
              transparent 80%
            )
          `,
                }}
            />

            {/* Content Layer */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );

    // If tilt is strictly disabled globally or for specific cards
    if (disableTilt) {
        return Content;
    }

    // Wrapping in TiltCard enables the 3D tilt. 
    // Note: The spec asks for "Hover interaction: Translate Y -6px, Scale 1.02". 
    // If Tilt conflicts with this strict transform, we might disable Tilt for the homepage bento.
    // For now, I will keep Tilt but ensure the inner card handles the glass styling.
    return (
        <TiltCard className="h-full w-full">
            {Content}
        </TiltCard>
    );
}
