'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Search, Save, AlertTriangle, Check, Loader2, Layers } from 'lucide-react';
import Link from 'next/link';

interface ProductInventory {
    id: string;
    name: string;
    price: number;
    images: string[];
    metadata?: {
        stock_status?: string;
    };
}

export default function InventoryPage() {
    const [products, setProducts] = useState<ProductInventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [savingId, setSavingId] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching inventory:', error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    const handleStatusUpdate = (id: string, newStatus: string) => {
        setProducts(products.map(p =>
            p.id === id
                ? { ...p, metadata: { ...p.metadata, stock_status: newStatus } }
                : p
        ));
    };

    const saveStock = async (id: string, currentStatus: string) => {
        setSavingId(id);

        // 1. Get current metadata to avoid overwriting other fields
        const product = products.find(p => p.id === id);
        if (!product) return;

        const updatedMetadata = {
            ...(product.metadata || {}),
            stock_status: currentStatus
        };

        const { error } = await supabase
            .from('products')
            .update({ metadata: updatedMetadata })
            .eq('id', id);

        if (error) {
            alert('Failed to update stock status');
            console.error(error);
        }
        setSavingId(null);
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const status = p.metadata?.stock_status || 'in_stock';

        if (filter === 'all') return matchesSearch;
        return matchesSearch && status === filter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Track and update product stock levels</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex gap-1 w-fit">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-navy-900 dark:bg-coral-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('low_stock')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'low_stock' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                    >
                        Low Stock
                    </button>
                    <button
                        onClick={() => setFilter('out_of_stock')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'out_of_stock' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                    >
                        Out of Stock
                    </button>
                </div>

                <div className="relative flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-lg focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 size={40} className="animate-spin mb-4 text-navy-900 dark:text-white" />
                        <p>Loading inventory...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Layers size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No products found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#FAF9F7] dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs border-b border-gray-100 dark:border-white/5">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Stock Status</th>
                                    <th className="px-6 py-4">Visual Indicator</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 overflow-hidden border border-gray-200 dark:border-white/10">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white">{product.name}</div>
                                                    <div className="text-xs text-gray-400 dark:text-gray-500">₹{product.price}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={product.metadata?.stock_status || 'in_stock'}
                                                onChange={(e) => handleStatusUpdate(product.id, e.target.value)}
                                                className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-navy-900 dark:focus:border-coral-500 bg-white dark:bg-slate-900 cursor-pointer"
                                            >
                                                <option value="in_stock">In Stock</option>
                                                <option value="low_stock">Low Stock</option>
                                                <option value="out_of_stock">Out of Stock</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.metadata?.stock_status === 'out_of_stock' ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full">
                                                    <AlertTriangle size={12} /> Out of Stock
                                                </span>
                                            ) : product.metadata?.stock_status === 'low_stock' ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                                                    <AlertTriangle size={12} /> Low Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                                    <Check size={12} className="mr-1" /> In Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => saveStock(product.id, product.metadata?.stock_status || 'in_stock')}
                                                disabled={savingId === product.id}
                                                className="p-2 hover:bg-navy-50 dark:hover:bg-white/10 text-navy-900 dark:text-white rounded-lg transition-colors"
                                                title="Save Status"
                                            >
                                                {savingId === product.id ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                            </button>
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
