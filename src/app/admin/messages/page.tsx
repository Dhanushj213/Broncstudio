'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Mail, Users, ArrowUpRight, Copy, Check, MessageSquare, Trash2, Loader2, Calendar } from 'lucide-react';

interface Subscriber {
    id: string;
    email: string;
    created_at: string;
}

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
    status: string;
}

export default function MessagesPage() {
    const [activeTab, setActiveTab] = useState<'messages' | 'subscribers'>('messages');
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        if (activeTab === 'messages') {
            const { data } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });
            if (data) setMessages(data);
        } else {
            const { data } = await supabase
                .from('subscribers')
                .select('*')
                .order('created_at', { ascending: false });
            if (data) setSubscribers(data);
        }
        setLoading(false);
    };

    const copyEmails = () => {
        const emails = subscribers.map(s => s.email).join(', ');
        navigator.clipboard.writeText(emails);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    };

    return (
        <div className="max-w-[1400px] mx-auto px-6 pb-20 pt-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        <span>Admin Dashboard</span>
                        <ArrowUpRight size={12} />
                        <span className="text-navy-900 dark:text-white">Communication</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-navy-900 dark:text-white tracking-tight">Inbox & Subscribers</h1>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 w-fit mb-8 shadow-sm">
                <button
                    onClick={() => setActiveTab('messages')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'messages'
                        ? 'bg-navy-900 text-white shadow-lg'
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                >
                    <MessageSquare size={16} />
                    Messages
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">{messages.length > 0 ? messages.length : ''}</span>
                </button>
                <button
                    onClick={() => setActiveTab('subscribers')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'subscribers'
                        ? 'bg-navy-900 text-white shadow-lg'
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                >
                    <Users size={16} />
                    Subscribers
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">{subscribers.length > 0 ? subscribers.length : ''}</span>
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                    <Loader2 size={32} className="animate-spin mb-4" />
                    <p className="font-medium">Loading...</p>
                </div>
            ) : (
                <>
                    {activeTab === 'messages' && (
                        <div className="grid gap-6">
                            {messages.length === 0 ? (
                                <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                                    <Mail size={40} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-bold text-navy-900 dark:text-white">No messages yet</h3>
                                    <p className="text-gray-500">Messages from the contact form will appear here.</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-navy-200 dark:hover:border-white/20 transition-all shadow-sm hover:shadow-xl group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-navy-50 dark:bg-white/10 flex items-center justify-center text-navy-900 dark:text-white font-bold text-lg">
                                                        {msg.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-navy-900 dark:text-white leading-tight">{msg.name}</h4>
                                                        <p className="text-xs text-gray-500">{formatDate(msg.created_at)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-4 space-y-2">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 dark:bg-black/20 px-3 py-2 rounded-lg w-fit">
                                                    <Mail size={12} />
                                                    {msg.email}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl text-sm text-gray-600 dark:text-gray-300 min-h-[100px]">
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'subscribers' && (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <button
                                    onClick={copyEmails}
                                    className="flex items-center gap-2 text-sm font-bold text-navy-900 dark:text-white bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 rounded-xl hover:bg-navy-50 dark:hover:bg-white/10 transition-colors"
                                >
                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy All Emails'}
                                </button>
                            </div>

                            <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden">
                                {subscribers.length === 0 ? (
                                    <div className="text-center py-20 px-6">
                                        <Users size={40} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-bold text-navy-900 dark:text-white">No subscribers yet</h3>
                                        <p className="text-gray-500">Email subscriptions from the footer will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</th>
                                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Subscribed On</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                                {subscribers.map((sub) => (
                                                    <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3 font-medium text-navy-900 dark:text-white">
                                                                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                                                    <Mail size={14} />
                                                                </div>
                                                                {sub.email}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {formatDate(sub.created_at)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
