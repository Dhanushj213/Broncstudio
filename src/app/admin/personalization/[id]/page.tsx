'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Save, Loader2, Trash2, Plus, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Placement {
    name: string;
    max_w: number;
    max_h: number;
}

export default function EditPersonalizedProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State matching Strict Spec
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '', // Still needed for internal DB org, but not shown to customer as "Category"
        images: [] as string[],

        // Pricing
        base_price: 699,
        print_price: 249,

        // Config
        colors: [] as string[],
        sizes: [] as string[],
        print_types: ['DTG'] as string[],
        placements: [] as Placement[],

        // Image Rules (Global default for now, but editable per product if needed, though spec says global)
        min_dpi: 300
    });

    const [imageInput, setImageInput] = useState('');
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);

    // Helper for Placements
    const [newPlacement, setNewPlacement] = useState<Placement>({ name: 'Front', max_w: 10, max_h: 12 });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        Promise.all([fetchCategories(), fetchProduct()]);
    }, [id]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('id, name');
        if (data) setCategories(data);
    };

    const fetchProduct = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            router.push('/admin/personalization');
            return;
        }

        const meta = data.metadata?.personalization || {};

        // Map DB data to local state
        // Handle legacy "placements" (array of strings) vs new (array of objects)
        let loadedPlacements: Placement[] = [];
        if (Array.isArray(meta.placements)) {
            if (typeof meta.placements[0] === 'string') {
                // Migrate legacy string array
                loadedPlacements = meta.placements.map((p: string) => ({ name: p, max_w: 10, max_h: 12 }));
            } else {
                loadedPlacements = meta.placements;
            }
        }

        setFormData({
            name: data.name,
            description: data.description || '',
            category_id: data.category_id,
            images: data.images || [],

            base_price: data.price, // Base price stored in main column
            print_price: meta.print_price || 199,

            colors: meta.colors || [],
            sizes: meta.sizes || [],
            print_types: meta.print_types || (meta.print_type ? [meta.print_type] : ['DTG']),
            placements: loadedPlacements,
            min_dpi: meta.image_requirements?.min_dpi || 300
        });
        setLoading(false);
    };

    const handleAddPlacement = () => {
        setFormData({
            ...formData,
            placements: [...formData.placements, newPlacement]
        });
        setNewPlacement({ name: 'Back', max_w: 10, max_h: 12 }); // Reset to default
    };

    const handleRemovePlacement = (idx: number) => {
        const updated = [...formData.placements];
        updated.splice(idx, 1);
        setFormData({ ...formData, placements: updated });
    };

    const handleAddImage = () => {
        if (!imageInput.trim()) return;
        setFormData({ ...formData, images: [...formData.images, imageInput.trim()] });
        setImageInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const metadata = {
            personalization: {
                enabled: true,
                base_product: true, // Marker
                colors: formData.colors,
                sizes: formData.sizes,
                print_types: formData.print_types,
                placements: formData.placements,
                print_price: formData.print_price,
                image_requirements: {
                    min_dpi: formData.min_dpi,
                    max_size_mb: 20
                }
            },
            // Legacy fields for listing safety (though hidden from main store)
            gender_visibility: [],
            is_pet: false
        };

        const { error } = await supabase
            .from('products')
            .update({
                name: formData.name,
                description: formData.description,
                category_id: formData.category_id,
                price: formData.base_price, // Main price col is BASE PRICE
                images: formData.images,
                metadata: metadata
            })
            .eq('id', id);

        if (error) {
            alert('Failed to save: ' + error.message);
        } else {
            router.push('/admin/personalization');
            router.refresh();
        }
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    const gstAmount = (formData.base_price + formData.print_price) * 0.18;
    const totalEstimate = formData.base_price + formData.print_price + gstAmount;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-6">
                <Link href="/admin/personalization" className="text-gray-500 hover:text-navy-900 flex items-center gap-1 mb-4">
                    <ArrowLeft size={18} /> Back
                </Link>
                <h1 className="text-2xl font-bold text-navy-900">Edit Base Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. Base Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">1. Base Product Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Base Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Archive Category</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                value={formData.category_id}
                                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                required
                            >
                                <option value="">Select Internal Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Pricing */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">2. Pricing Structure</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Base Product Price (₹)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-blue-200 bg-blue-50 rounded-lg font-bold text-blue-900"
                                value={formData.base_price}
                                onChange={e => setFormData({ ...formData, base_price: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Printing Charge (₹)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-green-200 bg-green-50 rounded-lg font-bold text-green-900"
                                value={formData.print_price}
                                onChange={e => setFormData({ ...formData, print_price: Number(e.target.value) })}
                            />
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">Customer Price Check (Approx)</p>
                            <p className="text-sm">Base: ₹{formData.base_price}</p>
                            <p className="text-sm">Print: ₹{formData.print_price}</p>
                            <p className="text-sm text-gray-400">GST (18%): ₹{gstAmount.toFixed(2)}</p>
                            <p className="font-bold text-navy-900 border-t border-gray-200 mt-1 pt-1">Total: ₹{totalEstimate.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* 3. Configuration */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">3. Personalization Config</h2>

                    {/* Print Types */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Allowed Print Types</label>
                        <div className="flex gap-4">
                            {['DTG', 'Embroidery'].map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-navy-900">
                                    <input
                                        type="checkbox"
                                        checked={formData.print_types.includes(type)}
                                        onChange={e => {
                                            const updated = e.target.checked
                                                ? [...formData.print_types, type]
                                                : formData.print_types.filter(t => t !== type);
                                            setFormData({ ...formData, print_types: updated });
                                        }}
                                        className="rounded text-navy-900"
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Placements */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Print Placements (Zones)</label>

                        {/* List */}
                        <div className="space-y-2 mb-4">
                            {formData.placements.map((p, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                    <span className="font-bold text-navy-900 w-32">{p.name}</span>
                                    <span className="text-sm text-gray-500">Max: {p.max_w}" x {p.max_h}"</span>
                                    <button type="button" onClick={() => handleRemovePlacement(idx)} className="ml-auto text-red-500 hover:bg-red-50 p-1 rounded">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add New */}
                        <div className="flex gap-2 items-end bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                            <div>
                                <label className="text-xs font-bold text-gray-500">Zone Name</label>
                                <select
                                    className="w-full p-2 text-sm rounded border border-gray-200"
                                    value={newPlacement.name}
                                    onChange={e => setNewPlacement({ ...newPlacement, name: e.target.value })}
                                >
                                    {['Front', 'Back', 'Left Pocket', 'Right Pocket', 'Left Sleeve', 'Right Sleeve'].map(o => (
                                        <option key={o} value={o}>{o}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Width (in)</label>
                                <input
                                    type="number" className="w-20 p-2 text-sm rounded border border-gray-200"
                                    value={newPlacement.max_w}
                                    onChange={e => setNewPlacement({ ...newPlacement, max_w: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Height (in)</label>
                                <input
                                    type="number" className="w-20 p-2 text-sm rounded border border-gray-200"
                                    value={newPlacement.max_h}
                                    onChange={e => setNewPlacement({ ...newPlacement, max_h: Number(e.target.value) })}
                                />
                            </div>
                            <button type="button" onClick={handleAddPlacement} className="px-3 py-2 bg-navy-900 text-white rounded text-sm font-bold">Add</button>
                        </div>
                    </div>
                </div>

                {/* 4. Images */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">4. Base Images</h2>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                            placeholder="Image URL..."
                            value={imageInput}
                            onChange={e => setImageInput(e.target.value)}
                        />
                        <button type="button" onClick={handleAddImage} className="bg-navy-900 text-white px-4 rounded-lg font-bold">Add</button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {formData.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square border rounded-lg overflow-hidden group">
                                <Image src={img} alt="Base" fill className="object-cover" />
                                <button type="button" onClick={() => {
                                    const newImgs = [...formData.images];
                                    newImgs.splice(idx, 1);
                                    setFormData({ ...formData, images: newImgs });
                                }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save */}
                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg shadow-coral-500/20 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        Save Base Product
                    </button>
                </div>

            </form>
        </div>
    );
}
