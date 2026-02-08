'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, ChevronDown, ChevronUp, MessageCircle, HelpCircle } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: 'How do I track my order?',
        answer: 'Once your order is shipped, you will receive an email with a tracking link. You can also view your order status anytime by going to My Profile → My Orders and clicking on the specific order.'
    },
    {
        question: 'What is the return policy?',
        answer: 'We offer a 30-day return policy for all unused items in their original packaging. To initiate a return, please contact our support team via email or phone. Return shipping is free for defective items.'
    },
    {
        question: 'Do you ship internationally?',
        answer: 'Currently, we ship within India only. We are working on expanding our shipping to international locations. Sign up for our newsletter to be notified when we launch international shipping.'
    },
    {
        question: 'How can I change my shipping address?',
        answer: 'You can update your shipping address during checkout before placing an order. If you need to change the address for an already placed order, please contact us immediately at support@broncstudio.com.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI payments, Net Banking, and Cash on Delivery (COD) for select locations.'
    },
    {
        question: 'How long does delivery take?',
        answer: 'Standard delivery takes 5-7 business days. Express delivery (available in select cities) takes 2-3 business days. You will see the estimated delivery date at checkout.'
    }
];

export default function SupportPage() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <main className="bg-[#FAF9F7] dark:bg-black min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[800px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="p-2 rounded-full bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors shadow-sm">
                        <ArrowLeft size={20} className="text-navy-900 dark:text-white" />
                    </Link>
                    <h1 className="text-2xl font-bold text-navy-900 dark:text-white font-heading">Help & Support</h1>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <a
                        href="mailto:support@broncstudio.com"
                        className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4 group"
                    >
                        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Mail size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-navy-900 dark:text-white">Email Support</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">support@broncstudio.com</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Response within 24 hours</p>
                        </div>
                    </a>

                    <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4 group"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MessageCircle size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-navy-900 dark:text-white">WhatsApp</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Chat with us</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Mon-Sat, 9am - 7pm</p>
                        </div>
                    </a>
                </div>

                {/* FAQ Section */}
                <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <HelpCircle className="text-navy-900 dark:text-white" size={24} />
                        <h3 className="font-bold text-navy-900 dark:text-white text-lg">Frequently Asked Questions</h3>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`border rounded-xl transition-all ${expandedIndex === index
                                    ? 'border-navy-900 dark:border-white bg-navy-50/30 dark:bg-white/5'
                                    : 'border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex justify-between items-center p-4 text-left"
                                >
                                    <span className={`text-sm font-bold ${expandedIndex === index ? 'text-navy-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                        {faq.question}
                                    </span>
                                    {expandedIndex === index ? (
                                        <ChevronUp size={18} className="text-navy-900 dark:text-white flex-shrink-0" />
                                    ) : (
                                        <ChevronDown size={18} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                    )}
                                </button>

                                {expandedIndex === index && (
                                    <div className="px-4 pb-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Still need help? */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Still need help?{' '}
                        <a
                            href="mailto:support@broncstudio.com"
                            className="text-coral-500 font-bold hover:underline"
                        >
                            Contact us directly
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
