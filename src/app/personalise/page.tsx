import React from 'react';
import type { Metadata } from 'next';
import PersonaliseClient from './PersonaliseClient';

export const metadata: Metadata = {
    title: 'Personalise Your Style | BroncStudio',
    description: 'Create unique looks with our customization options. Add a personal touch to your favorite pieces.',
};

export default function PersonalisePage() {
    return <PersonaliseClient />;
}
