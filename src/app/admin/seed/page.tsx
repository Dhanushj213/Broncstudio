'use client';

import React, { useState } from 'react';
import { seedCategories } from '@/actions/seedCategories';

export default function SeedPage() {
    const [status, setStatus] = useState('Idle');

    const handleSeed = async () => {
        setStatus('Seeding...');
        try {
            const res = await seedCategories();
            if (res.success) {
                setStatus('Success: ' + res.message);
            } else {
                setStatus('Error: ' + res.error);
            }
        } catch (e: any) {
            setStatus('Error: ' + e.message);
        }
    };

    return (
        <div className="p-20 text-center">
            <h1 className="text-2xl font-bold mb-4">Admin: Seed Categories</h1>
            <p className="mb-8 text-gray-500">Migrates src/data/categories.ts to Supabase Database.</p>

            <button
                onClick={handleSeed}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold"
            >
                Run Seed
            </button>

            <div className="mt-8 p-4 bg-gray-100 rounded">
                Status: <strong>{status}</strong>
            </div>
        </div>
    );
}
