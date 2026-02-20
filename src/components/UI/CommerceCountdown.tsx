'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommerceCountdownProps {
    targetDate: string;
    onEnd?: () => void;
}

interface TimeLeft {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
}

export default function CommerceCountdown({ targetDate, onEnd }: CommerceCountdownProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: '00', hours: '00', minutes: '00', seconds: '00' });
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                // Set urgency if less than 24 hours
                setIsUrgent(difference < (24 * 60 * 60 * 1000));

                setTimeLeft({
                    days: days.toString().padStart(2, '0'),
                    hours: hours.toString().padStart(2, '0'),
                    minutes: minutes.toString().padStart(2, '0'),
                    seconds: seconds.toString().padStart(2, '0')
                });
            } else {
                setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
                onEnd?.();
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [targetDate, onEnd]);

    return (
        <div className="flex items-start justify-center gap-2 md:gap-3 w-full">
            <CountdownUnit value={timeLeft.days} label="DAYS" isUrgent={isUrgent} />
            <span className={`pt-2 text-xl font-black ${isUrgent ? 'text-red-500 animate-pulse' : 'text-white/20'}`}>:</span>
            <CountdownUnit value={timeLeft.hours} label="HRS" isUrgent={isUrgent} />
            <span className={`pt-2 text-xl font-black ${isUrgent ? 'text-red-500 animate-pulse' : 'text-white/20'}`}>:</span>
            <CountdownUnit value={timeLeft.minutes} label="MIN" isUrgent={isUrgent} />
            <span className={`pt-2 text-xl font-black ${isUrgent ? 'text-red-500 animate-pulse' : 'text-white/20'}`}>:</span>
            <CountdownUnit value={timeLeft.seconds} label="SEC" isUrgent={isUrgent} />
        </div>
    );
}

function CountdownUnit({ value, label, isUrgent }: { value: string; label: string; isUrgent: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2 min-w-[64px]">
            <div className={`relative w-full h-14 bg-white/5 backdrop-blur-xl rounded-[2px] flex items-center justify-center overflow-hidden border transition-all duration-500 ${isUrgent ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-white/10 shadow-black/40 shadow-xl'}`}>
                {/* Refined Luxury Watch Flip Effect */}
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={value}
                        initial={{ y: 20, opacity: 0, rotateX: -90 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: -20, opacity: 0, rotateX: 90 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                        className={`text-2xl md:text-3xl font-black tabular-nums block ${isUrgent ? 'text-red-500 shadow-red-500/50 drop-shadow-lg' : 'text-white'}`}
                    >
                        {value}
                    </motion.span>
                </AnimatePresence>

                {/* Glass Polish Overlay */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-[0.3em] transition-colors ${isUrgent ? 'text-red-500/60' : 'text-white/30'}`}>{label}</span>
        </div>
    );
}
