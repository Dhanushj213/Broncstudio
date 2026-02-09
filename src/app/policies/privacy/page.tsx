import React from 'react';
import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
    title: 'Privacy Policy | BroncStudio',
    description: 'Learn how BroncStudio collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
    return <PrivacyClient />;
}
