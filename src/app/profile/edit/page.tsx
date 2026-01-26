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
            setPhone(user.user_metadata?.phone || '');
            setLoading(false);
        };

        fetchUserData();
    }, [supabase, router]);

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
        <main className="bg-[#FAF9F7] min-h-screen py-8 pb-24 md:pb-12">
            <div className="max-w-[600px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm">
                        <ArrowLeft size={20} className="text-navy-900" />
                    </Link>
                    <h1 className="text-2xl font-bold text-navy-900 font-heading">Edit Profile</h1>
                </div>

                <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2 text-sm">
                            <CheckCircle size={16} />
                            Profile updated successfully!
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-navy-900 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-navy-900 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed here</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-navy-900 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving || success}
                        className="w-full bg-navy-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-coral-500 transition-colors mt-4 disabled:opacity-70"
                    >
                        {saving ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : success ? (
                            <><CheckCircle size={18} /> Saved!</>
                        ) : (
                            <><Save size={18} /> Save Changes</>
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}
