import React from 'react';
import type { Metadata } from 'next';
import SizeGuideClient from './SizeGuideClient';

export const metadata: Metadata = {
    title: 'Size Guide | BroncStudio',
    description: 'Find the perfect fit for your little one with our comprehensive size guide. Measurements in CM and Inches.',
};

export default function SizeGuidePage() {
    return <SizeGuideClient />;
}
