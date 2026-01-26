'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Search, Save, AlertTriangle, Check, Loader2, Layers } from 'lucide-react';
import Link from 'next/link';

interface ProductInventory {
    id: string;
    name: string;
    stock_quantity: number;
    price: number;
    image_url: string;
}

export default function InventoryPage() {
    const [products, setProducts] = useState<ProductInventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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
            .select('id, name, stock_quantity, price, image_url')
            .order('stock_quantity', { ascending: true }); // Low stock first

        if (error) {
            console.error('Error fetching inventory:', error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    const handleStockUpdate = async (id: string, newQuantity: string) => {
        const qty = parseInt(newQuantity);
        if (isNaN(qty)) return;

        setProducts(products.map(p => p.id === id ? { ...p, stock_quantity: qty } : p));
    };

    const saveStock = async (id: string, newQuantity: number) => {
        setSavingId(id);
        const { error } = await supabase
            .from('products')
            .update({ stock_quantity: newQuantity })
            .eq('id', id);

        if (error) {
            alert('Failed to update stock');
        } else {
            // Success indicator could be added here
        }
        setSavingId(null);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Inventory Management</h1>
                    <p className="text-gray-500 text-sm">Track and update product stock levels</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
                    />
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 size={40} className="animate-spin mb-4 text-navy-900" />
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
                            <thead className="bg-[#FAF9F7] text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Current Stock</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Update</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="font-bold text-navy-900">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0"
                                                value={product.stock_quantity}
                                                onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                                                className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg font-bold text-navy-900 focus:outline-none focus:border-navy-900 transition-all text-center"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.stock_quantity <= 10 ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                                    <AlertTriangle size={12} /> Low Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                    In Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => saveStock(product.id, product.stock_quantity)}
                                                disabled={savingId === product.id}
                                                className="p-2 hover:bg-navy-50 text-navy-900 rounded-lg transition-colors"
                                                title="Save Stock"
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
