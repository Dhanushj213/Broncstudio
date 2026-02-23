'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, ShieldAlert, UserCheck, Search, Shield, ShieldOff, AlertTriangle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface UserProfile {
    id: string;
    email: string;
    role: 'user' | 'admin' | 'super_admin';
    created_at: string;
}

export default function SuperAdminPage() {
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useToast();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        // Ensure email fetching goes through the secure raw profiles route if accessible
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            addToast('Error fetching user profiles. Ensure Super Admin policies are applied.', 'error');
            console.error(error);
        } else if (data) {
            setProfiles(data as UserProfile[]);
        }
        setLoading(false);
    };

    const handleRoleUpdate = async (userId: string, newRole: 'user' | 'admin' | 'super_admin') => {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            addToast(`Failed to update role: ${error.message}`, 'error');
        } else {
            addToast('User role updated successfully!', 'success');
            // Optimistic update
            setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
        }
    };

    const filteredProfiles = profiles.filter(p =>
        (p.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShieldAlert className="text-coral-500" /> Super Admin Control
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage administrator access strictly across the platform.</p>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 p-4 rounded-xl flex gap-3 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                <div className="text-sm">
                    <strong>Critical Security Area:</strong> Granting 'admin' status furnishes full write-access to the store's inventory, orders, and site settings. Treat role elevation with extreme caution.
                </div>
            </div>

            <div className="bg-white dark:bg-[#111827] shadow-sm rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 text-gray-500 dark:text-gray-400 flex items-center">
                        <Search className="absolute left-3 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by email or role..."
                            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-coral-500 transition-colors text-gray-900 dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                        {filteredProfiles.length} Users Found
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
                    </div>
                ) : profiles.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No profiles found. Either the database is empty or Super Admin RLS is blocking the query.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                            <thead className="bg-[#F8F9FA] dark:bg-[#1A2234] text-gray-900 dark:text-white uppercase font-bold text-xs sticky top-0 z-10 shadow-sm border-b border-gray-200 dark:border-white/10">
                                <tr>
                                    <th className="px-6 py-4">User Details</th>
                                    <th className="px-6 py-4">Role Status</th>
                                    <th className="px-6 py-4">Joined On</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {filteredProfiles.map((profile) => (
                                    <tr key={profile.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 dark:text-white">
                                                {profile.email || 'No Email Listed (OAuth/Anonymous)'}
                                            </div>
                                            <div className="text-xs text-gray-400 font-mono mt-1 w-48 truncate" title={profile.id}>
                                                ID: {profile.id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit ${profile.role === 'super_admin'
                                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                                                    : profile.role === 'admin'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                {profile.role === 'super_admin' && <ShieldAlert size={12} />}
                                                {profile.role === 'admin' && <Shield size={12} />}
                                                {profile.role === 'user' && <UserCheck size={12} />}
                                                {profile.role.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(profile.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {/* Action Toggles */}
                                            {profile.role === 'super_admin' ? (
                                                <span className="text-xs text-gray-400 italic">Core Owner</span>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2">
                                                    {profile.role === 'admin' ? (
                                                        <button
                                                            onClick={() => handleRoleUpdate(profile.id, 'user')}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-lg text-xs font-bold transition-colors border border-red-100 dark:border-red-500/20"
                                                        >
                                                            <ShieldOff size={14} /> Revoke Admin
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleRoleUpdate(profile.id, 'admin')}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 rounded-lg text-xs font-bold transition-colors border border-blue-100 dark:border-blue-500/20"
                                                        >
                                                            <Shield size={14} /> Make Admin
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
