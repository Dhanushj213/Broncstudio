import React from 'react';
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
    title: 'BroncStudio | Premium Apparel, Tech & Home Essentials',
    description: 'Explore our wide range of premium products including apparel, tech accessories, and home decor. Designed for style, crafted for you.',
    openGraph: {
        title: 'BroncStudio | Premium Apparel, Tech & Home Essentials',
        description: 'Shop premium apparel for men, women, and kids, plus unique tech accessories, home decor, and gifts. Elevate your everyday style.',
        images: ['/og-image.jpg'],
    }
};

export default function HomePage() {
    return <HomeClient />;
}
