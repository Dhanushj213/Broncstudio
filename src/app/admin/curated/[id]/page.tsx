'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Search, Plus, X, Check } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import Image from 'next/image';
import { getGoogleDriveDirectLink } from '@/utils/googleDrive';

interface Product {
    id: string;
    name: string;
    images: string[];
    price: number;
    metadata?: {
        curated_section_ids?: string[];
    };
}

export default function EditCollectionPage() {
    const params = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Collection Data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        is_active: true,
        display_order: 0
    });

    // Product Management
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);

        // 1. Fetch Collection
        const { data: collection, error: collError } = await supabase
            .from('curated_sections')
            .select('*')
            .eq('id', id)
            .single();

        if (collError) {
            addToast('Error loading collection', 'error');
            router.push('/admin/curated');
            return;
        }

        setFormData(collection);

        // 2. Fetch All Products (for selection)
        // Optimization: In a real large app, you'd search server-side. 
        // For < 1000 products, client-side filtering is instant and better UX.
        const { data: products } = await supabase
            .from('products')
            .select('id, name, images, price, metadata');

        if (products) {
            setAllProducts(products);
        }

        setLoading(false);
    };

    const handleSaveDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from('curated_sections')
            .update(formData)
            .eq('id', id);

        if (error) {
            addToast(`Error: ${error.message}`, 'error');
        } else {
            addToast('Collection details saved', 'success');
        }
        setSaving(false);
    };

    // --- Product Assignment Logic ---

    // Derived state: Products currently in this collection
    const assignedProducts = allProducts.filter(p =>
        p.metadata?.curated_section_ids?.includes(id)
    );

    // Derived state: Products NOT in this collection (filtered by search)
    const availableProducts = allProducts.filter(p =>
        !p.metadata?.curated_section_ids?.includes(id) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 10); // Show top 10 matches


    const addProductToCollection = async (product: Product) => {
        const currentIds = product.metadata?.curated_section_ids || [];
        if (currentIds.includes(id)) return;

        const newIds = [...currentIds, id];

        // Optimistic Update
        updateLocalProduct(product.id, newIds);

        const { error } = await supabase
            .from('products')
            .update({
                metadata: {
                    ...product.metadata,
                    curated_section_ids: newIds
                }
            })
            .eq('id', product.id);

        if (error) {
            addToast('Failed to add product', 'error');
            updateLocalProduct(product.id, currentIds); // Revert
        } else {
            addToast('Product added to collection', 'success');
        }
    };

    const removeProductFromCollection = async (product: Product) => {
        const currentIds = product.metadata?.curated_section_ids || [];
        const newIds = currentIds.filter(cid => cid !== id);

        // Optimistic Update
        updateLocalProduct(product.id, newIds);

        const { error } = await supabase
            .from('products')
            .update({
                metadata: {
                    ...product.metadata,
                    curated_section_ids: newIds
                }
            })
            .eq('id', product.id);

        if (error) {
            addToast('Failed to remove product', 'error');
            updateLocalProduct(product.id, currentIds); // Revert
        } else {
            addToast('Product removed', 'success');
        }
    };

    const updateLocalProduct = (pid: string, newIds: string[]) => {
        setAllProducts(prev => prev.map(p =>
            p.id === pid
                ? { ...p, metadata: { ...p.metadata, curated_section_ids: newIds } }
                : p
        ));
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/curated">
                    <button className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={24} />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Collection</h1>
                    <p className="text-gray-500 text-sm">Update details and manage products.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Details Form */}
                <div className="lg:col-span-1 space-y-6">
                    <form onSubmit={handleSaveDetails} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4 sticky top-6">
                        <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-2">Details</h3>

                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-gray-900 uppercase mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 font-bold text-gray-900"
                            />
                        </div>

                        {/* Subtitle */}
                        <div>
                            <label className="block text-xs font-bold text-gray-900 uppercase mb-1">Subtitle</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-navy-900"
                            />
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block text-xs font-bold text-gray-900 uppercase mb-1">Image URL</label>
                            <div className="space-y-2">
                                <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                                    {formData.image_url ? (
                                        <Image src={getGoogleDriveDirectLink(formData.image_url)} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-gray-300">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg text-xs"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center justify-between py-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="rounded text-coral-500 focus:ring-coral-500"
                                />
                                <span className="text-sm font-medium">Active</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-900 uppercase">Order</span>
                                <input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-16 px-2 py-1 bg-white text-gray-900 border border-gray-200 rounded text-sm text-center"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Save Details
                        </button>
                    </form>
                </div>

                {/* RIGHT: Product Management */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Assigned Products List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-900">
                                Assigned Products
                                <span className="ml-2 bg-coral-100 text-coral-600 px-2 py-0.5 rounded-full text-xs align-middle">
                                    {assignedProducts.length}
                                </span>
                            </h3>
                        </div>

                        {assignedProducts.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 bg-gray-50/50">
                                <p>No products in this collection yet.</p>
                                <p className="text-sm">Search and add products below.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {assignedProducts.map(product => (
                                    <div key={product.id} className="p-3 flex items-center justify-between hover:bg-gray-50 group transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                                                {product.images?.[0] && (
                                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{product.name}</div>
                                                <div className="text-gray-500 text-xs">₹{product.price}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeProductFromCollection(product)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove from collection"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add Products */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 mb-3">Add Products</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search products by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-navy-900 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                            {searchQuery.length > 0 && availableProducts.length === 0 ? (
                                <div className="p-4 text-center text-gray-400">No matching products found.</div>
                            ) : availableProducts.length === 0 && searchQuery.length === 0 ? (
                                <div className="p-4 text-center text-gray-400 text-sm">Start typing to search products...</div>
                            ) : (
                                availableProducts.map(product => (
                                    <div key={product.id} className="p-3 flex items-center justify-between hover:bg-blue-50/50 group transition-colors cursor-pointer" onClick={() => addProductToCollection(product)}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                                                {product.images?.[0] && (
                                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                                )}
                                            </div>
                                            <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                                        </div>
                                        <button
                                            className="p-1.5 bg-blue-100 text-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
