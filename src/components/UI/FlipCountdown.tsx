'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlipCountdownProps {
    targetDate: string;
    onEnd?: () => void;
}

interface TimeLeft {
    hours: string;
    minutes: string;
    seconds: string;
}

export default function FlipCountdown({ targetDate, onEnd }: FlipCountdownProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: '00', minutes: '00', seconds: '00' });
    const [isLowTime, setIsLowTime] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                const hours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft({
                    hours: hours.toString().padStart(2, '0'),
                    minutes: minutes.toString().padStart(2, '0'),
                    seconds: seconds.toString().padStart(2, '0')
                });

                // Urgency check: less than 10 minutes
                if (hours === 0 && minutes < 10) {
                    setIsLowTime(true);
                } else {
                    setIsLowTime(false);
                }
            } else {
                setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
                onEnd?.();
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [targetDate, onEnd]);

    return (
        <div className="flex items-center gap-4">
            <FlipUnit value={timeLeft.hours} label="HRS" isLowTime={isLowTime} />
            <span className="text-2xl font-bold text-white/30 pb-6">:</span>
            <FlipUnit value={timeLeft.minutes} label="MIN" isLowTime={isLowTime} />
            <span className="text-2xl font-bold text-white/30 pb-6">:</span>
            <FlipUnit value={timeLeft.seconds} label="SEC" isLowTime={isLowTime} isSeconds />
        </div>
    );
}

function FlipUnit({ value, label, isLowTime, isSeconds }: { value: string; label: string; isLowTime: boolean; isSeconds?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-16 h-20 md:w-20 md:h-24 bg-[#1A1A1A] rounded-xl overflow-hidden shadow-2xl border border-white/5">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={value}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                        }}
                        className={`absolute inset-0 flex items-center justify-center text-3xl md:text-5xl font-black tracking-tighter ${isLowTime ? 'text-red-500' : 'text-white'
                            }`}
                    >
                        {value}
                        {isSeconds && (
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute inset-0 bg-white/5 blur-xl pointer-events-none"
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Horizontal Divider Line */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20 z-10" />
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">{label}</span>
        </div>
    );
}
