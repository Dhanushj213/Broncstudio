'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Search, Filter, Edit, Trash2, Package, Loader2 } from 'lucide-react';
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
        stock_status?: string;
        is_featured?: boolean;
        is_new_arrival?: boolean;
        personalization?: {
            enabled: boolean;
        };
    };
}

import { useToast } from '@/context/ToastContext';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            addToast('Failed to load products', 'error');
        } else {
            // Filter: EXCLUDE products with personalization.enabled = true
            const standard = (data || []).filter((p: Product) =>
                !p.metadata?.personalization?.enabled
            );
            setProducts(standard);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            addToast(`Failed to delete product: ${error.message}`, 'error');
        } else {
            setProducts(products.filter(p => p.id !== id));
            addToast('Product deleted successfully', 'success');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleFeatured = async (product: Product, currentStatus: boolean) => {
        // If turning ON, check limit first
        if (!currentStatus) {
            const featuredCount = products.filter(p => p.metadata?.is_featured).length;
            if (featuredCount >= 28) {
                addToast("Limit Reached: Only 28 featured products allowed.", 'error');
                return;
            }
        }

        // Optimistic Update
        const updatedProducts = products.map(p =>
            p.id === product.id
                ? { ...p, metadata: { ...p.metadata, is_featured: !currentStatus } }
                : p
        );
        setProducts(updatedProducts);

        // API Update
        const { error } = await supabase
            .from('products')
            .update({
                metadata: {
                    ...product.metadata,
                    is_featured: !currentStatus
                }
            })
            .eq('id', product.id);

        if (error) {
            console.error('Update error:', error);
            addToast('Failed to update featured status', 'error');
            // Revert on error
            setProducts(products);
        } else {
            // Optional success toast
            // addToast(currentStatus ? 'Removed from Featured' : 'Added to Featured', 'success');
        }
    };

    const handleToggleNewArrival = async (product: Product, currentStatus: boolean) => {
        // If turning ON, check limit first
        if (!currentStatus) {
            const newCount = products.filter(p => p.metadata?.is_new_arrival).length;
            if (newCount >= 12) {
                addToast("Limit Reached: Only 12 new arrival products allowed.", 'error');
                return;
            }
        }

        // Optimistic Update
        const updatedProducts = products.map(p =>
            p.id === product.id
                ? { ...p, metadata: { ...p.metadata, is_new_arrival: !currentStatus } }
                : p
        );
        setProducts(updatedProducts);

        // API Update
        const { error } = await supabase
            .from('products')
            .update({
                metadata: {
                    ...product.metadata,
                    is_new_arrival: !currentStatus
                }
            })
            .eq('id', product.id);

        if (error) {
            console.error('Update error:', error);
            addToast('Failed to update new arrival status', 'error');
            // Revert on error
            setProducts(products);
        }
    };

    const styles = {
        toggleWrapper: "relative inline-flex items-center cursor-pointer",
        toggleInput: "sr-only peer",
        toggleSlider: "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-500"
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm">Manage your product catalog</p>
                </div>
                <Link href="/admin/products/new">
                    <button className="bg-navy-900 text-white hover:bg-navy-800 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-navy-900/20 transition-all">
                        <Plus size={20} />
                        Add Product
                    </button>
                </Link>
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
                        className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-colors"
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
                        <p>Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No products found</p>
                        <Link href="/admin/products/new" className="text-coral-500 hover:text-coral-600 font-bold mt-2 inline-block">
                            Create your first product
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#FAF9F7] text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-center">Featured</th>
                                    <th className="px-6 py-4 text-center">New</th>
                                    <th className="px-6 py-4">Stock</th>
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
                                                            <Package size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="font-bold text-gray-900">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                Category
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            ₹{product.price}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <label className={styles.toggleWrapper}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.toggleInput}
                                                    checked={!!product.metadata?.is_featured}
                                                    onChange={() => handleToggleFeatured(product, !!product.metadata?.is_featured)}
                                                />
                                                <div className={styles.toggleSlider}></div>
                                            </label>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <label className={styles.toggleWrapper}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.toggleInput}
                                                    checked={!!product.metadata?.is_new_arrival}
                                                    onChange={() => handleToggleNewArrival(product, !!product.metadata?.is_new_arrival)}
                                                />
                                                <div className={`${styles.toggleSlider} peer-checked:bg-blue-500`}></div>
                                            </label>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {product.metadata?.stock_status === 'out_of_stock' ? (
                                                <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded text-xs">Out of Stock</span>
                                            ) : product.metadata?.stock_status === 'low_stock' ? (
                                                <span className="text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded text-xs">Low Stock</span>
                                            ) : (
                                                <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs">In Stock</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
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
        </div >
    );
}
