'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Search, Filter, Edit, Trash2, Palette, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: number;
    category_id: string;
    images: string[];
    description: string;
    created_at: string;
    metadata?: {
        personalization?: {
            enabled: boolean;
            print_type?: string;
        };
        stock_status?: string;
    };
}

export default function AdminPersonalizationPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        // Fetch ALL and filter on client is easiest for JSONB, 
        // OR use specific query if metadata is indexed. 
        // For now, client side filtering is reliable for small catalogs.
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
        } else {
            // Filter: Only products with personalization.enabled = true
            const personalized = (data || []).filter((p: Product) =>
                p.metadata?.personalization?.enabled === true
            );
            setProducts(personalized);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product base?')) return;

        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            alert(`Failed to delete product: ${error.message}`);
        } else {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
                        <Palette className="text-coral-500" />
                        Personalization Products
                    </h1>
                    <p className="text-gray-500 text-sm">Manage customizable product bases</p>
                </div>
                {/* 
                  Option 1: Link to generic 'Add Product' but instructed to enable personalization? 
                  Option 2: Special 'Add Personalizable' that auto-enables?
                  Let's just link to standard Add for now, but maybe with a clear UI hint.
                */}
                <Link href="/admin/products/new">
                    <button className="bg-navy-900 text-white hover:bg-navy-800 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-navy-900/20 transition-all">
                        <Plus size={20} />
                        Add New Base
                    </button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search base products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                    />
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50">
                    <Filter size={18} />
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 size={40} className="animate-spin mb-4 text-navy-900" />
                        <p>Loading catalog...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Palette size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No personalizable products found</p>
                        <p className="text-sm text-gray-400 mb-4">Add a product and enable "Personalization" in config.</p>
                        <Link href="/admin/products/new" className="text-coral-500 hover:text-coral-600 font-bold inline-block">
                            Create Product
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#FAF9F7] text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Product Base</th>
                                    <th className="px-6 py-4">Print Type</th>
                                    <th className="px-6 py-4">Base Price</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 relative">
                                                    {product.images?.[0] ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full text-gray-300">
                                                            <Palette size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="font-bold text-navy-900">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-bold border border-purple-100">
                                                {product.metadata?.personalization?.print_type || 'Custom'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-navy-900">
                                            ₹{product.price}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs flex items-center gap-1 w-fit">
                                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Re-use standard edit page for now since it supports everything */}
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                                                        <Edit size={18} />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
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
