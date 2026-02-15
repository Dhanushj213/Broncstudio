'use client';

import React, { useEffect, useState } from 'react';
import InfoPage from '@/components/Layout/InfoPage';
import { Mail, Phone, MapPin } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function ContactClient() {
    const [contactInfo, setContactInfo] = useState({
        gmail: 'broncstudio@gmail.com',
        phone: '+91 98765xxxxx',
        secondaryPhone: '',
        address: ''
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchContactInfo = async () => {
            const { data } = await supabase
                .from('content_blocks')
                .select('content')
                .eq('section_id', 'global_social_links')
                .single();

            if (data?.content) {
                setContactInfo(prev => ({
                    ...prev,
                    gmail: data.content.gmail || prev.gmail,
                    phone: data.content.phone || prev.phone,
                    secondaryPhone: data.content.secondaryPhone || '',
                    address: data.content.address || prev.address
                }));
            }
        };
        fetchContactInfo();
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitStatus('idle');

        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    created_at: new Date().toISOString()
                }]);

            if (error) {
                console.error('Error submitting message:', error);
                setSubmitStatus('error');
            } else {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setSubmitStatus('idle'), 5000);
            }
        } catch (err) {
            console.error('Exception submitting message:', err);
            setSubmitStatus('error');
        } finally {
            setSubmitting(false);
        }
    };

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
                                <a href={`mailto:${contactInfo.gmail}`} className="text-secondary hover:text-primary transition-colors">{contactInfo.gmail}</a>
                                <p className="text-secondary text-sm">We'll respond within 24 hours.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-primary shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary">Call Us</h4>
                                <a href={`tel:${contactInfo.phone}`} className="text-secondary hover:text-primary transition-colors block">{contactInfo.phone}</a>
                                {contactInfo.secondaryPhone && (
                                    <a href={`tel:${contactInfo.secondaryPhone}`} className="text-secondary hover:text-primary transition-colors block">{contactInfo.secondaryPhone}</a>
                                )}
                                <p className="text-secondary text-sm">Mon–Sat, 9am–6pm IST.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-primary shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary">Office</h4>
                                <p className="text-secondary whitespace-pre-line">
                                    {contactInfo.address}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-card p-8 rounded-2xl shadow-lg border border-subtle">
                    <h3 className="text-xl font-bold text-primary mb-6">Send a Message</h3>
                    {submitStatus === 'success' ? (
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                                <Mail size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold">Message Sent!</h4>
                                <p className="text-sm">Thank you for contacting us. We will get back to you shortly.</p>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-bold text-primary mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-primary mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-primary mb-1">Message</label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-subtle bg-surface-2 text-primary focus:outline-none focus:border-primary"
                                ></textarea>
                            </div>
                            {submitStatus === 'error' && (
                                <p className="text-red-500 text-sm">Failed to send message. Please try again.</p>
                            )}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-lg hover:bg-coral-500 dark:hover:bg-coral-400 transition-colors disabled:opacity-50 disabled:cursor-wait"
                            >
                                {submitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </InfoPage>
    );
}
