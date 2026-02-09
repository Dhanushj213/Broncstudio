import React from 'react';
import type { Metadata } from 'next';
import CuratedClient from './CuratedClient';

export const metadata: Metadata = {
    title: 'Curated Collections | BroncStudio',
    description: 'Handpicked styles for every moment. Explore our themed collections designed with love.',
};

export default function CuratedPage() {
    return <CuratedClient />;
}
