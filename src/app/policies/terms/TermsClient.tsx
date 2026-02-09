'use client';

import React from 'react';
import InfoPage from '@/components/Layout/InfoPage';

export default function TermsClient() {
    return (
        <InfoPage title="Terms & Conditions" category="Policies">
            <div className="space-y-6 text-secondary text-sm leading-relaxed">
                <p><strong>Welcome to Broncstudio!</strong></p>
                <p>By accessing or using our website, you agree to be bound by these Terms & Conditions.</p>

                <h3 className="text-lg font-bold text-primary mt-6">1. General</h3>
                <p>These terms apply to all visitors, users, and others who access the Service. If you disagree with any part of the terms, you may not access the Service.</p>

                <h3 className="text-lg font-bold text-primary mt-6">2. Products & Pricing</h3>
                <p>We strive to ensure all product details and prices are accurate. However, errors may occur. We reserve the right to correct any errors and to change or update information at any time without prior notice.</p>

                <h3 className="text-lg font-bold text-primary mt-6">3. Accounts</h3>
                <p>When you create an account with us, you must provide information that is accurate, complete, and current. Failure to do so constitutes a breach of the Terms.</p>

                <h3 className="text-lg font-bold text-primary mt-6">4. Intellectual Property</h3>
                <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Broncstudio and its licensors.</p>

                <h3 className="text-lg font-bold text-primary mt-6">5. Governing Law</h3>
                <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
            </div>
        </InfoPage>
    );
}
