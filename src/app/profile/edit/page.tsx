'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function EditProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [loadingOtp, setLoadingOtp] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            // Set form values from user data
            setEmail(user.email || '');
            setFullName(user.user_metadata?.full_name || '');
            // Prioritize authenticated phone, fallback to metadata
            setPhone(user.phone || user.user_metadata?.phone || '');
            setLoading(false);
        };

        fetchUserData();
    }, [supabase, router]);

    const handleSendOtp = async () => {
        setLoadingOtp(true);
        setError(null);
        try {
            const { error: otpError } = await supabase.auth.updateUser({
                phone: `+91${phone}`
            });

            if (otpError) throw otpError;

            setOtpSent(true);
            setShowOtpInput(true);
            alert('OTP sent to your phone number');
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoadingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoadingOtp(true);
        setError(null);
        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                phone: `+91${phone}`,
                token: otp,
                type: 'phone_change'
            });

            if (verifyError) throw verifyError;

            setSuccess(true);
            setShowOtpInput(false);
            setOtpSent(false);
            alert('Phone number verified successfully!');
        } catch (err: any) {
            setError(err.message || 'Invalid OTP');
        } finally {
            setLoadingOtp(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            // Update user metadata in Supabase Auth
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    phone: phone
                }
            });

            if (updateError) throw updateError;

            setSuccess(true);

            // Redirect after a short delay to show success
            setTimeout(() => {
                router.push('/profile');
                router.refresh();
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="bg-[#FAF9F7] min-h-screen py-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-navy-900" size={32} />
            </main>
        );
    }

    return (
        <main className="bg-[#FAF9F7] dark:bg-black min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[600px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="p-2 rounded-full bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors shadow-sm">
                        <ArrowLeft size={20} className="text-navy-900 dark:text-white" />
                    </Link>
                    <h1 className="text-2xl font-bold text-navy-900 dark:text-white font-heading">Edit Profile</h1>
                </div>

                <form onSubmit={handleSave} className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                            <CheckCircle size={16} />
                            Profile updated successfully!
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-bold text-navy-900 dark:text-white mb-1">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-navy-900 dark:text-white focus:border-navy-900 dark:focus:border-white focus:ring-0 outline-none transition-colors"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-navy-900 dark:text-white mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Email cannot be changed here</p>
                    </div>

                    {/* Phone Number with OTP */}
                    <div>
                        <label className="block text-sm font-bold text-navy-900 dark:text-white mb-1">Phone Number</label>
                        <div className="flex gap-2">
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setPhone(val);
                                }}
                                placeholder="9876543210"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-navy-900 dark:text-white focus:border-navy-900 dark:focus:border-white focus:ring-0 outline-none transition-colors"
                            />
                            {showOtpInput ? (
                                <button
                                    type="button"
                                    onClick={() => setShowOtpInput(false)}
                                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-navy-900"
                                >
                                    Cancel
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={loadingOtp || phone.length !== 10}
                                    className="px-4 py-2 bg-navy-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold disabled:opacity-50 whitespace-nowrap"
                                >
                                    {loadingOtp ? <Loader2 className="animate-spin" size={16} /> : 'Verify'}
                                </button>
                            )}
                        </div>
                        {otpSent && <p className="text-xs text-green-600 mt-1">OTP sent to +91 {phone}</p>}
                    </div>

                    {/* OTP Input */}
                    {showOtpInput && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-bold text-navy-900 dark:text-white mb-1">Enter OTP</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-navy-900 dark:text-white focus:border-navy-900 dark:focus:border-white focus:ring-0 outline-none transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={loadingOtp || otp.length !== 6}
                                    className="px-6 py-2 bg-coral-500 text-white rounded-xl text-sm font-bold disabled:opacity-50"
                                >
                                    {loadingOtp ? <Loader2 className="animate-spin" size={16} /> : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving || success}
                        className="w-full bg-navy-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-coral-500 dark:hover:bg-gray-200 transition-colors mt-8 disabled:opacity-70"
                    >
                        {saving ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : success ? (
                            <><CheckCircle size={18} /> Saved!</>
                        ) : (
                            <><Save size={18} /> Save Profile</>
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}
