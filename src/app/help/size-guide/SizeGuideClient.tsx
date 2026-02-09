'use client';

import React, { useState } from 'react';
import InfoPage from '@/components/Layout/InfoPage';
import { Ruler, CheckCircle, ArrowRight, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Unit = 'cm' | 'in';
type Category = 'baby' | 'toddler' | 'kid';

const SIZES = {
    baby: [
        { label: '0-3M', heightCm: '55-61', weightKg: '4-6', heightIn: '21.5-24', weightLb: '8-13' },
        { label: '3-6M', heightCm: '61-67', weightKg: '6-8', heightIn: '24-26.5', weightLb: '13-17.5' },
        { label: '6-12M', heightCm: '67-78', weightKg: '8-10', heightIn: '26.5-30.5', weightLb: '17.5-22' },
    ],
    toddler: [
        { label: '12-18M', heightCm: '78-83', weightKg: '10-12', heightIn: '30.5-32.5', weightLb: '22-26.5' },
        { label: '18-24M', heightCm: '83-86', weightKg: '12-13', heightIn: '32.5-34', weightLb: '26.5-28.5' },
        { label: '2-3Y', heightCm: '86-98', weightKg: '13-15', heightIn: '34-38.5', weightLb: '28.5-33' },
    ],
    kid: [
        { label: '3-4Y', heightCm: '98-104', weightKg: '15-17', heightIn: '38.5-41', weightLb: '33-37.5' },
        { label: '4-5Y', heightCm: '104-110', weightKg: '17-19', heightIn: '41-43.5', weightLb: '37.5-42' },
        { label: '5-6Y', heightCm: '110-116', weightKg: '19-21', heightIn: '43.5-45.5', weightLb: '42-46' },
        { label: '6-7Y', heightCm: '116-122', weightKg: '21-23', heightIn: '45.5-48', weightLb: '46-50.5' },
    ]
};

export default function SizeGuidePage() {
    const [activeTab, setActiveTab] = useState<Category>('toddler');
    const [unit, setUnit] = useState<Unit>('cm');

    return (
        <InfoPage title="Size Guide">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Kids grow fast! Use our guide to find the perfect fit. <br className="hidden md:block" />
                        When in doubt, we recommend <span className="text-navy-900 dark:text-white font-bold">sizing up</span> for longer wear.
                    </p>
                </div>

                {/* Controls Container */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">

                    {/* Category Tabs */}
                    <div className="bg-gray-100/80 dark:bg-white/10 p-1.5 rounded-xl flex">
                        {(['baby', 'toddler', 'kid'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all relative ${activeTab === tab
                                    ? 'text-navy-900 dark:text-white'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-navy-700 dark:hover:text-gray-200'
                                    } capitalize`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white dark:bg-white/10 rounded-lg shadow-sm"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{tab}</span>
                            </button>
                        ))}
                    </div>

                    {/* Unit Toggle */}
                    <div className="flex items-center gap-3 bg-gray-100/80 dark:bg-white/10 p-1.5 rounded-xl">
                        <button
                            onClick={() => setUnit('cm')}
                            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${unit === 'cm'
                                ? 'bg-white dark:bg-white/10 text-navy-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-navy-700 dark:hover:text-gray-200'
                                }`}
                        >
                            CM / KG
                        </button>
                        <button
                            onClick={() => setUnit('in')}
                            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${unit === 'in'
                                ? 'bg-white dark:bg-white/10 text-navy-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-navy-700 dark:hover:text-gray-200'
                                }`}
                        >
                            IN / LB
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden mb-12 shadow-lg shadow-gray-100/50 dark:shadow-none">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-navy-900 dark:bg-white/10 text-white">
                                    <th className="p-6 font-bold tracking-wide uppercase text-xs">Size Label</th>
                                    <th className="p-6 font-bold tracking-wide uppercase text-xs">Child's Height ({unit === 'cm' ? 'cm' : 'in'})</th>
                                    <th className="p-6 font-bold tracking-wide uppercase text-xs">Weight (Approx)</th>
                                    <th className="p-6 font-bold tracking-wide uppercase text-xs text-right">Age Group</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                <AnimatePresence mode='wait'>
                                    {SIZES[activeTab].map((row, i) => (
                                        <motion.tr
                                            key={row.label}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group hover:bg-blue-50/30 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <td className="p-6 font-heading font-bold text-navy-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {row.label}
                                            </td>
                                            <td className="p-6 text-gray-600 dark:text-gray-300 font-medium">
                                                {unit === 'cm' ? row.heightCm : row.heightIn}
                                                <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">{unit}</span>
                                            </td>
                                            <td className="p-6 text-gray-600 dark:text-gray-300 font-medium">
                                                {unit === 'cm' ? row.weightKg : row.weightLb}
                                                <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">{unit === 'cm' ? 'kg' : 'lbs'}</span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                                                    {activeTab}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* How to Measure Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl p-8 border border-blue-50 dark:border-blue-900/20 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 rotate-3">
                                <Ruler size={24} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">How to Measure</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">For the most accurate fit, we recommend measuring your child wearing lightweight clothing.</p>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                    <CheckCircle size={20} className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-navy-900 dark:text-white">Height</strong>
                                        <span className="text-sm">Stand straight against a wall without shoes. Measure from top of head to floor.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                    <CheckCircle size={20} className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-navy-900 dark:text-white">Chest</strong>
                                        <span className="text-sm">Measure under arms at the fullest part of the chest.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                    <CheckCircle size={20} className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-navy-900 dark:text-white">Waist</strong>
                                        <span className="text-sm">Measure around the natural waistline, keeping tape loose.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-3xl p-8 border border-amber-50 dark:border-amber-900/20 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 -rotate-3">
                                <Calculator size={24} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Fit Tips</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Every child grows at their own pace. Here are some tips to help you choose.</p>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                    <ArrowRight size={20} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-navy-900 dark:text-white">In Between Sizes?</strong>
                                        <span className="text-sm">We always recommend sizing up. It's better to have a little room to grow!</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                    <ArrowRight size={20} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-navy-900 dark:text-white">Cotton Shrinkage</strong>
                                        <span className="text-sm">Our 100% organic cotton may shrink up to 5% after the first wash.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                    <ArrowRight size={20} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-navy-900 dark:text-white">Relaxed Fits</strong>
                                        <span className="text-sm">Most of our styles are designed for a relaxed, comfortable fit for play.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </InfoPage>
    );
}
