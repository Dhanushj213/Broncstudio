'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Key, Smartphone, ChevronRight, Eye, EyeOff, Check, AlertCircle, Loader2, QrCode, Trash2 } from 'lucide-react';
import { updatePassword, enrollMFA, verifyMFA, unenrollMFA, getMFAFactors, getActiveSessions } from '@/actions/securityActions';
import { useToast } from '@/context/ToastContext';
import QRCode from 'react-qr-code';

export default function SecurityPage() {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    // Password State
    const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPw, setShowPw] = useState(false);

    // MFA State
    const [mfaFactors, setMfaFactors] = useState<any[]>([]);
    const [showMFAEnroll, setShowMFAEnroll] = useState(false);
    const [qrCodeData, setQrCodeData] = useState<{ id: string, qr: string, secret: string } | null>(null);
    const [verifyCode, setVerifyCode] = useState('');

    // Session State
    const [sessions, setSessions] = useState<any[]>([]);

    useEffect(() => {
        fetchSecurityData();
    }, []);

    const fetchSecurityData = async () => {
        const factorRes = await getMFAFactors();
        if (factorRes.success) setMfaFactors(factorRes.factors || []);

        const sessionRes = await getActiveSessions();
        if (sessionRes.success) setSessions(sessionRes.sessions || []);
    };

    // --- Password Handlers ---
    const handleUpdatePassword = async () => {
        if (!newPassword) return addToast('Please enter a new password', 'error');
        if (newPassword.length < 6) return addToast('Password must be at least 6 characters', 'error');
        if (newPassword !== confirmPassword) return addToast('Passwords do not match', 'error');

        setLoading(true);
        const res = await updatePassword(newPassword);
        setLoading(false);

        if (res.success) {
            addToast('Password updated successfully', 'success');
            setShowPasswordUpdate(false);
            setNewPassword('');
            setConfirmPassword('');
        } else {
            addToast(res.error || 'Failed to update password', 'error');
        }
    };

    // --- MFA Handlers ---
    const startMFAEnrollment = async () => {
        setLoading(true);
        const res = await enrollMFA();
        setLoading(false);

        if (res.success && res.qrCode && res.factorId) {
            setQrCodeData({ id: res.factorId, qr: res.qrCode, secret: res.secret });
            setShowMFAEnroll(true);
        } else {
            addToast(res.error || 'Failed to start enrollment', 'error');
        }
    };

    const confirmMFAEnrollment = async () => {
        if (!verifyCode || !qrCodeData) return;
        setLoading(true);
        const res = await verifyMFA(qrCodeData.id, verifyCode);
        setLoading(false);

        if (res.success) {
            addToast('Two-Factor Authentication Enabled', 'success');
            setShowMFAEnroll(false);
            setQrCodeData(null);
            setVerifyCode('');
            fetchSecurityData();
        } else {
            addToast(res.error || 'Invalid code', 'error');
        }
    };

    const handleUnenrollMFA = async (factorId: string) => {
        if (!confirm('Are you sure you want to disable 2FA? This will lower your account security.')) return;

        setLoading(true);
        const res = await unenrollMFA(factorId);
        setLoading(false);

        if (res.success) {
            addToast('2FA Disabled', 'success');
            fetchSecurityData();
        } else {
            addToast(res.error || 'Failed to disable 2FA', 'error');
        }
    };

    return (
        <main className="bg-[#FAF9F7] dark:bg-black min-h-screen py-8 pb-24 md:pb-12 transition-colors duration-300">
            <div className="container-premium max-w-[800px] mx-auto px-4 md:px-0">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-navy-900 dark:text-white border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Login & Security</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your password and account security.</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">

                    {/* Password Section */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm transition-colors">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                                <Key size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Password</h2>
                        </div>

                        {!showPasswordUpdate ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-navy-900 dark:text-white">Change Password</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Regularly updating your password improves security.</div>
                                </div>
                                <button
                                    onClick={() => setShowPasswordUpdate(true)}
                                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/20 text-sm font-bold text-navy-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                                >
                                    Update
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-3">
                                    <div className="relative">
                                        <input
                                            type={showPw ? 'text' : 'password'}
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-navy-900 dark:focus:border-white/50 transition-colors text-navy-900 dark:text-white"
                                        />
                                        <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-900 dark:hover:text-white">
                                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-navy-900 dark:focus:border-white/50 transition-colors text-navy-900 dark:text-white"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleUpdatePassword}
                                        disabled={loading}
                                        className="flex-1 bg-navy-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                        Update Password
                                    </button>
                                    <button
                                        onClick={() => setShowPasswordUpdate(false)}
                                        className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2FA Section */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm transition-colors">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Smartphone size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Two-Factor Authentication</h2>
                        </div>

                        {mfaFactors.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-700 dark:text-green-300">
                                            <Shield size={16} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-green-800 dark:text-green-300">MFA Enabled</div>
                                            <div className="text-xs text-green-600 dark:text-green-400">Your account is protected with an authenticator app.</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleUnenrollMFA(mfaFactors[0].id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Disable MFA"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            !showMFAEnroll ? (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-navy-900 dark:text-white">Authenticator App</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Secure your account with Google Authenticator or similar apps.</div>
                                    </div>
                                    <button
                                        onClick={startMFAEnrollment}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-900 dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity"
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
                                        Setup
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="p-4 bg-gray-50 dark:bg-black/40 rounded-xl border border-gray-100 dark:border-white/10 flex flex-col md:flex-row gap-6 items-center">
                                        {qrCodeData && (
                                            <div className="bg-white p-2 rounded-lg">
                                                <QRCode value={qrCodeData.qr} size={140} />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="font-bold text-navy-900 dark:text-white mb-1">Scan QR Code</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Open your authenticator app (Google Authenticator, Authy, etc.) and scan this code.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-gray-500">Enter Verification Code</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="000 000"
                                                        value={verifyCode}
                                                        onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                        className="flex-1 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:border-navy-900 dark:focus:border-white/50 text-center tracking-widest font-mono text-lg"
                                                    />
                                                    <button
                                                        onClick={confirmMFAEnrollment}
                                                        disabled={loading || verifyCode.length !== 6}
                                                        className="bg-navy-900 dark:bg-white text-white dark:text-black font-bold px-6 rounded-lg disabled:opacity-50"
                                                    >
                                                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowMFAEnroll(false)}
                                        className="w-full py-2 text-sm text-gray-500 hover:text-navy-900 dark:hover:text-white"
                                    >
                                        Cancel Setup
                                    </button>
                                </div>
                            )
                        )}
                    </div>

                    {/* Devices Section */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm transition-colors">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/10 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                                <Shield size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Login Sessions</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Always show current session */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                    <div>
                                        <div className="font-bold text-sm text-navy-900 dark:text-white">Current Session</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Active Now</div>
                                    </div>
                                </div>
                            </div>

                            {/* Show detailed sessions if available (placeholder mainly as session list is restricted) */}
                            {sessions.length > 0 && sessions.map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                                        <div>
                                            <div className="font-bold text-sm text-navy-900 dark:text-white">Other Session</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Last active: {new Date(s.last_sign_in_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {sessions.length === 0 && (
                                <p className="text-xs text-gray-400 italic text-center pt-2">
                                    Detailed session history is managed by your provider.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
