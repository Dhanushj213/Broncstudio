'use client';

import React from 'react';
import InfoPage from '@/components/Layout/InfoPage';

export default function FAQPage() {
    return (
        <InfoPage title="Frequently Asked Questions">
            <div className="space-y-12">
                <section>
                    <h3 className="text-xl font-bold text-primary mb-4">Ordering & Payments</h3>
                    <div className="space-y-6">
                        <div className="bg-surface-2/50 border border-subtle rounded-xl p-6">
                            <h4 className="font-bold text-primary mb-2">What payment methods do you accept?</h4>
                            <p className="text-secondary">We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI, Net Banking, and Wallet payments. Cash on Delivery (COD) is available for select pin codes.</p>
                        </div>
                        <div className="bg-surface-2/50 border border-subtle rounded-xl p-6">
                            <h4 className="font-bold text-primary mb-2">Can I cancel my order?</h4>
                            <p className="text-secondary">Yes, you can cancel your order within 24 hours of placing it or before it has been shipped, whichever is earlier. Please visit your Order History to request a cancellation.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-primary mb-4">Shipping & Delivery</h3>
                    <div className="space-y-6">
                        <div className="bg-surface-2/50 border border-subtle rounded-xl p-6">
                            <h4 className="font-bold text-primary mb-2">How long does shipping take?</h4>
                            <p className="text-secondary">Standard shipping typically takes 5–7 business days. Priority shipping options are available at checkout for faster delivery in 2–3 business days.</p>
                        </div>
                        <div className="bg-surface-2/50 border border-subtle rounded-xl p-6">
                            <h4 className="font-bold text-primary mb-2">Do you ship internationally?</h4>
                            <p className="text-secondary">Currently, we treat India as our home. International shipping is coming soon! Sign up for our newsletter to be the first to know.</p>
                        </div>
                    </div>
                </section>
            </div>
        </InfoPage>
    );
}
