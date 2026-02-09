import React from 'react';
import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: 'Contact Us | BroncStudio',
    description: 'Get in touch with the BroncStudio team for any questions, support, or feedback. We are here to help!',
};

export default function ContactPage() {
    return <ContactClient />;
}
