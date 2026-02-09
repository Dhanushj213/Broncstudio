import React from 'react';
import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About Us | BroncStudio',
    description: 'Our story, values, and the commitment to premium quality and comfort for kids.',
};

export default function AboutPage() {
    return <AboutClient />;
}
