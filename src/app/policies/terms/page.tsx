import React from 'react';
import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
    title: 'Terms of Service | BroncStudio',
    description: 'Read our Terms of Service to understand the rules and regulations for using our website.',
};

export default function TermsPage() {
    return <TermsClient />;
}
