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
                    <p className="text-lg text-gray-600">
                        We'd love to hear from you! Whether you have a question about shipping, products, or just want to say hi, our team is ready to answer all your questions.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-navy-900 shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900">Email Us</h4>
                                <p className="text-gray-600">broncstudio@gmail.com</p>
                                <p className="text-gray-500 text-sm">We'll respond within 24 hours.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-navy-900 shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900">Call Us</h4>
                                <p className="text-gray-600">+91 98765xxxxx</p>
                                <p className="text-gray-500 text-sm">Mon–Sat, 9am–6pm IST.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-navy-900 shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900">Office</h4>
                                <p className="text-gray-600">
                                    403, Sri Krishna Kruthi CR Pride, Nagashettyhalli, Sanjaynagar main road, Bengaluru - 560094
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-navy-900 mb-6">Send a Message</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-navy-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-navy-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                            <textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-navy-900"></textarea>
                        </div>
                        <button className="w-full bg-navy-900 text-white font-bold py-3 rounded-lg hover:bg-coral-500 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </InfoPage>
    );
}
