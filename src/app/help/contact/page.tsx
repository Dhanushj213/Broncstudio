'use client';

import React from 'react';
import InfoPage from '@/components/Layout/InfoPage';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    return (
        <InfoPage title="Contact Us">
            <div className="grid md:grid-cols-2 gap-12">

                {/* Contact Info */}
                <div className="space-y-8">
                    <p className="text-lg text-secondary">
                        We'd love to hear from you! Whether you have a question about shipping, products, or just want to say hi, our team is ready to answer all your questions.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-primary shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary">Email Us</h4>
                                <p className="text-secondary">broncstudio@gmail.com</p>
                                <p className="text-secondary text-sm">We'll respond within 24 hours.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-primary shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary">Call Us</h4>
                                <p className="text-secondary">+91 98765xxxxx</p>
                                <p className="text-secondary text-sm">Mon–Sat, 9am–6pm IST.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-primary shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary">Office</h4>
                                <p className="text-secondary">
                                    403, Sri Krishna Kruthi CR Pride, Nagashettyhalli, Sanjaynagar main road, Bengaluru - 560094
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-card p-8 rounded-2xl shadow-lg border border-subtle">
                    <h3 className="text-xl font-bold text-primary mb-6">Send a Message</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-primary mb-1">Name</label>
                            <input type="text" className="w-full px-4 py-2 rounded-lg border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary placeholder:text-gray-400 dark:placeholder:text-gray-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-primary mb-1">Email</label>
                            <input type="email" className="w-full px-4 py-2 rounded-lg border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-primary mb-1">Message</label>
                            <textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary"></textarea>
                        </div>
                        <button className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-lg hover:bg-coral-500 dark:hover:bg-coral-400 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </InfoPage>
    );
}
