'use client';

import React from 'react';
import InfoPage from '@/components/Layout/InfoPage';

export default function PrivacyClient() {
    return (
        <InfoPage title="Privacy Policy" category="Policies">
            <div className="space-y-6 text-secondary text-sm leading-relaxed">
                <p><strong>Last Updated: January 2026</strong></p>

                <p>Brancstudio ("we", "our", "us") values your trust and is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information.</p>

                <h3 className="text-lg font-bold text-primary mt-6">1. Information We Collect</h3>
                <ul className="list-disc pl-5">
                    <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address, and payment details collected during checkout.</li>
                    <li><strong>Usage Data:</strong> Information about your device, browser, and how you interact with our website (via cookies).</li>
                </ul>

                <h3 className="text-lg font-bold text-primary mt-6">2. How We Use Your Information</h3>
                <ul className="list-disc pl-5">
                    <li>To process and fulfill your orders.</li>
                    <li>To send order updates and shipping notifications.</li>
                    <li>To improve our website functionality and user experience.</li>
                    <li>To send marketing communications (if you have opted in).</li>
                </ul>

                <h3 className="text-lg font-bold text-primary mt-6">3. Data Security</h3>
                <p>We implement industry-standard security measures, including SSL encryption, to protect your data during transmission and storage. We do not sell your personal data to third parties.</p>

                <h3 className="text-lg font-bold text-primary mt-6">4. Contact Us</h3>
                <p>If you have any questions regarding this policy, please contact us at privacy@broncstudio.com.</p>
            </div>
        </InfoPage>
    );
}
