import React from 'react';
import type { Metadata } from 'next';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
    title: 'My Profile | BroncStudio',
    description: 'Manage your profile, orders, and addresses.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function ProfilePage() {
    return <ProfileClient />;
}
