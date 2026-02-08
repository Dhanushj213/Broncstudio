'use client';

import React, { useState } from 'react';
import InfoPage from '@/components/Layout/InfoPage';
import { Ruler, CheckCircle } from 'lucide-react';

const SIZES = {
    baby: [
        { label: '0-3M', height: '55-61 cm', weight: '4-6 kg' },
        { label: '3-6M', height: '61-67 cm', weight: '6-8 kg' },
        { label: '6-12M', height: '67-78 cm', weight: '8-10 kg' },
    ],
    toddler: [
        { label: '12-18M', height: '78-83 cm', weight: '10-12 kg' },
        { label: '18-24M', height: '83-86 cm', weight: '12-13 kg' },
        { label: '2-3Y', height: '86-98 cm', weight: '13-15 kg' },
    ],
    kid: [
        { label: '3-4Y', height: '98-104 cm', weight: '15-17 kg' },
        { label: '4-5Y', height: '104-110 cm', weight: '17-19 kg' },
        { label: '5-6Y', height: '110-116 cm', weight: '19-21 kg' },
    ]
};

export default function SizeGuidePage() {
    const [activeTab, setActiveTab] = useState<'baby' | 'toddler' | 'kid'>('toddler');

    return (
        <InfoPage title="Size Guide">
            <div className="max-w-3xl mx-auto">
                <p className="text-gray-600 text-lg text-center mb-12">
                    Kids grow fast! Use our guide to find the perfect fit. <br />
                    When in doubt, we recommend sizing up for longer wear.
                </p>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-gray-100 p-1 rounded-full inline-flex">
                        {(['baby', 'toddler', 'kid'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === tab
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-gray-500 hover:text-navy-900'
                                    } capitalize`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-12 shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-navy-50">
                            <tr>
                                <th className="p-6 font-bold text-navy-900">Size Label</th>
                                <th className="p-6 font-bold text-navy-900">Child's Height</th>
                                <th className="p-6 font-bold text-navy-900">Weight (Approx)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {SIZES[activeTab].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50">
                                    <td className="p-6 font-bold text-navy-900">{row.label}</td>
                                    <td className="p-6 text-gray-600">{row.height}</td>
                                    <td className="p-6 text-gray-600">{row.weight}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* How to Measure */}
                <div className="bg-blue-50/50 rounded-3xl p-8 flex items-start gap-6 border border-blue-50">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                        <Ruler size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-navy-900 mb-4">How to Measure</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-gray-600">
                                <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                                <span><strong>Height:</strong> Measure from the top of the head to the ground (without shoes).</span>
                            </li>
                            <li className="flex gap-3 text-gray-600">
                                <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                                <span><strong>Chest:</strong> Measure under the arms at the fullest part of the chest.</span>
                            </li>
                            <li className="flex gap-3 text-gray-600">
                                <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                                <span><strong>Waist:</strong> Measure around the natural waistline.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </InfoPage>
    );
}
